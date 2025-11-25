package com.milsabores.orders.invoice.model;

import jakarta.persistence.*;
import lombok.*;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
@Table(name = "invoices",
       indexes = @Index(name = "idx_invoice_order", columnList = "orderId", unique = true))
public class Invoice {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false)
  private Long orderId;

  @Column(nullable = false, unique = true, length = 40)
  private String number;

  private OffsetDateTime issuedAt;

  @PrePersist
  void pre() {
    if (issuedAt == null) issuedAt = OffsetDateTime.now();
  }
}
