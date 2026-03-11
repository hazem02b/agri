package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.dto.ApiResponse;
import com.agricultural.marketplace.dto.ProductRequest;
import com.agricultural.marketplace.model.Product;
import com.agricultural.marketplace.service.ProductService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "*", maxAge = 3600)
public class ProductController {
    
    @Autowired
    private ProductService productService;
    
    @GetMapping("/public/all")
    public ResponseEntity<List<Product>> getAllProducts() {
        return ResponseEntity.ok(productService.getAllProducts());
    }
    
    @GetMapping("/public/{id}")
    public ResponseEntity<Product> getProductById(@PathVariable String id) {
        return ResponseEntity.ok(productService.getProductById(id));
    }
    
    @GetMapping("/public/category/{category}")
    public ResponseEntity<List<Product>> getProductsByCategory(@PathVariable Product.ProductCategory category) {
        return ResponseEntity.ok(productService.getProductsByCategory(category));
    }
    
    @GetMapping("/public/farmer/{farmerId}")
    public ResponseEntity<List<Product>> getProductsByFarmer(@PathVariable String farmerId) {
        return ResponseEntity.ok(productService.getProductsByFarmer(farmerId));
    }
    
    @GetMapping("/public/search")
    public ResponseEntity<List<Product>> searchProducts(@RequestParam String keyword) {
        return ResponseEntity.ok(productService.searchProducts(keyword));
    }
    
    @PostMapping
    public ResponseEntity<?> createProduct(@Valid @RequestBody ProductRequest request, 
                                          Authentication authentication) {
        try {
            String email = authentication.getName();
            Product product = productService.createProduct(request, email);
            return ResponseEntity.ok(new ApiResponse(true, "Product created successfully", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to create product: " + e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<?> updateProduct(@PathVariable String id,
                                          @Valid @RequestBody ProductRequest request,
                                          Authentication authentication) {
        try {
            String email = authentication.getName();
            Product product = productService.updateProduct(id, request, email);
            return ResponseEntity.ok(new ApiResponse(true, "Product updated successfully", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update product: " + e.getMessage()));
        }
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable String id, Authentication authentication) {
        try {
            String email = authentication.getName();
            productService.deleteProduct(id, email);
            return ResponseEntity.ok(new ApiResponse(true, "Product deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to delete product: " + e.getMessage()));
        }
    }
    
    @PostMapping("/{id}/review")
    public ResponseEntity<?> addReview(@PathVariable String id,
                                      @RequestParam Integer rating,
                                      @RequestParam String comment,
                                      Authentication authentication) {
        try {
            String email = authentication.getName();
            Product product = productService.addReview(id, rating, comment, email);
            return ResponseEntity.ok(new ApiResponse(true, "Review added successfully", product));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to add review: " + e.getMessage()));
        }
    }
    
    @GetMapping("/my-products")
    public ResponseEntity<List<Product>> getMyProducts(Authentication authentication) {
        String email = authentication.getName();
        return ResponseEntity.ok(productService.getMyProducts(email));
    }
}
