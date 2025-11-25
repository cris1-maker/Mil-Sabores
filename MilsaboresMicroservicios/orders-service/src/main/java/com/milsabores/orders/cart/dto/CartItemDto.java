package com.milsabores.orders.cart.dto;

public record CartItemDto(
        Long itemId,
        Long productId,
        String name,
        Integer quantity,
        Integer unitPrice,
        Integer lineTotal
) {}