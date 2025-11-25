package com.milsabores.catalog.catalog.api.dto;

import java.math.BigDecimal;

public record ProductDTO(
        Long id,
        String sku,
        String name,
        String description,
        BigDecimal price,
        Integer stock,          // 👈 lo exponemos
        String imageUrl,
        Boolean active,
        Long categoryId,
        String categoryName
) {}
