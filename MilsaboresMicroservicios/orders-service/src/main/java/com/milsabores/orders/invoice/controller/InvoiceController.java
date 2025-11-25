package com.milsabores.orders.invoice.controller;
import com.milsabores.orders.invoice.model.Invoice;
import com.milsabores.orders.invoice.service.InvoiceService;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/invoices")
public class InvoiceController {

  private final InvoiceService service;

  public InvoiceController(InvoiceService service) {
    this.service = service;
  }

  @PostMapping("/{orderId}")
  public Invoice createIfMissing(@PathVariable Long orderId) {
    return service.ensureForOrder(orderId);
  }

  @GetMapping("/{orderId}")
  public Invoice get(@PathVariable Long orderId) {
    return service.ensureForOrder(orderId);
  }
}
