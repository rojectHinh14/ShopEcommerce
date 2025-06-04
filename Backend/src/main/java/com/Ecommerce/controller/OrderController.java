package com.Ecommerce.controller;

import com.Ecommerce.dto.ApiResponse;
import com.Ecommerce.dto.PageResponse;
import com.Ecommerce.dto.request.Order.OrderCreateRequest;
import com.Ecommerce.dto.request.Order.OrderUpdateRequest;
import com.Ecommerce.dto.response.Order.OrderResponse;
import com.Ecommerce.dto.response.Order.OrderSummaryResponse;
import com.Ecommerce.service.Impl.OrderServiceImpl;
import jakarta.validation.Valid;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/orders")
public class OrderController {
    private final OrderServiceImpl orderService;


    public OrderController(OrderServiceImpl orderService) {
        this.orderService = orderService;
    }

    // Create order from current user's cart
    @PostMapping
    public ResponseEntity<ApiResponse<OrderResponse>> createOrder(@Valid @RequestBody OrderCreateRequest request) {
        OrderResponse response = orderService.createOrderFromCart(request);
        return new ResponseEntity<>(ApiResponse.success(response), HttpStatus.CREATED);
    }


    // Get order by ID (current user's order or admin)
    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderById(@PathVariable Long id) {
        OrderResponse response = orderService.getOrderById(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/number/{orderNumber}")
    public ResponseEntity<ApiResponse<OrderResponse>> getOrderByNumber(@PathVariable String orderNumber) {
        OrderResponse response = orderService.getOrderByNumber(orderNumber);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

    @GetMapping("/my-orders")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getMyOrders(Pageable pageable) {
        Page<OrderResponse> orders = orderService.getMyOrders(pageable);
        PageResponse<OrderResponse> pageResponse = PageResponse.of(orders);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    // Get current user's order summaries
    @GetMapping("/my-orders/summary")
    public ResponseEntity<ApiResponse<List<OrderSummaryResponse>>> getMyOrderSummaries() {
        List<OrderSummaryResponse> responses = orderService.getMyOrderSummaries();
        return ResponseEntity.ok(ApiResponse.success(responses));
    }

    @GetMapping("/admin/user/{userId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<PageResponse<OrderResponse>>> getOrdersByUserId(
            @PathVariable Long userId,
            Pageable pageable) {
        Page<OrderResponse> orders = orderService.getOrdersByUserId(userId, pageable);
        PageResponse<OrderResponse> pageResponse = PageResponse.of(orders);
        return ResponseEntity.ok(ApiResponse.success(pageResponse));
    }

    // Update order (current user's order or admin)
    @PutMapping("/{id}")
    public ResponseEntity<ApiResponse<OrderResponse>> updateOrder(
            @PathVariable Long id,
            @Valid @RequestBody OrderUpdateRequest request) {
        OrderResponse response = orderService.updateOrder(id, request);
        return ResponseEntity.ok(ApiResponse.success(response));
    }


    // Cancel order (current user's order or admin)
    @PutMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<OrderResponse>> cancelOrder(@PathVariable Long id) {
        OrderResponse response = orderService.cancelOrder(id);
        return ResponseEntity.ok(ApiResponse.success(response));
    }

}
