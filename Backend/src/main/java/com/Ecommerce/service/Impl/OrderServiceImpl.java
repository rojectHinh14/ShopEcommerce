package com.Ecommerce.service.Impl;

import com.Ecommerce.dto.request.Order.OrderCreateRequest;
import com.Ecommerce.dto.request.Order.OrderUpdateRequest;
import com.Ecommerce.dto.response.Order.OrderResponse;
import com.Ecommerce.dto.response.Order.OrderSummaryResponse;
import com.Ecommerce.entity.*;
import com.Ecommerce.enums.OrderStatus;
import com.Ecommerce.enums.PaymentMethod;
import com.Ecommerce.exception.BusinessException;
import com.Ecommerce.exception.ResourceNotFoundException;
import com.Ecommerce.mapper.OrderMapper;
import com.Ecommerce.repository.*;
import com.nimbusds.jwt.SignedJWT;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@Transactional
@Slf4j
public class OrderServiceImpl {

    private final OrderRepository orderRepository;
    private final UserRepository userRepository;
    private final CartRepository cartRepository;
    private final ProductRepository productRepository;
    private final OrderMapper orderMapper;
    private final OrderItemRepository orderItemRepository;
    private final PaymentRepository paymentRepository;
    private final PaymentService paymentService;

    public OrderServiceImpl(OrderRepository orderRepository, UserRepository userRepository, CartRepository cartRepository, ProductRepository productRepository, OrderMapper orderMapper, OrderItemRepository orderItemRepository, PaymentRepository paymentRepository, PaymentService paymentService) {
        this.orderRepository = orderRepository;
        this.userRepository = userRepository;
        this.cartRepository = cartRepository;
        this.productRepository = productRepository;
        this.orderMapper = orderMapper;
        this.orderItemRepository = orderItemRepository;
        this.paymentRepository = paymentRepository;
        this.paymentService = paymentService;
    }
    private static final BigDecimal TAX_RATE = new BigDecimal("0.10"); // 10% tax

