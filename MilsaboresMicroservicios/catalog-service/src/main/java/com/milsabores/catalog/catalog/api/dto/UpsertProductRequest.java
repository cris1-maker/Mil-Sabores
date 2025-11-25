package com.milsabores.catalog.catalog.api.dto;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;

public record UpsertProductRequest(
        String sku,
        @NotBlank String name,
        String description,
        @NotNull BigDecimal price,
        @Min(0) Integer stock,     // 👈 IMPORTANTE
        String imageUrl,
        Boolean active,
        Long categoryId
) {}
