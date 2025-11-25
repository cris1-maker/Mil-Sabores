package com.milsabores.orders.order.dto;

import jakarta.validation.constraints.NotBlank;

public record UpdateStatusRequest(
        @NotBlank String status // PENDING, PAID o CANCELLED
) {}