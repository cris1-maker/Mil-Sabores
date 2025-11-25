package com.milsabores.orders.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderItemDto {
    private String productName;
    private Integer quantity;
    private Long unitPrice;
    private Long lineTotal;
}
