package com.milsabores.orders.order.controller;

import com.milsabores.orders.order.dto.CheckoutRequest;
import com.milsabores.orders.order.dto.OrderDto;
import com.milsabores.orders.order.dto.OrderItemDto;
import com.milsabores.orders.order.dto.OrderSummaryDto;
import com.milsabores.orders.order.dto.UpdateStatusRequest;
import com.milsabores.orders.order.model.CustomerOrder;
import com.milsabores.orders.order.model.OrderItem;
import com.milsabores.orders.order.repository.CustomerOrderRepository;
import com.milsabores.orders.order.service.OrderService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@RequiredArgsConstructor
public class OrderController {

    private final CustomerOrderRepository orders;
    private final OrderService orderService;

    // ============================================================
    // 1) LISTAR TODAS LAS ÓRDENES (para panel Admin)
    // ============================================================
    @GetMapping
    public List<OrderSummaryDto> listAll() {
        return orders.findAll().stream()
                .map(this::toSummaryDto)
                .toList();
    }

    // ============================================================
    // 2) OBTENER DETALLE DE UNA ÓRDEN
    // ============================================================
    @GetMapping("/{id}")
    public OrderDto get(@PathVariable Long id) {
        CustomerOrder o = orders.findById(id).orElseThrow();
        return toDto(o);
    }

    // ============================================================
    // 3) CHECKOUT DESDE CARRITO (flujo real)
    // ============================================================
    @PostMapping("/checkout")
    public OrderDto checkout(@RequestBody @Valid CheckoutRequest req) {

        CustomerOrder o = orderService.createFromCart(
                req.cartId(),
                req.email(),
                req.fullName(),
                req.phone()
        );

        return toDto(o);
    }

    // ============================================================
    // 4) CAMBIAR ESTADO DE LA ORDEN (PENDING / PAID / CANCELLED)
    // ============================================================
    @PatchMapping("/{id}/status")
    public OrderDto updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid UpdateStatusRequest req
    ) {
        CustomerOrder.Status st = CustomerOrder.Status.valueOf(req.status());
        CustomerOrder updated = orderService.updateStatus(id, st);
        return toDto(updated);
    }

    // ============================================================
    // MAPPERS A DTO
    // ============================================================

    private OrderDto toDto(CustomerOrder o) {
        return new OrderDto(
                o.getId(),
                o.getEmail(),
                o.getFullName(),
                o.getPhone(),
                o.getStatus().name(),
                o.getCreatedAt(),
                o.getSubtotal(),
                o.getShippingCost(),
                o.getDiscountTotal(),
                o.getTotal(),
                o.getItems().stream()
                        .map(this::toItemDto)
                        .toList()
        );
    }

    private OrderItemDto toItemDto(OrderItem oi) {
        return new OrderItemDto(
                oi.getProductNameSnapshot(),
                oi.getQuantity(),
                oi.getUnitPrice().longValue(),
                oi.getLineTotal().longValue()
        );
    }

    private OrderSummaryDto toSummaryDto(CustomerOrder o) {
        String createdAtFormatted = o.getCreatedAt()
                .format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"));

        return new OrderSummaryDto(
                o.getId(),
                createdAtFormatted,
                o.getFullName(),
                o.getEmail(),
                o.getTotal().longValue(),
                o.getStatus().name(),
                "TRANSFERENCIA"   // o desde el front, si más adelante lo agregas
        );
    }
}
