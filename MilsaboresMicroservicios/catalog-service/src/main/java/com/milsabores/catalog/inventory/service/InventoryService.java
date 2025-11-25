package com.milsabores.catalog.inventory.service;

import com.milsabores.catalog.catalog.model.Product;
import com.milsabores.catalog.catalog.repository.ProductRepository;
import com.milsabores.catalog.inventory.exception.InventoryException;
import com.milsabores.catalog.inventory.model.Stock;
import com.milsabores.catalog.inventory.repository.StockRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;

@Service
public class InventoryService {

    private final ProductRepository products;
    private final StockRepository stocks;

    public InventoryService(ProductRepository products, StockRepository stocks) {
        this.products = products;
        this.stocks = stocks;
    }

    // ---------- helpers ----------
    private Product getProductOrFail(Long productId) {
        return products.findById(productId)
                .orElseThrow(() -> new InventoryException("PRODUCT_NOT_FOUND"));
    }

    private Stock getOrCreateStock(Product p) {
        return stocks.findByProductId(p.getId()).orElseGet(() -> {
            Stock s = new Stock();
            s.setProduct(p);
            // inicializa onHand con el valor actual del Product para mantener consistencia
            s.setOnHand(p.getStock() == null ? 0 : p.getStock());
            s.setMinThreshold(0);
            s.setUpdatedAt(OffsetDateTime.now());
            return stocks.save(s);
        });
    }

    private void syncProductWithStock(Product p, Stock s) {
        // Mantener Product.stock = Stock.onHand
        p.setStock(s.getOnHand());
        products.save(p);
    }

    // ---------- API interna (por si la quieres usar en catálogo) ----------
    @Transactional(readOnly = true)
    public void ensureAvailable(Long productId, int qty) {
        if (qty < 1) throw new InventoryException("INVALID_QTY");
        Product p = getProductOrFail(productId);
        Stock s = stocks.findByProductId(productId).orElse(null);

        int available = (s != null ? s.getOnHand() : (p.getStock() == null ? 0 : p.getStock()));
        if (available < qty) throw new InventoryException("STOCK_INSUFFICIENT");
    }

    @Transactional
    public Stock move(Long productId, String direction, int qty) {
        if (qty < 1) throw new InventoryException("INVALID_QTY");

        Product p = getProductOrFail(productId);
        Stock s = getOrCreateStock(p);

        switch (direction) {
            case "OUT" -> {
                if (s.getOnHand() < qty) throw new InventoryException("STOCK_INSUFFICIENT");
                s.setOnHand(s.getOnHand() - qty);
            }
            case "IN" -> s.setOnHand(s.getOnHand() + qty);
            default -> throw new InventoryException("INVALID_DIRECTION");
        }

        s.setUpdatedAt(OffsetDateTime.now());
        stocks.save(s);
        syncProductWithStock(p, s);

        return s;
    }

    // ---------- API usada por InventoryController ----------
    @Transactional
    public Stock get(Long productId) {
        Product p = getProductOrFail(productId);
        return stocks.findByProductId(productId)
                .orElseGet(() -> getOrCreateStock(p));
    }

    @Transactional
    public Stock setMinThreshold(Long productId, Integer min) {
        if (min == null || min < 0) throw new InventoryException("INVALID_MIN_THRESHOLD");
        Product p = getProductOrFail(productId);
        Stock s = getOrCreateStock(p);
        s.setMinThreshold(min);
        s.setUpdatedAt(OffsetDateTime.now());
        return stocks.save(s);
    }
}
