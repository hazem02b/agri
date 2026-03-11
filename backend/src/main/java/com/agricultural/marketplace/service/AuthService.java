package com.agricultural.marketplace.service;

import com.agricultural.marketplace.dto.LoginRequest;
import com.agricultural.marketplace.dto.SignupRequest;
import com.agricultural.marketplace.dto.AuthResponse;
import com.agricultural.marketplace.model.User;
import com.agricultural.marketplace.repository.UserRepository;
import com.agricultural.marketplace.security.JwtTokenProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Autowired
    private AuthenticationManager authenticationManager;
    
    @Autowired
    private JwtTokenProvider tokenProvider;
    
    public AuthResponse login(LoginRequest loginRequest) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        loginRequest.getEmail(),
                        loginRequest.getPassword()
                )
        );
        
        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);
        
        User user = userRepository.findByEmail(loginRequest.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return new AuthResponse(jwt, user);
    }
    
    public AuthResponse signup(SignupRequest signupRequest) {
        if (userRepository.existsByEmail(signupRequest.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        
        User user = new User();
        user.setEmail(signupRequest.getEmail());
        user.setPassword(passwordEncoder.encode(signupRequest.getPassword()));
        user.setFirstName(signupRequest.getFirstName());
        user.setLastName(signupRequest.getLastName());
        user.setPhone(signupRequest.getPhone());
        user.setRole(signupRequest.getRole());
        user.setAddress(signupRequest.getAddress());
        user.setIsActive(true);
        user.setIsVerified(false);
        
        if (signupRequest.getRole() == User.UserRole.FARMER && signupRequest.getFarmName() != null) {
            User.FarmerProfile farmerProfile = new User.FarmerProfile();
            farmerProfile.setFarmName(signupRequest.getFarmName());
            farmerProfile.setDescription(signupRequest.getFarmDescription());
            user.setFarmerProfile(farmerProfile);
        }
        
        User savedUser = userRepository.save(user);
        String jwt = tokenProvider.generateTokenFromEmail(savedUser.getEmail());
        
        return new AuthResponse(jwt, savedUser);
    }
}
