package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.dto.ApiResponse;
import com.agricultural.marketplace.dto.ChangePasswordRequest;
import com.agricultural.marketplace.dto.UpdateProfileRequest;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*", maxAge = 3600)
public class UserController {
    
    @Autowired
    private UserService userService;
    
    /**
     * Get current user profile
     */
    @GetMapping("/me")
    public ResponseEntity<?> getCurrentUser() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User user = userService.getUserByEmail(email);
            // Don't send password in response
            user.setPassword(null);
            
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to get user: " + e.getMessage()));
        }
    }
    
    /**
     * Update user profile
     */
    @PutMapping("/profile")
    public ResponseEntity<?> updateProfile(@Valid @RequestBody UpdateProfileRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userService.getUserByEmail(email);
            User updatedUser = userService.updateProfile(currentUser.getId(), request);
            
            // Don't send password in response
            updatedUser.setPassword(null);
            
            return ResponseEntity.ok(new ApiResponse(true, "Profile updated successfully", updatedUser));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to update profile: " + e.getMessage()));
        }
    }
    
    /**
     * Change password
     */
    @PutMapping("/change-password")
    public ResponseEntity<?> changePassword(@Valid @RequestBody ChangePasswordRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            
            User currentUser = userService.getUserByEmail(email);
            userService.changePassword(currentUser.getId(), request);
            
            return ResponseEntity.ok(new ApiResponse(true, "Password changed successfully"));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to change password: " + e.getMessage()));
        }
    }
    
    /**
     * Get user by ID (admin or self)
     */
    @GetMapping("/{userId}")
    public ResponseEntity<?> getUserById(@PathVariable String userId) {
        try {
            User user = userService.getUserById(userId);
            // Don't send password in response
            user.setPassword(null);
            
            return ResponseEntity.ok(user);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to get user: " + e.getMessage()));
        }
    }
}
