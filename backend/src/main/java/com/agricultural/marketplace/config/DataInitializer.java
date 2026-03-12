package com.agricultural.marketplace.config;

import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataInitializer implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) throws Exception {
        // Create test farmer if not exists
        if (userRepository.findByEmail("farmer@test.com").isEmpty()) {
            User farmer = new User();
            farmer.setEmail("farmer@test.com");
            farmer.setPassword(passwordEncoder.encode("password123"));
            farmer.setFirstName("Jean");
            farmer.setLastName("Dupont");
            farmer.setPhone("+216 12 345 678");
            farmer.setRole(User.UserRole.FARMER);
            farmer.setIsVerified(true);
            farmer.setIsActive(true);
            farmer.setCreatedAt(LocalDateTime.now());
            farmer.setUpdatedAt(LocalDateTime.now());
            
            // Set farmer profile
            User.FarmerProfile farmerProfile = new User.FarmerProfile();
            farmerProfile.setFarmName("Ferme Bio Dupont");
            farmerProfile.setDescription("Producteur de fruits et légumes biologiques depuis 15 ans");
            farmerProfile.setCertifications("Agriculture Biologique, Ecocert");
            farmerProfile.setRating(4.5);
            farmerProfile.setTotalReviews(25);
            farmer.setFarmerProfile(farmerProfile);
            
            // Set address
            User.Address address = new User.Address();
            address.setStreet("Route de Bizerte");
            address.setCity("Tunis");
            address.setState("Tunis");
            address.setZipCode("1000");
            address.setCountry("Tunisie");
            farmer.setAddress(address);
            
            userRepository.save(farmer);
            System.out.println("✅ Test farmer account created: farmer@test.com / password123");
        }
        
        // Create test customer if not exists
        if (userRepository.findByEmail("customer@test.com").isEmpty()) {
            User customer = new User();
            customer.setEmail("customer@test.com");
            customer.setPassword(passwordEncoder.encode("password123"));
            customer.setFirstName("Marie");
            customer.setLastName("Martin");
            customer.setPhone("+216 98 765 432");
            customer.setRole(User.UserRole.CUSTOMER);
            customer.setIsVerified(true);
            customer.setIsActive(true);
            customer.setCreatedAt(LocalDateTime.now());
            customer.setUpdatedAt(LocalDateTime.now());
            
            // Set address
            User.Address address = new User.Address();
            address.setStreet("Avenue Habib Bourguiba");
            address.setCity("Tunis");
            address.setState("Tunis");
            address.setZipCode("1000");
            address.setCountry("Tunisie");
            customer.setAddress(address);
            
            userRepository.save(customer);
            System.out.println("✅ Test customer account created: customer@test.com / password123");
        }
        
        System.out.println("📊 Database initialization completed!");
    }
}
