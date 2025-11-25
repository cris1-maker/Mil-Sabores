package com.milsabores.catalog.catalog.service;

import com.milsabores.catalog.catalog.api.dto.ProductDTO;
import com.milsabores.catalog.catalog.api.dto.UpsertProductRequest;
import com.milsabores.catalog.catalog.model.Category;
import com.milsabores.catalog.catalog.model.Product;
import com.milsabores.catalog.catalog.repository.CategoryRepository;
import com.milsabores.catalog.catalog.repository.ProductRepository;
import org.springframework.data.domain.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class ProductService {
    private final ProductRepository products;
    private final CategoryRepository categories;

    public ProductService(ProductRepository products, CategoryRepository categories) {
        this.products = products;
        this.categories = categories;
    }

    @Transactional(readOnly = true)
    public Page<ProductDTO> search(String q, Long categoryId, Boolean active, int page, int size) {
        var pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return products.search(q, categoryId, active, pageable).map(this::toDTO);
    }

    @Transactional(readOnly = true)
    public ProductDTO get(Long id) {
        return products.findById(id).map(this::toDTO)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
    }

    @Transactional
    public ProductDTO create(UpsertProductRequest req) {
        var p = new Product();
        apply(p, req);
        return toDTO(products.save(p));
    }

    @Transactional
    public ProductDTO update(Long id, UpsertProductRequest req) {
        var p = products.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Producto no encontrado"));
        apply(p, req);
        return toDTO(products.save(p));
    }

    @Transactional
    public void delete(Long id) {
        if (!products.existsById(id)) throw new IllegalArgumentException("Producto no encontrado");
        products.deleteById(id);
    }

    private void apply(Product p, UpsertProductRequest r) {
        p.setSku(r.sku());
        p.setName(r.name());
        p.setDescription(r.description());
        p.setPrice(r.price());

        // 👇 ESTA LÍNEA ES LA QUE FALTABA
        p.setStock(r.stock() == null ? 0 : r.stock());

        p.setImageUrl(r.imageUrl());
        p.setActive(r.active() == null ? Boolean.TRUE : r.active());

        if (r.categoryId() != null) {
            Category c = categories.findById(r.categoryId())
                    .orElseThrow(() -> new IllegalArgumentException("Categoría inválida"));
            p.setCategory(c);
        } else {
            p.setCategory(null);
        }
    }

    private ProductDTO toDTO(Product p) {
        return new ProductDTO(
                p.getId(),
                p.getSku(),
                p.getName(),
                p.getDescription(),
                p.getPrice(),
                p.getStock(), // 👈 ahora lo ves en las respuestas
                p.getImageUrl(),
                p.getActive(),
                p.getCategory() != null ? p.getCategory().getId() : null,
                p.getCategory() != null ? p.getCategory().getName() : null
        );
    }
}
