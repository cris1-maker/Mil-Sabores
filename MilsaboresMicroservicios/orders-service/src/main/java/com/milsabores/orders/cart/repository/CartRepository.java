package com.milsabores.orders.cart.repository;
import com.milsabores.orders.cart.model.Cart;

import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<Cart, Long> {}
