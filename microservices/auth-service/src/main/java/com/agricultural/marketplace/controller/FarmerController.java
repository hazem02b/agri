package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.dto.ApiResponse;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/farmers")
@CrossOrigin(origins = "*", maxAge = 3600)
public class FarmerController {
    
    @Autowired
    private UserRepository userRepository;
    
    @GetMapping("/public/all")
    public ResponseEntity<List<User>> getAllFarmers() {
        List<User> farmers = userRepository.findByRole(User.UserRole.FARMER);
        return ResponseEntity.ok(farmers);
    }
    
    @GetMapping("/public/{id}")
    public ResponseEntity<?> getFarmerById(@PathVariable String id) {
        return userRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @GetMapping("/profile")
    public ResponseEntity<?> getMyProfile(Authentication authentication) {
        String email = authentication.getName();
        return userRepository.findByEmail(email)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@RequestBody User updateRequest, 
                                          Authentication authentication) {
        try {
            String email = authentication.getName();
            User user = userRepository.findByEmail(email)
                    .orElseThrow(() -> new RuntimeException("User not found"));
            
            // Update allowed fields
            user.setFirstName(updateRequest.getFirstName());
            user.setLastName(updateRequest.getLastName());
            user.setPhone(updateRequest.getPhone());
            user.setAddress(updateRequest.getAddress());
            user.setProfileImage(updateRequest.getProfileImage());
            
            if (user.getRole() == User.UserRole.FARMER) {
                user.setFarmerProfile(updateRequest.getFarmerProfile());
            }
            
            User updated = userRepository.save(user);
            return ResponseEntity.ok(new ApiResponse(true, "Profile updated successfully", updated));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update profile: " + e.getMessage()));
        }
    }
}
