package com.milsabores.catalog.catalog.repository;

import com.milsabores.catalog.catalog.model.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.*;
import org.springframework.data.repository.query.Param;

public interface ProductRepository extends JpaRepository<Product, Long> {

    @Query("""
      SELECT p FROM Product p
      WHERE (:q IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :q, '%'))
                     OR LOWER(p.description) LIKE LOWER(CONCAT('%', :q, '%')))
        AND (:categoryId IS NULL OR p.category.id = :categoryId)
        AND (:active IS NULL OR p.active = :active)
      """)
    Page<Product> search(
            @Param("q") String q,
            @Param("categoryId") Long categoryId,
            @Param("active") Boolean active,
            Pageable pageable
    );
}
