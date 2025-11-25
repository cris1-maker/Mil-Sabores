package com.milsabores.orders.payment.model;

import jakarta.persistence.*;
import lombok.*;
import java.math.BigDecimal;
import java.time.OffsetDateTime;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Entity
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Long orderId;
    private String provider;
    private String providerTxnId;

    @Enumerated(EnumType.STRING)
    private Status status = Status.INIT;

    private BigDecimal amount;
    private OffsetDateTime createdAt;

    public enum Status { INIT, AUTHORIZED, PAID, FAILED, REFUNDED }
}
