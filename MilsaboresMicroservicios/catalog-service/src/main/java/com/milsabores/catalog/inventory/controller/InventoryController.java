package com.milsabores.catalog.inventory.controller;

import com.milsabores.catalog.inventory.api.dto.StockDto;
import com.milsabores.catalog.inventory.model.Stock;
import com.milsabores.catalog.inventory.service.InventoryService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/inventory")
public class InventoryController {

    private final InventoryService service;

    public InventoryController(InventoryService service) {
        this.service = service;
    }

    // DTOs internos para requests
    public record MovementRequest(
            @NotNull Long productId,
            @NotNull String type,      // "IN" o "OUT"
            @NotNull Integer quantity
    ) {}

    public record ThresholdRequest(
            @NotNull Integer min
    ) {}

    // ------------ GET STOCK DE UN PRODUCTO ------------
    @GetMapping("/{productId}")
    public StockDto get(@PathVariable("productId") Long productId) {
        Stock s = service.get(productId); // usa InventoryService.get(...)
        return toDto(s);
    }

    // ------------ CAMBIAR UMBRAL MÍNIMO ------------
    @PutMapping("/{productId}/min-threshold")
    public StockDto setMin(
            @PathVariable("productId") Long productId,
            @RequestBody @Valid ThresholdRequest req
    ) {
        Stock s = service.setMinThreshold(productId, req.min());
        return toDto(s);
    }

    // ------------ MOVER STOCK (IN / OUT) ------------
    @PostMapping("/movements")
    public StockDto move(@RequestBody @Valid MovementRequest req) {
        Stock s = service.move(req.productId(), req.type(), req.quantity());
        return toDto(s);
    }

    // ------------ MAPPER A DTO ------------
    private StockDto toDto(Stock s) {
        return new StockDto(
                s.getProduct() != null ? s.getProduct().getId() : null, // ID del producto
                s.getOnHand(),                                          // stock actual
                s.getMinThreshold()                                     // umbral mínimo
        );
    }
}
