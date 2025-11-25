package com.milsabores.orders.order.dto;

import lombok.Data;

import java.util.List;

@Data
public class CreateOrderRequest {

    private String customerName;
    private String email;
    private String address;
    private String paymentMethod;

    private List<CreateOrderItemDto> items;
}
