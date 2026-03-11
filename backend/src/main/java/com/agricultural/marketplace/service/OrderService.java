package com.agricultural.marketplace.service;

import com.agricultural.marketplace.model.Order;
import com.agricultural.marketplace.model.Product;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.repository.OrderRepository;
import com.agricultural.marketplace.repository.ProductRepository;
import com.agricultural.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
public class OrderService {
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ShippoService shippoService;
    
    public Order createOrder(List<Order.OrderItem> items, User.Address deliveryAddress, 
                           String deliveryNotes, String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        // Validate stock and calculate total
        double totalAmount = 0.0;
        for (Order.OrderItem item : items) {
            Product product = productRepository.findById(item.getProductId())
                    .orElseThrow(() -> new RuntimeException("Product not found: " + item.getProductId()));
            
            if (product.getStock() < item.getQuantity()) {
                throw new RuntimeException("Insufficient stock for product: " + product.getName());
            }
            
            item.setPrice(product.getPrice());
            item.setSubtotal(product.getPrice() * item.getQuantity());
            totalAmount += item.getSubtotal();
            
            // Update stock
            product.setStock(product.getStock() - item.getQuantity());
            productRepository.save(product);
        }
        
        Order order = new Order();
        order.setOrderNumber("ORD-" + UUID.randomUUID().toString().substring(0, 8).toUpperCase());
        order.setCustomer(customer);
        order.setCustomerId(customer.getId());
        order.setItems(items);
        order.setTotalAmount(totalAmount);
        order.setStatus(Order.OrderStatus.PENDING);
        order.setPaymentStatus(Order.PaymentStatus.PENDING);
        order.setDeliveryAddress(deliveryAddress);
        order.setDeliveryNotes(deliveryNotes);
        order.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(3));
        
        // Set farmer info from first item (assuming all items from same farmer)
        if (!items.isEmpty() && items.get(0).getFarmerId() != null) {
            order.setFarmerId(items.get(0).getFarmerId());
            order.setFarmerName(items.get(0).getFarmerName());
        }
        
        // Add initial tracking
        Order.OrderTracking tracking = new Order.OrderTracking();
        tracking.setStatus(Order.OrderStatus.PENDING);
        tracking.setDescription("Order placed successfully");
        tracking.setTimestamp(LocalDateTime.now());
        tracking.setLocation("Agricultural Marketplace Platform");
        order.getTrackingHistory().add(tracking);
        
        Order savedOrder = orderRepository.save(order);
        
        // Calculate shipping with Shippo API
        try {
            shippoService.calculateShipping(savedOrder);
        } catch (Exception e) {
            // Log error but don't fail the order
            System.err.println("Failed to calculate shipping: " + e.getMessage());
        }
        
        return savedOrder;
    }
    
    public List<Order> getCustomerOrders(String customerEmail) {
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        return orderRepository.findByCustomerIdOrderByCreatedAtDesc(customer.getId());
    }
    
    public Order getOrderById(String orderId) {
        return orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found"));
    }
    
    public Order updateOrderStatus(String orderId, Order.OrderStatus status, String description) {
        Order order = getOrderById(orderId);
        order.setStatus(status);
        
        Order.OrderTracking tracking = new Order.OrderTracking();
        tracking.setStatus(status);
        tracking.setDescription(description);
        tracking.setTimestamp(LocalDateTime.now());
        order.getTrackingHistory().add(tracking);
        
        if (status == Order.OrderStatus.DELIVERED) {
            order.setActualDeliveryDate(LocalDateTime.now());
        }
        
        return orderRepository.save(order);
    }
    
    public Order cancelOrder(String orderId, String customerEmail) {
        Order order = getOrderById(orderId);
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        if (!order.getCustomerId().equals(customer.getId())) {
            throw new RuntimeException("You can only cancel your own orders");
        }
        
        if (order.getStatus() == Order.OrderStatus.DELIVERED || 
            order.getStatus() == Order.OrderStatus.CANCELLED) {
            throw new RuntimeException("Cannot cancel this order");
        }
        
        // Restore stock
        for (Order.OrderItem item : order.getItems()) {
            Product product = productRepository.findById(item.getProductId()).orElse(null);
            if (product != null) {
                product.setStock(product.getStock() + item.getQuantity());
                productRepository.save(product);
            }
        }
        
        return updateOrderStatus(orderId, Order.OrderStatus.CANCELLED, "Order cancelled by customer");
    }
    
    public List<Order> getFarmerOrders(String farmerEmail) {
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return orderRepository.findByFarmerIdOrderByCreatedAtDesc(farmer.getId());
    }
    
    public List<Order> getFarmerOrdersById(String farmerId) {
        return orderRepository.findByFarmerIdOrderByCreatedAtDesc(farmerId);
    }
}
