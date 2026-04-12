package com.agricultural.marketplace.client;

import com.agricultural.marketplace.dto.UserDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;

@FeignClient(name = "auth-service", url = "${auth-service.url:http://localhost:8081}")
public interface AuthServiceClient {

    @GetMapping("/api/users")
    UserDto getUserByEmail(@RequestParam("email") String email);
}