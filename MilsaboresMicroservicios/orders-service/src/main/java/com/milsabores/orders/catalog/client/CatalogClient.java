package com.milsabores.orders.catalog.client;

import com.milsabores.orders.catalog.dto.ProductDTO;
import com.milsabores.orders.catalog.dto.StockDTO;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(
        name = "catalogClient",
        url = "${catalog.service.url:http://localhost:8082}"
)
public interface CatalogClient {

    @GetMapping("/api/products/{id}")
    ProductDTO getProduct(@PathVariable("id") Long id);

    @GetMapping("/api/inventory/{productId}")
    StockDTO getStock(@PathVariable("productId") Long productId);
}
