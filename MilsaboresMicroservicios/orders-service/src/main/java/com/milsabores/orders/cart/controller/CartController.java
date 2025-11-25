package com.milsabores.orders.cart.controller;

import com.milsabores.orders.cart.model.Cart;
import com.milsabores.orders.cart.model.CartItem;
import com.milsabores.orders.cart.dto.CartDto;
import com.milsabores.orders.cart.dto.CartItemDto;
import com.milsabores.orders.cart.service.CartService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/cart")
@RequiredArgsConstructor
public class CartController {

    private final CartService service;

    // ====== DTOs de request ======
    public record AddItemRequest(Long productId, Integer quantity) {}
    public record UpdateItemQtyRequest(Integer quantity) {}

    // ====== Endpoints ======

    @PostMapping
    public CartDto create() {
        Cart c = service.create();
        return toDto(c);
    }

    @GetMapping("/{id}")
    public CartDto get(@PathVariable("id") Long id) {
        return toDto(service.get(id));
    }

    @PostMapping("/{id}/items")
    public CartDto addItem(@PathVariable("id") Long id,
                           @RequestBody @Valid AddItemRequest req) {
        Cart updated = service.addItem(id, req.productId(), req.quantity());
        return toDto(updated);
    }

    @PutMapping("/items/{itemId}")
    public CartDto updateItem(@PathVariable("itemId") Long itemId,
                              @RequestBody @Valid UpdateItemQtyRequest req) {
        Cart updated = service.updateItem(itemId, req.quantity());
        return toDto(updated);
    }

    @DeleteMapping("/items/{itemId}")
    public CartDto removeItem(@PathVariable("itemId") Long itemId) {
        Cart updated = service.removeItem(itemId);
        return toDto(updated);
    }

    // ====== Mapper ======
    private CartDto toDto(Cart cart) {
        List<CartItemDto> items = cart.getItems().stream().map(this::toItemDto).toList();
        int total = items.stream().mapToInt(CartItemDto::lineTotal).sum();
        return new CartDto(cart.getId(), items, total);
    }

    private CartItemDto toItemDto(CartItem ci) {
        Long productId   = ci.getProductId();              // <- usa el id snapshot
        String productName = ci.getProductNameSnapshot();  // <- usa el nombre snapshot
        int unitPrice    = (ci.getUnitPrice() != null ? ci.getUnitPrice() : 0);
        int qty          = (ci.getQuantity() != null ? ci.getQuantity() : 0);

        return new CartItemDto(
                ci.getId(),
                productId,
                productName,
                qty,
                unitPrice,
                unitPrice * qty
        );
    }
}
