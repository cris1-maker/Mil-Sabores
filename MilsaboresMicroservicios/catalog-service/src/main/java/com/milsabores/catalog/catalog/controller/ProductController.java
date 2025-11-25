package com.milsabores.catalog.catalog.controller;

import com.milsabores.catalog.catalog.api.dto.ProductDTO;
import com.milsabores.catalog.catalog.api.dto.UpsertProductRequest;
import com.milsabores.catalog.catalog.service.ProductService;
import com.milsabores.catalog.shared.api.PageResponse;
import jakarta.validation.Valid;
import org.springframework.web.bind.annotation.*;
@RestController
@RequestMapping("/api/products")
public class ProductController {
    private final ProductService service;
    public ProductController(ProductService service) { this.service = service; }

    @GetMapping
    public PageResponse<ProductDTO> search(@RequestParam(required=false) String q,
                                           @RequestParam(required=false) Long categoryId,
                                           @RequestParam(required=false) Boolean active,
                                           @RequestParam(defaultValue="0") int page,
                                           @RequestParam(defaultValue="12") int size) {
        return PageResponse.of(service.search(q, categoryId, active, page, size));
    }

    @GetMapping("/{id}")
    public ProductDTO get(@PathVariable Long id) { return service.get(id); }

    @PostMapping
    public ProductDTO create(@Valid @RequestBody UpsertProductRequest req) { return service.create(req); }

    @PutMapping("/{id}")
    public ProductDTO update(@PathVariable Long id, @Valid @RequestBody UpsertProductRequest req) { return service.update(id, req); }

    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) { service.delete(id); }
}
