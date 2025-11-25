package com.milsabores.orders.inventory;

import com.milsabores.orders.catalog.client.CatalogClient;
import com.milsabores.orders.catalog.dto.StockDTO;
import org.springframework.stereotype.Service;

@Service
public class InventoryService {

    private final CatalogClient catalog;

    public InventoryService(CatalogClient catalog) {
        this.catalog = catalog;
    }

    /**
     * Verifica que haya al menos 'qty' unidades disponibles para el productId dado.
     * Este método se usa desde OrderService.createFromCart(...)
     */
    public void ensureAvailable(Long productId, int qty) {
        if (qty < 1) {
            throw new IllegalArgumentException("INVALID_QTY");
        }

        StockDTO stockDto = catalog.getStock(productId);

        int available = 0;
        if (stockDto != null && stockDto.stock() != null) {
            available = stockDto.stock();   // 👈 AHORA usa el campo "stock" que viene del catálogo
        }

        if (available < qty) {
            throw new IllegalStateException("STOCK_INSUFFICIENT");
        }
    }
}
