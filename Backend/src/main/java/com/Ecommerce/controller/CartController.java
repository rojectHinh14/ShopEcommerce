package com.Ecommerce.controller;

import com.Ecommerce.dto.ApiResponse;
import com.Ecommerce.dto.request.CartItem.CartItemRequest;
import com.Ecommerce.dto.response.Cart.CartResponse;
import com.Ecommerce.entity.User;
import com.Ecommerce.repository.UserRepository;
import com.Ecommerce.service.Impl.CartServiceImpl;
import com.nimbusds.jwt.JWTParser;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/cart")
public class CartController {
    private final CartServiceImpl cartService;
    private final UserRepository userRepository; // Hoặc UserService

    public CartController(CartServiceImpl cartService, UserRepository userRepository) {
        this.cartService = cartService;
        this.userRepository = userRepository;
    }

    private String extractUsernameFromToken(String token) {
        try {
            var jwt = JWTParser.parse(token);
            return jwt.getJWTClaimsSet().getSubject();
        } catch (Exception e) {
            throw new RuntimeException("Invalid token");
        }
    }

    private User getUserFromRequest(HttpServletRequest request) {
        String authHeader = request.getHeader("Authorization");
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            throw new RuntimeException("Missing or invalid Authorization header");
        }
        String token = authHeader.substring(7);
        String username = extractUsernameFromToken(token);
        return userRepository.findByUsername(username)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    @PostMapping("/items")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CartResponse>> addOrUpdateItem(
            HttpServletRequest request,
            @RequestBody CartItemRequest cartItemRequest) {

        User user = getUserFromRequest(request);
        CartResponse cartResponse = cartService.addOrUpdateCartItem(user, cartItemRequest);
        return ResponseEntity.ok(ApiResponse.success(cartResponse));
    }

    @PutMapping("/items/{itemId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CartResponse>> updateItemQuantity(
            HttpServletRequest request,
            @PathVariable Long itemId,
            @RequestParam Integer quantity) {

        User user = getUserFromRequest(request);
        CartResponse cartResponse = cartService.updateCartItemQuantity(user, itemId, quantity);
        return ResponseEntity.ok(ApiResponse.success(cartResponse));
    }

    @DeleteMapping("/items/{itemId}")
    @PreAuthorize("hasRole('USER')")
    public ResponseEntity<ApiResponse<CartResponse>> removeItem(
            HttpServletRequest request,
            @PathVariable Long itemId) {

        User user = getUserFromRequest(request);
        CartResponse cartResponse = cartService.removeCartItem(user, itemId);
        return ResponseEntity.ok(ApiResponse.success(cartResponse));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<CartResponse>> getCart(HttpServletRequest request) {

        User user = getUserFromRequest(request);
        CartResponse cartResponse = cartService.getCart(user);
        return ResponseEntity.ok(ApiResponse.success(cartResponse));
    }
}
