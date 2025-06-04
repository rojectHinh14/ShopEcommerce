package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.CartItem.CartItemRequest;
import com.Ecommerce.dto.response.Cart.CartItemResponse;
import com.Ecommerce.dto.response.Cart.CartResponse;
import com.Ecommerce.entity.*;
import com.Ecommerce.repository.*;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.*;
import java.util.stream.Collectors;

@Service
@Transactional
public class CartServiceImpl {
    private final CartRepository cartRepository;
    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserRepository userRepository;
    private final ProductVariantRepository productVariantRepository;


    public CartServiceImpl(CartRepository cartRepository, CartItemRepository cartItemRepository, ProductRepository productRepository, UserRepository userRepository, ProductVariantRepository productVariantRepository) {
        this.cartRepository = cartRepository;
        this.cartItemRepository = cartItemRepository;
        this.productRepository = productRepository;
        this.userRepository = userRepository;
        this.productVariantRepository = productVariantRepository;
    }

    public Cart getOrCreateCartByUser(User user) {
        Optional<Cart> existingCartOpt = cartRepository.findByUser(user);
        if (existingCartOpt.isPresent()) {
            return existingCartOpt.get(); // Trả về giỏ hàng đã tồn tại nếu có
        } else {
            Cart cart = new Cart();
            cart.setUser(user);
            return cartRepository.save(cart); // Tạo mới giỏ hàng nếu chưa có
        }
    }

    public CartResponse addOrUpdateCartItem(User user, CartItemRequest request) {
        Cart cart = getOrCreateCartByUser(user);
        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found"));

        // Parse variantInfo để lấy variantId
        ObjectMapper mapper = new ObjectMapper();
        String variantIdStr = null;
        try {
            String rawVariantInfo = request.getVariantInfo();
            if (rawVariantInfo != null) {
                // Nếu là chuỗi JSON đã được escape (bắt đầu và kết thúc bằng dấu ")
                if (rawVariantInfo.startsWith("\"") && rawVariantInfo.endsWith("\"")) {
                    // Bỏ dấu " ở đầu/cuối và unescape
                    rawVariantInfo = rawVariantInfo.substring(1, rawVariantInfo.length() - 1)
                            .replace("\\\"", "\"");
                }
                Map<String, Object> variantMap = mapper.readValue(rawVariantInfo, new TypeReference<>() {});
                variantIdStr = String.valueOf(variantMap.get("variantId")); // Convert to String to handle both String and Number
            }
        } catch (Exception e) {
            System.err.println("Error parsing variantInfo JSON: " + e.getMessage());
            System.err.println("Raw variantInfo: " + request.getVariantInfo());
            throw new RuntimeException("Invalid variantInfo JSON: " + e.getMessage(), e);
        }

        ProductVariant variant = null;
        if (variantIdStr != null && !variantIdStr.isEmpty()) {
            try {
                Long variantId = Long.valueOf(variantIdStr);
                variant = productVariantRepository.findById(variantId)
                        .orElseThrow(() -> new RuntimeException("Product variant not found with ID: " + variantId));
            } catch (NumberFormatException e) {
                System.err.println("Invalid variantId format: " + variantIdStr);
                throw new RuntimeException("Invalid variantId format", e);
            }
        }

        // Tìm CartItem đang active có cùng product và variant
        Optional<CartItem> existingItemOpt = cart.getCartItems().stream()
                .filter(item -> item.getActive() && 
                        item.getProduct().getId().equals(product.getId()) &&
                        Objects.equals(item.getVariantInfo(), request.getVariantInfo()))
                .findFirst();

        CartItem cartItem;
        if (existingItemOpt.isPresent()) {
            cartItem = existingItemOpt.get();
            // Cập nhật số lượng
            cartItem.setQuantity(cartItem.getQuantity() + request.getQuantity());
            // Đảm bảo item vẫn active
            cartItem.setActive(true);
        } else {
            cartItem = new CartItem();
            cartItem.setCart(cart);
            cartItem.setProduct(product);
            cartItem.setQuantity(request.getQuantity());
            cartItem.setVariantInfo(request.getVariantInfo());
            // Đảm bảo item mới luôn active
            cartItem.setActive(true);
            try {
                CartItem savedCartItem = cartItemRepository.save(cartItem);
                System.out.println("New CartItem saved with ID: " + savedCartItem.getId());
            } catch (Exception e) {
                System.err.println("Error saving new CartItem: " + e.getMessage());
                e.printStackTrace();
                throw e;
            }
        }

        // Set giá biến thể nếu có
        if (variant != null) {
            cartItem.setPrice(variant.getPrice());
        } else {
            cartItem.setPrice(product.getPrice());
        }

        try {
            Cart savedCart = cartRepository.save(cart);
            System.out.println("Cart saved with ID: " + savedCart.getId());
            System.out.println("Number of active items in saved cart: " + 
                savedCart.getCartItems().stream().filter(CartItem::getActive).count());
            return mapCartToResponse(savedCart);
        } catch (Exception e) {
            System.err.println("Error saving Cart: " + e.getMessage());
            e.printStackTrace();
            throw e;
        }
    }

