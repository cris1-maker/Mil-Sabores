package com.milsabores.orders.payment.repository;
import com.milsabores.orders.payment.model.Payment;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PaymentRepository extends JpaRepository<Payment, Long> {
}
