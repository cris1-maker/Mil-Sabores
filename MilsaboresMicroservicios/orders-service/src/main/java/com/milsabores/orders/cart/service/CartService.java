package com.milsabores.orders.cart.service;
import com.milsabores.orders.cart.model.Cart;
import com.milsabores.orders.cart.model.CartItem;
import com.milsabores.orders.cart.exception.CartException;
import com.milsabores.orders.cart.repository.CartItemRepository;
import com.milsabores.orders.cart.repository.CartRepository;
import com.milsabores.orders.catalog.client.CatalogClient;
import com.milsabores.orders.catalog.dto.ProductDTO;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.Optional; // 👈 FALTABA

@Service
public class CartService {
    private static final int MAX_ITEMS_PER_PRODUCT = 10;

    @Value("${cart.max.total:1000000}")
    private Integer maxCartTotal; // Límite máximo del carrito en CLP

    private final CartRepository carts;
    private final CartItemRepository items;
    private final CatalogClient catalog;

    public CartService(CartRepository carts, CartItemRepository items, CatalogClient catalog) {
        this.carts = carts;
        this.items = items;
        this.catalog = catalog;
    }


    @Transactional
    public Cart create() {
        return carts.save(Cart.builder().build());
    }

    @Transactional(readOnly = true)
    public Cart get(Long id) {
        return carts.findById(id).orElseThrow(() -> new IllegalArgumentException("Carrito no existe"));
    }

    @Transactional
    public Cart addItem(Long cartId, Long productId, Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new CartException("La cantidad debe ser mayor a 0");
        }
        if (quantity > MAX_ITEMS_PER_PRODUCT) {
            throw new CartException("No puedes agregar más de " + MAX_ITEMS_PER_PRODUCT + " unidades del mismo producto");
        }

        Cart cart = get(cartId);
        // Si tu Cart tiene enum Status, descomenta:
        // if (cart.getStatus() != Cart.Status.OPEN) { throw new CartException("El carrito no está abierto para modificaciones"); }

        ProductDTO product = catalog.getProduct(productId);
        if (product == null || product.active() == null || !product.active()) {
            throw new CartException("El producto no existe o está inactivo");
        }

        if (product.stock() == null || product.stock() < quantity) {
            throw new CartException("Stock insuficiente. Stock disponible: " + (product.stock() == null ? 0 : product.stock()));
        }

        // Buscar si ya existe el producto en el carrito
        Optional<CartItem> existingItem = cart.getItems().stream()
                .filter(item -> productId.equals(item.getProductId()))
                .findFirst();

        CartItem item;
        if (existingItem.isPresent()) {
            item = existingItem.get();
            int newQuantity = item.getQuantity() + quantity;
            if (newQuantity > MAX_ITEMS_PER_PRODUCT) {
                throw new CartException("No puedes tener más de " + MAX_ITEMS_PER_PRODUCT + " unidades del mismo producto");
            }
            item.setQuantity(newQuantity);
        } else {
            item = CartItem.builder()
                    .cart(cart)
                    .productId(productId)
                    .productNameSnapshot(product.name())
                    .unitPrice(product.price().intValue()) // CLP snapshot
                    .quantity(quantity)
                    .build();
            cart.getItems().add(item);
        }

        items.save(item);

        // Validar monto máximo del carrito
        if (calculateTotal(cart).compareTo(BigDecimal.valueOf(maxCartTotal)) > 0) {
            throw new CartException("El monto total del carrito excede el límite permitido");
        }

        return cart;
    }

    /** Calcula el total del carrito */
    public BigDecimal calculateTotal(Cart cart) {
        return cart.getItems().stream()
                .map(item -> BigDecimal.valueOf((long) item.getUnitPrice() * item.getQuantity()))
                .reduce(BigDecimal.ZERO, BigDecimal::add);
    }

    @Transactional
    public Cart updateItem(Long itemId, Integer quantity) {
        if (quantity == null || quantity < 1) {
            throw new CartException("La cantidad debe ser mayor a 0");
        }
        if (quantity > MAX_ITEMS_PER_PRODUCT) {
            throw new CartException("No puedes tener más de " + MAX_ITEMS_PER_PRODUCT + " unidades del mismo producto");
        }

        CartItem item = items.findById(itemId)
                .orElseThrow(() -> new CartException("El ítem no existe en el carrito"));

        Cart cart = item.getCart();
        // Si tu Cart tiene enum Status, descomenta:
        // if (cart.getStatus() != Cart.Status.OPEN) {
        //     throw new CartException("El carrito no está abierto para modificaciones");
        // }

        // 🔁 AQUÍ ES DONDE CAMBIA: usamos CatalogClient en vez de ProductRepository
        ProductDTO product = catalog.getProduct(item.getProductId());
        if (product == null || product.active() == null || !product.active()) {
            throw new CartException("El producto no existe o está inactivo");
        }

        Integer stock = product.stock() != null ? product.stock() : 0;
        if (stock < quantity) {
            throw new CartException("Stock insuficiente. Stock disponible: " + stock);
        }

        // Actualizamos cantidad
        item.setQuantity(quantity);
        items.save(item);

        // Validamos total máximo del carrito
        if (calculateTotal(cart).compareTo(BigDecimal.valueOf(maxCartTotal)) > 0) {
            throw new CartException("El monto total del carrito excede el límite permitido");
        }

        return cart;
    }


    @Transactional
    public Cart removeItem(Long itemId) {
        CartItem item = items.findById(itemId)
                .orElseThrow(() -> new CartException("El ítem no existe en el carrito"));

        Cart cart = item.getCart();
        // Si tu Cart tiene enum Status, descomenta:
        // if (cart.getStatus() != Cart.Status.OPEN) { throw new CartException("El carrito no está abierto para modificaciones"); }

        cart.getItems().remove(item);
        items.delete(item);

        return cart;
    }
}
