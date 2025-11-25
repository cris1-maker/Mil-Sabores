package com.milsabores.catalog.catalog.api.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record UpsertCategoryRequest(
    @NotBlank @Size(max=80) String name,
    @Size(max=300) String description
) {}