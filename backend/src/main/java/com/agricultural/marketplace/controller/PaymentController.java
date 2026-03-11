package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.model.PaymentMethod;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.repository.PaymentMethodRepository;
import com.agricultural.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/payments")
@CrossOrigin(origins = "*")
public class PaymentController {
    
    @Autowired
    private PaymentMethodRepository paymentMethodRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    @Value("${stripe.api.key:sk_test_placeholder}")
    private String stripeApiKey;
    
    // Get user's payment methods
    @GetMapping("/methods")
    public ResponseEntity<?> getPaymentMethods(Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            
            User user = userOpt.get();
            List<PaymentMethod> methods = paymentMethodRepository.findByUserIdAndIsActive(user.getId(), true);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("paymentMethods", methods);
            response.put("count", methods.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching payment methods: " + e.getMessage()));
        }
    }
    
    // Add payment method
    @PostMapping("/methods")
    public ResponseEntity<?> addPaymentMethod(@RequestBody PaymentMethod paymentMethod, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            
            User user = userOpt.get();
            
            paymentMethod.setUserId(user.getId());
            paymentMethod.setCreatedAt(LocalDateTime.now());
            paymentMethod.setIsActive(true);
            
            // If this is the first payment method or is set as default
            List<PaymentMethod> existingMethods = paymentMethodRepository.findByUserId(user.getId());
            if (existingMethods.isEmpty() || paymentMethod.getIsDefault()) {
                // Unset other defaults
                existingMethods.forEach(method -> {
                    method.setIsDefault(false);
                    paymentMethodRepository.save(method);
                });
                paymentMethod.setIsDefault(true);
            } else {
                paymentMethod.setIsDefault(false);
            }
            
            PaymentMethod savedMethod = paymentMethodRepository.save(paymentMethod);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "message", "Payment method added successfully", "paymentMethod", savedMethod));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error adding payment method: " + e.getMessage()));
        }
    }
    
    // Set default payment method
    @PutMapping("/methods/{id}/set-default")
    public ResponseEntity<?> setDefaultPaymentMethod(@PathVariable String id, Authentication authentication) {
        try{
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<PaymentMethod> methodOpt = paymentMethodRepository.findById(id);
            
            if (userOpt.isEmpty() || methodOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User or payment method not found"));
            }
            
            User user = userOpt.get();
            PaymentMethod method = methodOpt.get();
            
            if (!method.getUserId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "Access denied"));
            }
            
            // Unset other defaults
            List<PaymentMethod> userMethods = paymentMethodRepository.findByUserId(user.getId());
            userMethods.forEach(m -> {
                m.setIsDefault(false);
                paymentMethodRepository.save(m);
            });
            
            // Set this as default
            method.setIsDefault(true);
            paymentMethodRepository.save(method);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Default payment method updated"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error setting default payment method: " + e.getMessage()));
        }
    }
    
    // Delete payment method
    @DeleteMapping("/methods/{id}")
    public ResponseEntity<?> deletePaymentMethod(@PathVariable String id, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            Optional<PaymentMethod> methodOpt = paymentMethodRepository.findById(id);
            
            if (userOpt.isEmpty() || methodOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User or payment method not found"));
            }
            
            User user = userOpt.get();
            PaymentMethod method = methodOpt.get();
            
            if (!method.getUserId().equals(user.getId())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                    .body(Map.of("success", false, "message", "Access denied"));
            }
            
            // Mark as inactive instead of deleting
            method.setIsActive(false);
            paymentMethodRepository.save(method);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Payment method removed"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error removing payment method: " + e.getMessage()));
        }
    }
    
    // Create payment intent (for Stripe)
    @PostMapping("/create-intent")
    public ResponseEntity<?> createPaymentIntent(@RequestBody Map<String, Object> paymentData, Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            
            // In a real implementation, you would use Stripe SDK here
            // This is a placeholder response
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("clientSecret", "placeholder_client_secret_" + System.currentTimeMillis());
            response.put("message", "Payment intent created. Note: Stripe integration requires API key configuration.");
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error creating payment intent: " + e.getMessage()));
        }
    }
    
    // Get Stripe publishable key
    @GetMapping("/config")
    public ResponseEntity<?> getPaymentConfig() {
        Map<String, Object> config = new HashMap<>();
        config.put("success", true);
        config.put("publishableKey", "pk_test_placeholder");
        config.put("message", "Configure your Stripe keys in application.properties");
        return ResponseEntity.ok(config);
    }
}
