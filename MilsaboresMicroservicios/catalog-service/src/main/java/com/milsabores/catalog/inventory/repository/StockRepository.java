package com.milsabores.catalog.inventory.repository;
import com.milsabores.catalog.inventory.model.Stock;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findByProductId(Long productId);
}
