package com.agricultural.marketplace.client;

import com.agricultural.marketplace.dto.ProductDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "product-service", url = "${product-service.url:http://localhost:8082}")
public interface ProductServiceClient {

    @GetMapping("/api/products/{id}")
    ProductDto getProductById(@PathVariable("id") String id);
}