package com.milsabores.orders.order.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CheckoutRequest(
        @NotNull Long cartId,
        @Email @NotBlank String email,
        @NotBlank String fullName,
        @NotBlank String phone
) {}

