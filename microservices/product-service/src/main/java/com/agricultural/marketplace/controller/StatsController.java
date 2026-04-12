package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.repository.ProductRepository;
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
    private ProductRepository productRepository;
    
    @GetMapping("/global")
    public ResponseEntity<Map<String, Object>> getGlobalStats() {
        Map<String, Object> stats = new HashMap<>();
        
        // Count farmers
        long farmerCount = 0; // TODO: Fetch from auth-service
        stats.put("totalFarmers", farmerCount);
        
        // Count products
        long productCount = productRepository.count();
        stats.put("totalProducts", productCount);
        
        // Calculate average rating from all farmers
        double avgRating = 4.8; // TODO: Fetch from auth-service
        stats.put("averageRating", Math.round(avgRating * 10.0) / 10.0);
        
        return ResponseEntity.ok(stats);
    }
}
