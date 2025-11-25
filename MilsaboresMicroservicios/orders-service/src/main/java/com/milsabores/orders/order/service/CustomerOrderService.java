package com.milsabores.orders.order.service;
import com.milsabores.orders.order.model.CustomerOrder;
import com.milsabores.orders.order.repository.CustomerOrderRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CustomerOrderService {
    private final CustomerOrderRepository repo;

    public CustomerOrderService(CustomerOrderRepository repo) {
        this.repo = repo;
    }

    public List<CustomerOrder> findAll() { return repo.findAll(); }

    public CustomerOrder save(CustomerOrder e) { return repo.save(e); }
}
