package com.milsabores.catalog.inventory.service;

import com.milsabores.catalog.inventory.model.Stock;
import com.milsabores.catalog.inventory.repository.StockRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StockService {
    private final StockRepository repo;

    public StockService(StockRepository repo) {
        this.repo = repo;
    }

    public List<Stock> findAll() { return repo.findAll(); }
    public Stock save(Stock e) { return repo.save(e); }
}
