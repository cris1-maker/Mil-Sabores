package com.milsabores.orders.order.dto;

import java.time.OffsetDateTime;
import java.util.List;

public record OrderDto(
        Long id,
        String email,
        String fullName,
        String phone,
        String status,
        OffsetDateTime createdAt,
        Integer subtotal,
        Integer shippingCost,
        Integer discountTotal,
        Integer total,
        List<OrderItemDto> items
) {}