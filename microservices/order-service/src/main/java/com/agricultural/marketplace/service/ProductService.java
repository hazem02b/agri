package com.agricultural.marketplace.service;

import com.agricultural.marketplace.dto.ProductRequest;
import com.agricultural.marketplace.model.Product;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.repository.ProductRepository;
import com.agricultural.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class ProductService {
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    public List<Product> getAllProducts() {
        return productRepository.findByIsAvailable(true);
    }
    
    public Product getProductById(String id) {
        return productRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Product not found"));
    }
    
    public List<Product> getProductsByCategory(Product.ProductCategory category) {
        return productRepository.findByCategoryAndIsAvailable(category, true);
    }
    
    public List<Product> getProductsByFarmer(String farmerId) {
        return productRepository.findByFarmerId(farmerId);
    }
    
    public List<Product> searchProducts(String keyword) {
        return productRepository.findByNameContainingIgnoreCase(keyword);
    }
    
    public Product createProduct(ProductRequest request, String farmerEmail) {
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        
        if (farmer.getRole() != User.UserRole.FARMER) {
            throw new RuntimeException("Only farmers can create products");
        }
        
        Product product = new Product();
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setUnit(request.getUnit());
        product.setStock(request.getStock());
        product.setImages(request.getImages());
        product.setFarmer(farmer);
        product.setFarmerId(farmer.getId());
        product.setIsOrganic(request.getIsOrganic());
        product.setIsAvailable(true);
        product.setLocation(request.getLocation());
        product.setHarvestDate(request.getHarvestDate());
        
        return productRepository.save(product);
    }
    
    public Product updateProduct(String id, ProductRequest request, String farmerEmail) {
        Product product = getProductById(id);
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        
        if (!product.getFarmerId().equals(farmer.getId())) {
            throw new RuntimeException("You can only update your own products");
        }
        
        product.setName(request.getName());
        product.setDescription(request.getDescription());
        product.setCategory(request.getCategory());
        product.setPrice(request.getPrice());
        product.setUnit(request.getUnit());
        product.setStock(request.getStock());
        product.setImages(request.getImages());
        product.setIsOrganic(request.getIsOrganic());
        product.setLocation(request.getLocation());
        product.setHarvestDate(request.getHarvestDate());
        
        return productRepository.save(product);
    }
    
    public void deleteProduct(String id, String farmerEmail) {
        Product product = getProductById(id);
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        
        if (!product.getFarmerId().equals(farmer.getId())) {
            throw new RuntimeException("You can only delete your own products");
        }
        
        product.setIsAvailable(false);
        productRepository.save(product);
    }
    
    public Product addReview(String productId, Integer rating, String comment, String customerEmail) {
        Product product = getProductById(productId);
        User customer = userRepository.findByEmail(customerEmail)
                .orElseThrow(() -> new RuntimeException("Customer not found"));
        
        Product.Review review = new Product.Review();
        review.setCustomerId(customer.getId());
        review.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
        review.setRating(rating);
        review.setComment(comment);
        review.setCreatedAt(LocalDateTime.now());
        
        product.getReviews().add(review);
        
        // Update average rating
        double avgRating = product.getReviews().stream()
                .mapToInt(Product.Review::getRating)
                .average()
                .orElse(0.0);
        product.setRating(avgRating);
        product.setTotalReviews(product.getReviews().size());
        
        return productRepository.save(product);
    }
    
    public List<Product> getMyProducts(String farmerEmail) {
        User farmer = userRepository.findByEmail(farmerEmail)
                .orElseThrow(() -> new RuntimeException("Farmer not found"));
        return productRepository.findByFarmerId(farmer.getId());
    }
}
