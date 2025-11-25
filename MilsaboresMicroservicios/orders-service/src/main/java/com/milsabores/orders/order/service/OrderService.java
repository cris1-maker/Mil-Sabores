package com.milsabores.orders.order.service;
import com.milsabores.orders.cart.model.Cart;
import com.milsabores.orders.cart.model.CartItem;
import com.milsabores.orders.cart.repository.CartRepository;
import com.milsabores.orders.inventory.InventoryService;
import com.milsabores.orders.order.model.CustomerOrder;
import com.milsabores.orders.order.model.OrderItem;
import com.milsabores.orders.order.repository.CustomerOrderRepository;
import com.milsabores.orders.order.repository.OrderItemRepository;
import jakarta.transaction.Transactional;
import org.springframework.stereotype.Service;

@Service
public class OrderService {

    private final CartRepository carts;
    private final CustomerOrderRepository orders;
    private final OrderItemRepository items;
    private final InventoryService inventory;

    public OrderService(
            CartRepository carts,
            CustomerOrderRepository orders,
            OrderItemRepository items,
            InventoryService inventory
    ) {
        this.carts = carts;
        this.orders = orders;
        this.items = items;
        this.inventory = inventory;
    }

    public CustomerOrder get(Long id) {
        return orders.findById(id).orElseThrow();
    }

    @Transactional
    public CustomerOrder createFromCart(Long cartId, String email, String fullName, String phone) {
        Cart cart = carts.findById(cartId).orElseThrow();

        if (cart.getStatus() != Cart.Status.OPEN) {
            throw new IllegalStateException("CART_NOT_OPEN");
        }

        // 1) Validar stock previo
        for (CartItem i : cart.getItems()) {
            inventory.ensureAvailable(i.getProductId(), i.getQuantity());
        }

        // 2) Calcular totales
        int subtotal = cart.getItems().stream()
                .mapToInt(i -> i.getUnitPrice() * i.getQuantity())
                .sum();
        int shipping = 0;
        int discount = 0;
        int total = subtotal + shipping - discount;

        // 3) Crear pedido + items
        CustomerOrder o = CustomerOrder.builder()
                .email(email)
                .fullName(fullName)
                .phone(phone)
                .status(CustomerOrder.Status.PENDING)
                .subtotal(subtotal)
                .shippingCost(shipping)
                .discountTotal(discount)
                .total(total)
                .build();

        for (CartItem ci : cart.getItems()) {
            OrderItem oi = OrderItem.builder()
                    .order(o)
                    .productId(ci.getProductId())
                    .productNameSnapshot(ci.getProductNameSnapshot())
                    .unitPrice(ci.getUnitPrice())
                    .quantity(ci.getQuantity())
                    .lineTotal(ci.getUnitPrice() * ci.getQuantity())
                    .build();
            o.getItems().add(oi);
        }

        // 4) Marcar carrito como CERRADO
        cart.setStatus(Cart.Status.CLOSED);
        carts.save(cart);

        // 5) Persistir pedido + items
        return orders.save(o);
    }

    @Transactional
    public CustomerOrder updateStatus(Long id, CustomerOrder.Status status) {
        CustomerOrder o = orders.findById(id).orElseThrow();
        o.setStatus(status);
        return orders.save(o);
    }
}
