package com.agricultural.marketplace.dto;

public class ProductDto {
    private String id;
    private String name;
    private Double price;
    private String farmerId;

    // Constructors
    public ProductDto() {}

    public ProductDto(String id, String name, Double price, String farmerId) {
        this.id = id;
        this.name = name;
        this.price = price;
        this.farmerId = farmerId;
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public Double getPrice() { return price; }
    public void setPrice(Double price) { this.price = price; }
    public String getFarmerId() { return farmerId; }
    public void setFarmerId(String farmerId) { this.farmerId = farmerId; }
}