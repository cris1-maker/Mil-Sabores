package com.milsabores.orders.catalog.dto;

import java.math.BigDecimal;

public record ProductDTO(
        Long id,
        String sku,
        String name,
        String description,
        BigDecimal price,
        Integer stock,
        String imageUrl,
        Boolean active,
        Long categoryId,
        String categoryName
) {}
