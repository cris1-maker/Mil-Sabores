package com.milsabores.catalog.catalog.service;

import com.milsabores.catalog.catalog.api.dto.CategoryDTO;
import com.milsabores.catalog.catalog.api.dto.UpsertCategoryRequest;
import com.milsabores.catalog.catalog.model.Category;
import com.milsabores.catalog.catalog.repository.CategoryRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CategoryService {
    private final CategoryRepository categories;

    public CategoryService(CategoryRepository categories) {
        this.categories = categories;
    }

    public CategoryDTO get(Long id) {
        var c = categories.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        return toDTO(c);
    }

    @Transactional
    public CategoryDTO create(UpsertCategoryRequest req) {
        categories.findByNameIgnoreCase(req.name()).ifPresent(c -> {
            throw new IllegalArgumentException("La categoría ya existe");
        });
        var c = Category.builder()
                .name(req.name().trim())
                .description(req.description())
                .build();
        return toDTO(categories.save(c));
    }

    @Transactional
    public CategoryDTO update(Long id, UpsertCategoryRequest req) {
        var c = categories.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("Categoría no encontrada"));
        // Verificar nombre duplicado si cambia
        categories.findByNameIgnoreCase(req.name())
                .filter(other -> !other.getId().equals(id))
                .ifPresent(other -> { throw new IllegalArgumentException("La categoría ya existe"); });

        c.setName(req.name().trim());
        c.setDescription(req.description());
        return toDTO(categories.save(c));
    }

    @Transactional
    public void delete(Long id) {
        if (!categories.existsById(id)) throw new IllegalArgumentException("Categoría no encontrada");
        categories.deleteById(id);
    }

    private CategoryDTO toDTO(Category c) {
        return new CategoryDTO(c.getId(), c.getName(), c.getDescription());
    }
}
