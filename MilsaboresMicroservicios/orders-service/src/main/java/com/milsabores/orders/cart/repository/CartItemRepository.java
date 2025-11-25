package com.milsabores.orders.cart.repository;
import com.milsabores.orders.cart.model.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartItemRepository extends JpaRepository<CartItem, Long> {}
