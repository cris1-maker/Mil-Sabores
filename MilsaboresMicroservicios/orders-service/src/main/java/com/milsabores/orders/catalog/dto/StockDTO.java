package com.milsabores.orders.catalog.dto;

public record StockDTO(
        Long productId,
        Integer stock,
        Integer minThreshold
) {}
