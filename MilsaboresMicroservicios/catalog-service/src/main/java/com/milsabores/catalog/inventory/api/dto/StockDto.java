package com.milsabores.catalog.inventory.api.dto;

public record StockDto(
    Long productId,
    Integer stock,
    Integer minThreshold
) {}
