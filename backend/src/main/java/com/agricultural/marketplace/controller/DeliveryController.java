package com.agricultural.marketplace.controller;

import com.agricultural.marketplace.model.DeliveryRoute;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.repository.DeliveryRouteRepository;
import com.agricultural.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
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
@RequestMapping("/api/delivery")
@CrossOrigin(origins = "*")
public class DeliveryController {
    
    @Autowired
    private DeliveryRouteRepository deliveryRouteRepository;
    
    @Autowired
    private UserRepository userRepository;
    
    // Get all delivery routes
    @GetMapping("/routes")
    public ResponseEntity<?> getAllRoutes(Authentication authentication) {
        try {
            List<DeliveryRoute> routes = deliveryRouteRepository.findAll();
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("routes", routes);
            response.put("count", routes.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching routes: " + e.getMessage()));
        }
    }
    
    // Get route by ID
    @GetMapping("/routes/{id}")
    public ResponseEntity<?> getRouteById(@PathVariable String id) {
        try {
            Optional<DeliveryRoute> route = deliveryRouteRepository.findById(id);
            
            if (route.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Route not found"));
            }
            
            return ResponseEntity.ok(Map.of("success", true, "route", route.get()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching route: " + e.getMessage()));
        }
    }
    
    // Get routes by status
    @GetMapping("/routes/status/{status}")
    public ResponseEntity<?> getRoutesByStatus(@PathVariable String status) {
        try {
            DeliveryRoute.RouteStatus routeStatus = DeliveryRoute.RouteStatus.valueOf(status.toUpperCase());
            List<DeliveryRoute> routes = deliveryRouteRepository.findByStatus(routeStatus);
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("routes", routes);
            response.put("count", routes.size());
            
            return ResponseEntity.ok(response);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(Map.of("success", false, "message", "Invalid status: " + status));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching routes: " + e.getMessage()));
        }
    }
    
    // Create new delivery route
    @PostMapping("/routes")
    public ResponseEntity<?> createRoute(@RequestBody DeliveryRoute route, Authentication authentication) {
        try {
            route.setCreatedAt(LocalDateTime.now());
            route.setUpdatedAt(LocalDateTime.now());
            
            if (route.getStatus() == null) {
                route.setStatus(DeliveryRoute.RouteStatus.PLANNED);
            }
            
            DeliveryRoute savedRoute = deliveryRouteRepository.save(route);
            
            return ResponseEntity.status(HttpStatus.CREATED)
                .body(Map.of("success", true, "message", "Route created successfully", "route", savedRoute));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error creating route: " + e.getMessage()));
        }
    }
    
    // Update delivery route
    @PutMapping("/routes/{id}")
    public ResponseEntity<?> updateRoute(@PathVariable String id, @RequestBody DeliveryRoute route) {
        try {
            Optional<DeliveryRoute> existingRouteOpt = deliveryRouteRepository.findById(id);
            
            if (existingRouteOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Route not found"));
            }
            
            DeliveryRoute existingRoute = existingRouteOpt.get();
            
            if (route.getDriverId() != null) existingRoute.setDriverId(route.getDriverId());
            if (route.getDriverName() != null) existingRoute.setDriverName(route.getDriverName());
            if (route.getVehicleType() != null) existingRoute.setVehicleType(route.getVehicleType());
            if (route.getVehicleNumber() != null) existingRoute.setVehicleNumber(route.getVehicleNumber());
            if (route.getStops() != null) existingRoute.setStops(route.getStops());
            if (route.getStatus() != null) existingRoute.setStatus(route.getStatus());
            if (route.getScheduledDate() != null) existingRoute.setScheduledDate(route.getScheduledDate());
            if (route.getTotalDistance() != null) existingRoute.setTotalDistance(route.getTotalDistance());
            if (route.getTotalOrders() != null) existingRoute.setTotalOrders(route.getTotalOrders());
            
            existingRoute.setUpdatedAt(LocalDateTime.now());
            
            DeliveryRoute updatedRoute = deliveryRouteRepository.save(existingRoute);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Route updated successfully", "route", updatedRoute));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error updating route: " + e.getMessage()));
        }
    }
    
    // Start route
    @PostMapping("/routes/{id}/start")
    public ResponseEntity<?> startRoute(@PathVariable String id) {
        try {
            Optional<DeliveryRoute> routeOpt = deliveryRouteRepository.findById(id);
            
            if (routeOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Route not found"));
            }
            
            DeliveryRoute route = routeOpt.get();
            route.setStatus(DeliveryRoute.RouteStatus.IN_PROGRESS);
            route.setStartedAt(LocalDateTime.now());
            route.setUpdatedAt(LocalDateTime.now());
            
            deliveryRouteRepository.save(route);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Route started successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error starting route: " + e.getMessage()));
        }
    }
    
    // Complete route
    @PostMapping("/routes/{id}/complete")
    public ResponseEntity<?> completeRoute(@PathVariable String id) {
        try {
            Optional<DeliveryRoute> routeOpt = deliveryRouteRepository.findById(id);
            
            if (routeOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Route not found"));
            }
            
            DeliveryRoute route = routeOpt.get();
            route.setStatus(DeliveryRoute.RouteStatus.COMPLETED);
            route.setCompletedAt(LocalDateTime.now());
            route.setUpdatedAt(LocalDateTime.now());
            
            deliveryRouteRepository.save(route);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Route completed successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error completing route: " + e.getMessage()));
        }
    }
    
    // Update delivery stop status
    @PutMapping("/routes/{routeId}/stops/{stopIndex}")
    public ResponseEntity<?> updateStopStatus(
        @PathVariable String routeId,
        @PathVariable int stopIndex,
        @RequestBody Map<String, Object> updates
    ) {
        try {
            Optional<DeliveryRoute> routeOpt = deliveryRouteRepository.findById(routeId);
            
            if (routeOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Route not found"));
            }
            
            DeliveryRoute route = routeOpt.get();
            
            if (stopIndex < 0 || stopIndex >= route.getStops().size()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("success", false, "message", "Invalid stop index"));
            }
            
            DeliveryRoute.DeliveryStop stop = route.getStops().get(stopIndex);
            
            if (updates.containsKey("status")) {
                String statusStr = (String) updates.get("status");
                stop.setStatus(DeliveryRoute.DeliveryStop.StopStatus.valueOf(statusStr));
            }
            
            if (updates.containsKey("actualArrival")) {
                stop.setActualArrival(LocalDateTime.now());
            }
            
            if (updates.containsKey("notes")) {
                stop.setNotes((String) updates.get("notes"));
            }
            
            if (updates.containsKey("signature")) {
                stop.setSignature((String) updates.get("signature"));
            }
            
            route.setUpdatedAt(LocalDateTime.now());
            deliveryRouteRepository.save(route);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Stop status updated successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error updating stop: " + e.getMessage()));
        }
    }
    
    // Delete route
    @DeleteMapping("/routes/{id}")
    public ResponseEntity<?> deleteRoute(@PathVariable String id) {
        try {
            Optional<DeliveryRoute> routeOpt = deliveryRouteRepository.findById(id);
            
            if (routeOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "Route not found"));
            }
            
            deliveryRouteRepository.deleteById(id);
            
            return ResponseEntity.ok(Map.of("success", true, "message", "Route deleted successfully"));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error deleting route: " + e.getMessage()));
        }
    }
    
    // Get driver's routes
    @GetMapping("/my-routes")
    public ResponseEntity<?> getMyRoutes(Authentication authentication) {
        try {
            String email = authentication.getName();
            Optional<User> userOpt = userRepository.findByEmail(email);
            
            if (userOpt.isEmpty()) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("success", false, "message", "User not found"));
            }
            
            User user = userOpt.get();
            List<DeliveryRoute> routes = deliveryRouteRepository.findByDriverId(user.getId());
            
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("routes", routes);
            response.put("count", routes.size());
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Map.of("success", false, "message", "Error fetching routes: " + e.getMessage()));
        }
    }
}
