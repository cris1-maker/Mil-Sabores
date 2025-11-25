package com.milsabores.orders.cart.dto;

import java.util.List;

public record CartDto(
        Long id,
        List<CartItemDto> items,
        Integer total
) {}