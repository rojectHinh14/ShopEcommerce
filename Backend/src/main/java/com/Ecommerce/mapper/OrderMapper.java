package com.Ecommerce.mapper;

import com.Ecommerce.dto.response.Order.OrderResponse;
import com.Ecommerce.dto.response.Order.OrderSummaryResponse;
import com.Ecommerce.dto.response.OrderItemResponse;
import com.Ecommerce.dto.response.Payment.PaymentResponse;
import com.Ecommerce.entity.Order;
import com.Ecommerce.entity.OrderItem;
import com.Ecommerce.entity.Payment;
import org.springframework.stereotype.Component;

import java.time.format.DateTimeFormatter;
import java.util.stream.Collectors;
@Component
public class OrderMapper {
    public OrderItemResponse mapToOrderItemResponse(OrderItem orderItem) {
        return new OrderItemResponse(
                orderItem.getId(),
                orderItem.getProduct().getId(),
                orderItem.getProductName(),
                orderItem.getProductImage(),
                orderItem.getVariantInfo(),
                orderItem.getQuantity(),
                orderItem.getUnitPrice(),
                orderItem.getTotalPrice()
        );
    }

    public OrderSummaryResponse mapToSummaryResponse(Order order) {
        OrderSummaryResponse response = new OrderSummaryResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setStatus(order.getStatus().name());
        response.setTotalAmount(order.getTotalAmount());
        response.setTotalItems(order.getOrderItems().size());
        response.setCreatedAt(order.getCreatedAt().format(DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm")));
        return response;
    }

    public OrderResponse mapToResponse(Order order) {
        OrderResponse response = new OrderResponse();
        response.setId(order.getId());
        response.setOrderNumber(order.getOrderNumber());
        response.setUserId(order.getUser().getId());
        response.setUserName(order.getUser().getUsername());
        response.setStatus(order.getStatus());
        response.setSubtotal(order.getSubtotal());
        response.setShippingFee(order.getShippingFee());
        response.setTaxAmount(order.getTaxAmount());
        response.setDiscountAmount(order.getDiscountAmount());
        response.setTotalAmount(order.getTotalAmount());
        response.setShippingName(order.getShippingName());
        response.setShippingPhone(order.getShippingPhone());
        response.setShippingAddress(order.getShippingAddress());
        response.setEstimatedDelivery(order.getEstimatedDelivery());
        response.setDeliveredAt(order.getDeliveredAt());
        response.setCreatedAt(order.getCreatedAt());
        response.setUpdatedAt(order.getUpdatedAt());

        if (order.getOrderItems() != null) {
            response.setOrderItems(order.getOrderItems().stream()
                    .map(this::mapToOrderItemResponse)
                    .collect(Collectors.toList()));
        }

        if (order.getPayments() != null && !order.getPayments().isEmpty()) {
            // Lấy payment mới nhất
            Payment latestPayment = order.getPayments().get(order.getPayments().size() - 1);
            response.setPaymentStatus(latestPayment.getPaymentStatus());
            response.setPayments(order.getPayments().stream()
                    .map(this::mapToPaymentResponse)
                    .collect(Collectors.toList()));
        }

        return response;
    }

    public PaymentResponse mapToPaymentResponse(Payment payment) {
        PaymentResponse response = new PaymentResponse();
        response.setId(payment.getId());
        response.setOrderId(payment.getOrder().getId());
        response.setPaymentMethod(payment.getPaymentMethod());
        response.setPaymentDate(payment.getPaymentDate());
        response.setAmount(payment.getAmount());
        response.setPaymentStatus(payment.getPaymentStatus());
        response.setTransactionId(payment.getTransactionId());
        response.setPaymentUrl(payment.getPaymentUrl());
        return response;
    }
}
