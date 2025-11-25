package com.milsabores.orders.invoice.service;
import com.milsabores.orders.invoice.model.Invoice;
import com.milsabores.orders.invoice.repository.InvoiceRepository;
import com.milsabores.orders.order.repository.CustomerOrderRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class InvoiceService {
  private final InvoiceRepository repo;
  private final CustomerOrderRepository orders;

  public InvoiceService(InvoiceRepository repo, CustomerOrderRepository orders) {
    this.repo = repo;
    this.orders = orders;
  }

  @Transactional
  public Invoice ensureForOrder(Long orderId) {
    return repo.findByOrderId(orderId).orElseGet(() -> {
      var o = orders.findById(orderId).orElseThrow();
      if (o.getStatus() != com.milsabores.orders.order.model.CustomerOrder.Status.PAID) {
        throw new IllegalArgumentException("ORDER_NOT_PAID");
      }
      var inv = Invoice.builder()
          .orderId(orderId)
          .number("F-" + System.currentTimeMillis())
          .build();
      return repo.save(inv);
    });
  }
}
