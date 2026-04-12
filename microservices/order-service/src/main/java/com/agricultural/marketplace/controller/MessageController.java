package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.dto.ApiResponse;
import com.agricultural.marketplace.dto.CreateConversationRequest;
import com.agricultural.marketplace.dto.MessageRequest;
import com.agricultural.marketplace.model.Conversation;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.service.MessageService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/messages")
@CrossOrigin(origins = "*", maxAge = 3600)
public class MessageController {
    
    @Autowired
    private MessageService messageService;
    
    // User data should be fetched from auth-service via API call
    private String getCurrentUserId(String email) {
        // Mock method to bypass UserService dependency
        return "mock-uuid-for-" + email;
    }
    
    private User getCurrentUserMock(String email) {
        User user = new User();
        user.setId(getCurrentUserId(email));
        user.setEmail(email);
        user.setFirstName("Mock");
        user.setLastName("User");
        return user;
    }
    
    /**
     * Get all conversations for the current user
     */
    @GetMapping("/conversations")
    public ResponseEntity<?> getUserConversations() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User currentUser = getCurrentUserMock(email);
            
            List<Conversation> conversations = messageService.getUserConversations(currentUser.getId());
            return ResponseEntity.ok(conversations);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to get conversations: " + e.getMessage()));
        }
    }
    
    /**
     * Get a specific conversation by ID
     */
    @GetMapping("/conversations/{conversationId}")
    public ResponseEntity<?> getConversation(@PathVariable String conversationId) {
        try {
            Conversation conversation = messageService.getConversationById(conversationId)
                    .orElseThrow(() -> new RuntimeException("Conversation not found"));
            
            return ResponseEntity.ok(conversation);
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to get conversation: " + e.getMessage()));
        }
    }
    
    /**
     * Create a new conversation
     */
    @PostMapping("/conversations")
    public ResponseEntity<?> createConversation(@Valid @RequestBody CreateConversationRequest request) {
        try {
            Conversation conversation = messageService.createOrGetConversation(
                    request.getCustomerId(),
                    request.getCustomerName(),
                    request.getFarmerId(),
                    request.getFarmerName()
            );
            
            return ResponseEntity.ok(new ApiResponse(true, "Conversation created successfully", conversation));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to create conversation: " + e.getMessage()));
        }
    }
    
    /**
     * Send a message in a conversation
     */
    @PostMapping("/send")
    public ResponseEntity<?> sendMessage(@Valid @RequestBody MessageRequest request) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User currentUser = getCurrentUserMock(email);
            
            Conversation conversation = messageService.addMessage(
                    request.getConversationId(),
                    currentUser.getId(),
                    currentUser.getFirstName() + " " + currentUser.getLastName(),
                    request.getContent()
            );
            
            return ResponseEntity.ok(new ApiResponse(true, "Message sent successfully", conversation));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to send message: " + e.getMessage()));
        }
    }
    
    /**
     * Mark conversation as read
     */
    @PutMapping("/conversations/{conversationId}/read")
    public ResponseEntity<?> markAsRead(@PathVariable String conversationId) {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User currentUser = getCurrentUserMock(email);
            
            Conversation conversation = messageService.markAsRead(conversationId, currentUser.getId());
            
            return ResponseEntity.ok(new ApiResponse(true, "Messages marked as read", conversation));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to mark as read: " + e.getMessage()));
        }
    }
    
    /**
     * Get unread message count for current user
     */
    @GetMapping("/unread-count")
    public ResponseEntity<?> getUnreadCount() {
        try {
            Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
            String email = authentication.getName();
            User currentUser = getCurrentUserMock(email);
            
            int count = messageService.getUnreadCount(currentUser.getId());
            
            return ResponseEntity.ok(new ApiResponse(true, "Unread count retrieved", count));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(new ApiResponse(false, "Failed to get unread count: " + e.getMessage()));
        }
    }
}
