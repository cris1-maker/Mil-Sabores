package com.milsabores.orders.cart.model;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "cart_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@ToString(exclude = {"cart"})
@JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
public class CartItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Relación al carrito
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cart_id", nullable = false)
    private Cart cart;

    // item.getProductId()
    @Column(name = "product_id", nullable = false)
    private Long productId;

    // item.getProductNameSnapshot()
    @Column(name = "product_name_snapshot", nullable = false)
    private String productNameSnapshot;

    // item.getUnitPrice()
    @Column(name = "unit_price", nullable = false)
    private Integer unitPrice;

    // item.getQuantity() / setQuantity(...)
    @Column(name = "quantity", nullable = false)
    private Integer quantity;
}
