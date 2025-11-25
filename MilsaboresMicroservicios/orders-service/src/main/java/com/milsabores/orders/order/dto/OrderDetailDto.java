package com.milsabores.orders.order.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.util.List;

@Data
@AllArgsConstructor
public class OrderDetailDto {
    private Long id;
    private String createdAt;
    private String customerName;
    private String email;
    private String address;
    private String paymentMethod;
    private String status;

    private Long subtotal;
    private Long discount;
    private Long total;

    private List<OrderItemDto> items;
}