    private User getCurrentUser() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !authentication.isAuthenticated() ||
                authentication.getPrincipal().equals("anonymousUser")) {
            throw new RuntimeException("User not authenticated");
        }

        String token = ((Jwt) authentication.getPrincipal()).getTokenValue();

        try {
            SignedJWT signedJWT = SignedJWT.parse(token);
            String username = signedJWT.getJWTClaimsSet().getSubject();

            User user = userRepository.findByUsername(username)
                    .orElseThrow(() -> new ResourceNotFoundException("User not found with username: " + username));

            return user;
        } catch (Exception e) {
            throw new RuntimeException("Invalid or expired token", e);
        }
    }

    public OrderResponse createOrderFromCart(OrderCreateRequest request) {
        // 1. Get current authenticated user
        User currentUser = getCurrentUser();

        // 2. Get current user's cart
        Cart cart = cartRepository.findByUserId(currentUser.getId())
                .orElseThrow(() -> new BusinessException("Cart is empty"));

        if (cart.getCartItems().isEmpty()) {
            throw new BusinessException("Cannot create order from empty cart");
        }

        // 3. Validate cart items and check stock
        validateCartItems(cart.getCartItems());

        // 4. Calculate totals
        BigDecimal subtotal = calculateSubtotal(cart.getCartItems());
        BigDecimal taxAmount = subtotal.multiply(TAX_RATE);
        BigDecimal totalAmount = subtotal
                .add(request.getShippingFee())
                .add(taxAmount)
                .subtract(request.getDiscountAmount());

        // 5. Create order
        Order order = new Order();
        order.setOrderNumber(generateOrderNumber());
        order.setUser(currentUser); // Use current user
        order.setStatus(OrderStatus.PENDING);
        order.setSubtotal(subtotal);
        order.setShippingFee(request.getShippingFee());
        order.setTaxAmount(taxAmount);
        order.setDiscountAmount(request.getDiscountAmount());
        order.setTotalAmount(totalAmount);
        order.setShippingName(request.getShippingName());
        order.setShippingPhone(request.getShippingPhone());
        order.setShippingAddress(request.getShippingAddress());
        order.setEstimatedDelivery(LocalDateTime.now().plusDays(3)); // Default 3 days

        Order savedOrder = orderRepository.save(order);
        Payment payment = new Payment();
        payment.setOrder(savedOrder);
        payment.setPaymentMethod(request.getPaymentMethod());
        payment.setAmount(totalAmount);  // Lưu số tiền gốc
        payment.setPaymentStatus("PENDING");
        payment.setPaymentDate(LocalDateTime.now());

        // Nếu là thanh toán qua VNPay, tạo URL thanh toán
        if (PaymentMethod.CARD.name().equals(request.getPaymentMethod())) {
            try {
                // Chuyển đổi amount sang VND (đã bao gồm 2 chữ số thập phân cho VNPay)
                BigDecimal vnpayAmount = totalAmount.multiply(BigDecimal.valueOf(100))
                        .setScale(0, RoundingMode.HALF_UP);
                String amount = vnpayAmount.toPlainString();
                
                // Lưu số tiền VNPay
                payment.setVnpayAmount(vnpayAmount);
                
                // Debug logging
                System.out.println("🔍 Creating VNPay payment:");
                System.out.println("- Order Number: " + savedOrder.getOrderNumber());
                System.out.println("- Original amount: " + totalAmount);
                System.out.println("- VNPay amount: " + vnpayAmount);

                // Tạo URL thanh toán với orderNumber
                Map<String, String> vnpayResponse = paymentService.createPaymentUrl(
                    amount, 
                    currentUser.getId().toString(),
                    savedOrder.getOrderNumber()
                );

                // Debug logging
                System.out.println("🔍 VNPay Response: " + vnpayResponse);

                if ("00".equals(vnpayResponse.get("code"))) {
                    // Lưu URL và transactionId vào payment
                    payment.setPaymentUrl(vnpayResponse.get("data"));
                    payment.setTransactionId(vnpayResponse.get("transactionId"));
                    
                    // Debug logging
                    System.out.println("✅ Payment created:");
                    System.out.println("- Transaction ID: " + payment.getTransactionId());
                    System.out.println("- Payment URL: " + payment.getPaymentUrl());
                } else {
                    throw new BusinessException("Failed to create VNPay payment URL: " + vnpayResponse.get("message"));
                }
            } catch (Exception e) {
                System.out.println("❌ VNPay Error: " + e.getMessage());
                e.printStackTrace();
                throw new BusinessException("Failed to process VNPay payment: " + e.getMessage());
            }
        }


        paymentRepository.save(payment);

        // 6. Create order items from cart items
        List<OrderItem> orderItems = createOrderItems(savedOrder, cart.getCartItems());
        savedOrder.setOrderItems(orderItems);
        savedOrder.getPayments().add(payment);

        // 7. Clear cart after successful order creation
        cart.getCartItems().clear();
        cartRepository.save(cart);

        // 8. Update product stock
        updateProductStock(orderItems);

        return orderMapper.mapToResponse(savedOrder);
    }

    private void validateCartItems(List<CartItem> cartItems) {
        for (CartItem cartItem : cartItems) {
            Product product = cartItem.getProduct();
            if (!product.getActive()) {
                throw new BusinessException("Product is no longer available: " + product.getName());
            }
            if (product.getStockQuantity() < cartItem.getQuantity()) {
                throw new BusinessException("Insufficient stock for product: " + product.getName() +
                        ". Available: " + product.getStockQuantity() +
                        ", Requested: " + cartItem.getQuantity());
            }
        }
    }

    private BigDecimal calculateSubtotal(List<CartItem> cartItems) {
        return cartItems.stream()
                .map(item -> {
                    BigDecimal price = item.getPrice(); // Sử dụng giá đã được set trong CartItem
                    if (price == null) {
                        price = item.getProduct().getPrice(); // Fallback to product price if variant price not set
                    }
                    return price.multiply(new BigDecimal(item.getQuantity()));
                })
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderById(Long id) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        // Check if order belongs to current user or user is admin
        if (!order.getUser().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
            throw new BusinessException("Access denied: You can only view your own orders");
        }

        return orderMapper.mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public OrderResponse getOrderByNumber(String orderNumber) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findByOrderNumber(orderNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with number: " + orderNumber));

        // Check if order belongs to current user or user is admin
        if (!order.getUser().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
            throw new BusinessException("Access denied: You can only view your own orders");
        }

        return orderMapper.mapToResponse(order);
    }

    @Transactional(readOnly = true)
    public Page<OrderResponse> getMyOrders(Pageable pageable) {
        User currentUser = getCurrentUser();
        Page<Order> orders = orderRepository.findByUserId(currentUser.getId(), pageable);
        return orders.map(orderMapper::mapToResponse);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @Transactional(readOnly = true)
    public Page<OrderResponse> getOrdersByUserId(Long userId, Pageable pageable) {
        Page<Order> orders = orderRepository.findByUserId(userId, pageable);
        return orders.map(orderMapper::mapToResponse);
    }

    public OrderResponse updateOrder(Long id, OrderUpdateRequest request) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        // Check if order belongs to current user or user is admin
        if (!order.getUser().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
            throw new BusinessException("Access denied: You can only update your own orders");
        }

        // Regular users can only update shipping info for pending/confirmed orders
        if (!isAdmin(currentUser)) {
            if (order.getStatus() != OrderStatus.PENDING && order.getStatus() != OrderStatus.DELIVERED) {
                throw new BusinessException("You can only update shipping information for pending or confirmed orders");
            }

            // Only allow shipping info updates for regular users
            if (request.getStatus() != null) {
                throw new BusinessException("Only administrators can update order status");
            }
        }

        // Admin can update status
        if (request.getStatus() != null && isAdmin(currentUser)) {
            validateStatusTransition(order.getStatus(), request.getStatus());
            order.setStatus(request.getStatus());

            if (request.getStatus() == OrderStatus.DELIVERED && request.getDeliveredAt() != null) {
                order.setDeliveredAt(request.getDeliveredAt());
            }
        }

        // Update shipping information
        if (request.getShippingName() != null) {
            order.setShippingName(request.getShippingName());
        }
        if (request.getShippingPhone() != null) {
            order.setShippingPhone(request.getShippingPhone());
        }
        if (request.getShippingAddress() != null) {
            order.setShippingAddress(request.getShippingAddress());
        }
        if (request.getEstimatedDelivery() != null && isAdmin(currentUser)) {
            order.setEstimatedDelivery(request.getEstimatedDelivery());
        }

        Order updatedOrder = orderRepository.save(order);
        return orderMapper.mapToResponse(updatedOrder);
    }

    public OrderResponse cancelOrder(Long id) {
        User currentUser = getCurrentUser();
        Order order = orderRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Order not found with id: " + id));

        // Check if order belongs to current user or user is admin
        if (!order.getUser().getId().equals(currentUser.getId()) && !isAdmin(currentUser)) {
            throw new BusinessException("Access denied: You can only cancel your own orders");
        }

        if (order.getStatus() == OrderStatus.DELIVERED || order.getStatus() == OrderStatus.CANCELLED) {
            throw new BusinessException("Cannot cancel order with status: " + order.getStatus());
        }

        // Regular users can only cancel pending orders
        if (!isAdmin(currentUser) && order.getStatus() != OrderStatus.PENDING) {
            throw new BusinessException("You can only cancel pending orders");
        }

        order.setStatus(OrderStatus.CANCELLED);

        // Restore product stock
        restoreProductStock(order.getOrderItems());

        Order cancelledOrder = orderRepository.save(order);
        return orderMapper.mapToResponse(cancelledOrder);
    }
    private String generateShortTransactionId() {
        return "TXN" + System.currentTimeMillis() +
                UUID.randomUUID().toString().substring(0, 8).toUpperCase();
    }

    // Helper method to check if user is admin
    private boolean isAdmin(User user) {
        return user.getRoles() != null && user.getRoles().equals("ADMIN");
    }

    private List<OrderItem> createOrderItems(Order order, List<CartItem> cartItems) {
        return cartItems.stream()
                .map(cartItem -> {
                    OrderItem orderItem = new OrderItem();
                    orderItem.setOrder(order);
                    orderItem.setProduct(cartItem.getProduct());
                    orderItem.setProductName(cartItem.getProduct().getName());
                    List<String> imageUrls = cartItem.getProduct().getImages().stream()
                            .map(ProductImage::getImageUrl)
                            .collect(Collectors.toList());

                    if (!imageUrls.isEmpty()) {
                        orderItem.setProductImage(imageUrls.get(0));
                    }
                    orderItem.setVariantInfo(cartItem.getVariantInfo());
                    orderItem.setQuantity(cartItem.getQuantity());
                    
                    // Sử dụng giá của biến thể nếu có
                    BigDecimal unitPrice = cartItem.getPrice();
                    if (unitPrice == null) {
                        unitPrice = cartItem.getProduct().getPrice();
                    }
                    orderItem.setUnitPrice(unitPrice);
                    orderItem.setTotalPrice(unitPrice.multiply(new BigDecimal(cartItem.getQuantity())));
                    
                    return orderItemRepository.save(orderItem);
                })
                .collect(Collectors.toList());
    }

    private void updateProductStock(List<OrderItem> orderItems) {
        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() - orderItem.getQuantity());
            productRepository.save(product);
        }
    }

    private void restoreProductStock(List<OrderItem> orderItems) {
        for (OrderItem orderItem : orderItems) {
            Product product = orderItem.getProduct();
            product.setStockQuantity(product.getStockQuantity() + orderItem.getQuantity());
            productRepository.save(product);
        }
    }

    private void validateStatusTransition(OrderStatus currentStatus, OrderStatus newStatus) {
        boolean isValidTransition = switch (currentStatus) {
            case PENDING -> newStatus == OrderStatus.DELIVERED|| newStatus == OrderStatus.CANCELLED;
            case DELIVERED -> newStatus == OrderStatus.CANCELLED; // Can't go back to PENDING or DELIVERY once delivered
            case CANCELLED -> false; // Once cancelled, no further status transitions
        };

        if (!isValidTransition) {
            throw new BusinessException("Invalid status transition from " + currentStatus + " to " + newStatus);
        }
    }

    @Transactional(readOnly = true)
    public List<OrderSummaryResponse> getMyOrderSummaries() {
        User currentUser = getCurrentUser();
        Page<Order> orders = orderRepository.findByUserId(currentUser.getId(), Pageable.unpaged());
        return orders.getContent().stream()
                .map(orderMapper::mapToSummaryResponse)
                .collect(Collectors.toList());
    }

    private String generateOrderNumber() {
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmm"));
        String randomPart = UUID.randomUUID().toString().replace("-", "").substring(0, 6).toUpperCase();
        return "ORD" + timestamp + randomPart;
    }



}
