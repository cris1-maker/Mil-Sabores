package com.milsabores.orders.order.dto;

import lombok.Data;

@Data
public class CreateOrderItemDto {
    private Long productId;
    private Integer quantity;
}
