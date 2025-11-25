package com.milsabores.orders.payment.service;
import com.milsabores.orders.payment.model.Payment;
import com.milsabores.orders.payment.repository.PaymentRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PaymentService {
    private final PaymentRepository repo;

    public PaymentService(PaymentRepository repo) {
        this.repo = repo;
    }

    public List<Payment> findAll() { return repo.findAll(); }
    public Payment save(Payment e) { return repo.save(e); }
}
