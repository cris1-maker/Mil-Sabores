package com.milsabores.catalog.shared.exception;

import java.time.OffsetDateTime;
import java.util.List;

public record ApiError(String error, String message, List<String> details, OffsetDateTime timestamp) {
    public static ApiError of(String error, String message, List<String> details) {
        return new ApiError(error, message, details, OffsetDateTime.now());
    }
}
