package com.milsabores.orders.order.controller;
import com.milsabores.orders.order.model.CustomerOrder;
import com.milsabores.orders.order.service.CustomerOrderService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/order")
public class CustomerOrderController {
    private final CustomerOrderService service;
    public CustomerOrderController(CustomerOrderService service) { this.service = service; }

    @GetMapping
    public List<CustomerOrder> list() { return service.findAll(); }

    @PostMapping
    public CustomerOrder create(@RequestBody CustomerOrder e) { return service.save(e); }
}
