package com.milsabores.orders.payment.controller;
import com.milsabores.orders.order.model.CustomerOrder;
import com.milsabores.orders.order.repository.CustomerOrderRepository;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

  private final CustomerOrderRepository orders;
  private final Map<String, Long> intents = new ConcurrentHashMap<>();

  public PaymentController(CustomerOrderRepository orders) {
    this.orders = orders;
  }

  public record CreateIntentRequest(Long orderId, Integer amount) {}
  public record CreateIntentResponse(String intentId, String status) {}
  public record ConfirmResponse(String status) {}

  @PostMapping("/intent")
  public CreateIntentResponse intent(@RequestBody CreateIntentRequest r) {
    var o = orders.findById(r.orderId()).orElseThrow();
    var id = UUID.randomUUID().toString();
    intents.put(id, o.getId());
    return new CreateIntentResponse(id, "REQUIRES_CONFIRMATION");
  }

  @PostMapping("/{intentId}/confirm")
  public ConfirmResponse confirm(@PathVariable String intentId) {
    var orderId = intents.remove(intentId);
    if (orderId == null) throw new IllegalArgumentException("INVALID_INTENT");
    var o = orders.findById(orderId).orElseThrow();
    o.setStatus(CustomerOrder.Status.PAID);
    orders.save(o);
    return new ConfirmResponse("SUCCEEDED");
  }
}
