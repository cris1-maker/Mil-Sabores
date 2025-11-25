package com.milsabores.catalog.inventory.model;

import com.milsabores.catalog.catalog.model.Product;
import jakarta.persistence.*;
import lombok.*;

import java.time.OffsetDateTime;

@Entity
@Table(
    name = "stock",
    uniqueConstraints = @UniqueConstraint(columnNames = "product_id")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    @JoinColumn(name = "product_id", nullable = false, unique = true)
    private Product product;

    @Column(nullable = false)
    @Builder.Default
    private Integer onHand = 0;

    @Column(nullable = false)
    @Builder.Default
    private Integer minThreshold = 0;

    private OffsetDateTime updatedAt;
}
