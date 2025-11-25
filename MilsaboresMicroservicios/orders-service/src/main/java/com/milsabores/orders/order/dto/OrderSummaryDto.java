package com.milsabores.orders.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class OrderSummaryDto {
    private Long id;
    private String createdAt;      // "2025-11-15 15:34"
    private String customerName;
    private String email;
    private Long total;
    private String status;
    private String paymentMethod;
}