    public CartResponse updateCartItemQuantity(User user, Long cartItemId, Integer quantity) {
        Cart cart = getOrCreateCartByUser(user);

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user's cart");
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }

        return mapCartToResponse(cart);
    }

    public CartResponse removeCartItem(User user, Long cartItemId) {
        Cart cart = getOrCreateCartByUser(user);
        System.out.println("Removing cart item with ID: " + cartItemId + " from cart: " + cart.getId());

        CartItem cartItem = cartItemRepository.findById(cartItemId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        if (!cartItem.getCart().getId().equals(cart.getId())) {
            throw new RuntimeException("Cart item does not belong to user's cart");
        }

        // Xóa thật CartItem thay vì soft delete
        cartItemRepository.delete(cartItem);
        System.out.println("Deleted cart item with ID: " + cartItemId);

        // Get updated cart
        Optional<Cart> updatedCartOpt = cartRepository.findByUserWithCartItems(user);
        Cart updatedCart = updatedCartOpt.orElseThrow(() -> new RuntimeException("Cart not found after update"));
        System.out.println("Updated cart has " + 
            updatedCart.getCartItems().stream().filter(CartItem::getActive).count() + " active items");

        return mapCartToResponse(updatedCart);
    }

    public CartResponse getCart(User user) {
        Optional<Cart> cartOpt = cartRepository.findByUserWithCartItems(user);
        Cart cart;
        if (cartOpt.isPresent()) {
            cart = cartOpt.get();
            System.out.println("Found existing cart with ID: " + cart.getId());
            System.out.println("Number of active items in cart: " + 
                cart.getCartItems().stream().filter(CartItem::getActive).count());
        } else {
            cart = new Cart();
            cart.setUser(user);
            cart = cartRepository.save(cart);
            System.out.println("Created new cart with ID: " + cart.getId());
        }
        return mapCartToResponse(cart);
    }

    private CartResponse mapCartToResponse(Cart cart) {
        CartResponse response = new CartResponse();
        response.setCartId(cart.getId());

        List<CartItemResponse> itemResponses = new ArrayList<>();
        BigDecimal totalPrice = BigDecimal.ZERO;
        ObjectMapper mapper = new ObjectMapper();

        // Chỉ xử lý các mục giỏ hàng đang active
        List<CartItem> activeItems = cart.getCartItems().stream()
            .filter(CartItem::getActive)
            .collect(Collectors.toList());

        for (CartItem item : activeItems) {
            CartItemResponse itemResp = new CartItemResponse();
            itemResp.setId(item.getId());
            itemResp.setProductId(item.getProduct().getId());
            itemResp.setProductName(item.getProduct().getName());
            itemResp.setQuantity(item.getQuantity());
            
            // Lấy ảnh chính của sản phẩm
            String primaryImageUrl = item.getProduct().getImages().stream()
                .filter(ProductImage::getPrimary)
                .findFirst()
                .map(ProductImage::getImageUrl)
                .orElseGet(() -> {
                    // Nếu không có ảnh chính, lấy ảnh đầu tiên
                    List<String> imageUrls = item.getProduct().getImages().stream()
                        .map(ProductImage::getImageUrl)
                        .collect(Collectors.toList());
                    return !imageUrls.isEmpty() ? imageUrls.get(0) : null;
                });
            itemResp.setProductImage(primaryImageUrl);
            
            // Parse variant info
            try {
                String variantInfo = item.getVariantInfo();
                if (variantInfo != null) {
                    // Unescape JSON string if needed
                    if (variantInfo.startsWith("\"") && variantInfo.endsWith("\"")) {
                        variantInfo = variantInfo.substring(1, variantInfo.length() - 1)
                                .replace("\\\"", "\"");
                    }
                    Map<String, Object> variantMap = mapper.readValue(variantInfo, new TypeReference<>() {});
                    String variantName = (String) variantMap.get("variantName");
                    String variantValue = (String) variantMap.get("variantValue");
                    itemResp.setVariantName(variantName);
                    itemResp.setVariantValue(variantValue);
                }
            } catch (Exception e) {
                System.err.println("Error parsing variant info for cart item " + item.getId() + ": " + e.getMessage());
            }
            
            BigDecimal pricePerUnit = item.getPrice() != null ? item.getPrice() : item.getProduct().getPrice();
            itemResp.setPrice(pricePerUnit);
            totalPrice = totalPrice.add(pricePerUnit.multiply(BigDecimal.valueOf(item.getQuantity())));
            itemResponses.add(itemResp);
        }

        response.setItems(itemResponses);
        response.setTotalPrice(totalPrice);
        return response;
    }
}
