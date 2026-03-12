package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.dto.ApiResponse;
import com.agricultural.marketplace.model.Order;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.time.LocalDateTime;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = "*", maxAge = 3600)
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @PostMapping
    public ResponseEntity<?> createOrder(@RequestBody CreateOrderRequest request,
                                        Authentication authentication) {
        try {
            String email = authentication.getName();
            Order order = orderService.createOrder(
                    request.getItems(),
                    request.getDeliveryAddress(),
                    request.getDeliveryNotes(),
                    email
            );
            return ResponseEntity.ok(new ApiResponse(true, "Order created successfully", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to create order: " + e.getMessage()));
        }
    }
    
    @GetMapping
    public ResponseEntity<List<Order>> getMyOrders(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.getCustomerOrders(email));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Order> getOrderById(@PathVariable String id) {
        return ResponseEntity.ok(orderService.getOrderById(id));
    }
    
    @PutMapping("/{id}/status")
    public ResponseEntity<?> updateOrderStatus(@PathVariable String id,
                                               @RequestParam Order.OrderStatus status,
                                               @RequestParam String description) {
        try {
            Order order = orderService.updateOrderStatus(id, status, description);
            return ResponseEntity.ok(new ApiResponse(true, "Order status updated", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update order: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> cancelOrder(@PathVariable String id, Authentication authentication) {
        try {
            String email = authentication.getName();
            Order order = orderService.cancelOrder(id, email);
            return ResponseEntity.ok(new ApiResponse(true, "Order cancelled successfully", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to cancel order: " + e.getMessage()));
        }
    }
    
    @GetMapping("/farmer/my-orders")
    public ResponseEntity<List<Order>> getMyFarmerOrders(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(orderService.getFarmerOrders(email));
    }
    
    @GetMapping("/farmer/{farmerId}")
    public ResponseEntity<List<Order>> getFarmerOrders(@PathVariable String farmerId) {
        return ResponseEntity.ok(orderService.getFarmerOrdersById(farmerId));
    }

    @PutMapping("/{id}/driver-location")
    public ResponseEntity<?> updateOrderDriverLocation(@PathVariable String id,
                                                       @RequestBody Map<String, Double> body) {
        try {
            Order order = orderService.getOrderById(id);
            order.setDriverCurrentLat(body.get("lat"));
            order.setDriverCurrentLng(body.get("lng"));
            order.setLastDriverLocationUpdate(LocalDateTime.now().toString());
            // Save via orderService — use a simple update method
            Order saved = orderService.saveOrder(order);
            return ResponseEntity.ok(new ApiResponse(true, "Location updated", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }
    
    @PutMapping("/{id}/confirm-receipt")
    public ResponseEntity<?> confirmReceipt(@PathVariable String id) {
        try {
            Order order = orderService.confirmReceipt(id);
            return ResponseEntity.ok(new ApiResponse(true, "Réception confirmée", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}/rate")
    public ResponseEntity<?> rateOrder(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            Double rating = Double.valueOf(body.get("rating").toString());
            String reviewText = body.get("reviewText") != null ? body.get("reviewText").toString() : "";
            Order order = orderService.rateOrder(id, rating, reviewText);
            return ResponseEntity.ok(new ApiResponse(true, "Évaluation enregistrée", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    @PutMapping("/{id}/departure")
    public ResponseEntity<?> setDeparture(@PathVariable String id, @RequestBody Map<String, Object> body) {
        try {
            String departureDate = body.get("departureDate") != null ? body.get("departureDate").toString() : null;
            String departureLocation = body.get("departureLocation") != null ? body.get("departureLocation").toString() : null;
            String transporterName = body.get("transporterName") != null ? body.get("transporterName").toString() : null;
            Order order = orderService.setDeparture(id, departureDate, departureLocation, transporterName);
            return ResponseEntity.ok(new ApiResponse(true, "Départ défini", order));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(new ApiResponse(false, e.getMessage()));
        }
    }

    // Inner class for request body
    public static class CreateOrderRequest {
        private List<Order.OrderItem> items;
        private User.Address deliveryAddress;
        private String deliveryNotes;
        
        public List<Order.OrderItem> getItems() { return items; }
        public void setItems(List<Order.OrderItem> items) { this.items = items; }
        
        public User.Address getDeliveryAddress() { return deliveryAddress; }
        public void setDeliveryAddress(User.Address deliveryAddress) { this.deliveryAddress = deliveryAddress; }
        
        public String getDeliveryNotes() { return deliveryNotes; }
        public void setDeliveryNotes(String deliveryNotes) { this.deliveryNotes = deliveryNotes; }
    }
}
