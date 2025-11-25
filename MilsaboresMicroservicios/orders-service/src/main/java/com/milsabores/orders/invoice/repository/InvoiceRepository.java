package com.milsabores.orders.invoice.repository;
import com.milsabores.orders.invoice.model.Invoice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InvoiceRepository extends JpaRepository<Invoice, Long> {
  Optional<Invoice> findByOrderId(Long orderId);
}
