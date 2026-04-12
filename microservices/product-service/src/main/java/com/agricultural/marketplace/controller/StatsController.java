package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.repository.UserRepository;
import com.agricultural.marketplace.repository.ProductRepository;
import com.agricultural.marketplace.repository.OrderRepository;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.model.Product;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stats")
@CrossOrigin(origins = "*", maxAge = 3600)
public class StatsController {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @GetMapping("/global")
    public ResponseEntity<Map<String, Object>> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Count farmers
        long farmerCount = userRepository.countByRole(User.UserRole.FARMER);
        stats.put("totalFarmers", farmerCount);
        
        // Count products
        long productCount = productRepository.count();
        stats.put("totalProducts", productCount);
        
        // Count orders
        long orderCount = orderRepository.count();
        stats.put("totalOrders", orderCount);
        
        // Calculate average rating from all farmers
        List<User> farmers = userRepository.findByRole(User.UserRole.FARMER);
        double avgRating = farmers.stream()
                .filter(f -> f.getFarmerProfile() != null && f.getFarmerProfile().getRating() != null)
                .mapToDouble(f -> f.getFarmerProfile().getRating())
                .average()
                .orElse(4.8);
        stats.put("averageRating", Math.round(avgRating * 10.0) / 10.0);
        
        return ResponseEntity.ok(stats);
    }
}
