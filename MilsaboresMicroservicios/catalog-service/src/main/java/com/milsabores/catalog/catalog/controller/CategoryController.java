package com.milsabores.catalog.catalog.controller;

import com.milsabores.catalog.catalog.api.dto.CategoryDTO;
import com.milsabores.catalog.catalog.api.dto.UpsertCategoryRequest;
import com.milsabores.catalog.catalog.service.CategoryService;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/categories")
public class CategoryController {
    private final CategoryService service;
    public CategoryController(CategoryService service) { this.service = service; }

    @PostMapping
    public CategoryDTO create(@Valid @RequestBody UpsertCategoryRequest req) {
        return service.create(req);
    }

    @GetMapping("/{id}")
    public CategoryDTO get(@PathVariable Long id) {
        return service.get(id);
    }

    @PutMapping("/{id}")
    public CategoryDTO update(@PathVariable Long id, @Valid @RequestBody UpsertCategoryRequest req) {
        return service.update(id, req);
    }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        service.delete(id);
    }
}
