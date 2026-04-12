package com.agricultural.marketplace.service;

import com.agricultural.marketplace.model.Order;
import com.agricultural.marketplace.repository.OrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class KonnectPaymentService {

    @Value("${konnect.api.key:}")
    private String apiKey;

    @Value("${konnect.wallet.id:}")
    private String walletId;

    @Value("${konnect.base.url:https://api.preprod.konnect.network/api/v2}")
    private String baseUrl;

    @Value("${app.frontend.url:http://localhost:4200}")
    private String frontendUrl;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private RestTemplate restTemplate;

    /**
     * Initiates a Konnect payment for the given order.
     * Returns the payUrl to redirect the user to and the paymentRef.
     */
    @SuppressWarnings("unchecked")
    public Map<String, String> initiatePayment(String orderId) {
        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Commande introuvable: " + orderId));

        // Konnect requires amount in millimes (1 TND = 1000 millimes)
        int amountInMillimes = (int) (order.getTotalAmount() * 1000);
        String shortId = orderId.substring(0, Math.min(8, orderId.length())).toUpperCase();

        Map<String, Object> body = new LinkedHashMap<>();
        body.put("receiverWalletId", walletId);
        body.put("token", "TND");
        body.put("amount", amountInMillimes);
        body.put("type", "immediate");
        body.put("description", "Commande AgriConnect #" + shortId);
        body.put("acceptedPaymentMethods", Arrays.asList("wallet", "bank_card", "e-DINAR"));
        body.put("lifespan", 15); // minutes before link expires
        body.put("checkoutForm", false);
        body.put("orderId", orderId);
        // Konnect will append ?payment_ref=XXX to successUrl
        body.put("successUrl", frontendUrl + "/payment/result?orderId=" + orderId);
        body.put("failUrl", frontendUrl + "/payment/result?orderId=" + orderId + "&failed=true");

        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);
        headers.setContentType(MediaType.APPLICATION_JSON);

        HttpEntity<Map<String, Object>> request = new HttpEntity<>(body, headers);

        try {
            ResponseEntity<Map> response = restTemplate.postForEntity(
                    baseUrl + "/payments/init-payment", request, Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) {
                throw new RuntimeException("Réponse vide de Konnect");
            }

            String payUrl = (String) responseBody.get("payUrl");
            String paymentRef = (String) responseBody.get("paymentRef");

            if (payUrl == null || paymentRef == null) {
                throw new RuntimeException("Réponse Konnect invalide: " + responseBody);
            }

            // Save paymentRef to order for later verification
            order.setPaymentRef(paymentRef);
            orderRepository.save(order);

            Map<String, String> result = new HashMap<>();
            result.put("payUrl", payUrl);
            result.put("paymentRef", paymentRef);
            return result;

        } catch (Exception e) {
            throw new RuntimeException("Erreur Konnect: " + e.getMessage(), e);
        }
    }

    /**
     * Verifies a payment with Konnect and marks the order as PROCESSING if successful.
     */
    @SuppressWarnings("unchecked")
    public boolean verifyAndCompletePayment(String paymentRef, String orderId) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("x-api-key", apiKey);

        try {
            ResponseEntity<Map> response = restTemplate.exchange(
                    baseUrl + "/payments/" + paymentRef,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    Map.class);

            Map<String, Object> responseBody = response.getBody();
            if (responseBody == null) return false;

            Map<String, Object> payment = (Map<String, Object>) responseBody.get("payment");
            String status = payment != null ? (String) payment.get("status") : null;

            if ("completed".equals(status)) {
                Order order = orderRepository.findById(orderId)
                        .orElseThrow(() -> new RuntimeException("Commande introuvable"));

                // Avoid duplicate processing
                if (order.getStatus() == Order.OrderStatus.PROCESSING ||
                    order.getStatus() == Order.OrderStatus.SHIPPED ||
                    order.getStatus() == Order.OrderStatus.DELIVERED) {
                    return true; // Already processed
                }

                order.setStatus(Order.OrderStatus.PROCESSING);
                order.setPaymentStatus(Order.PaymentStatus.PAID);
                order.setPaymentMethod(Order.PaymentMethod.CREDIT_CARD);

                Order.OrderTracking tracking = new Order.OrderTracking();
                tracking.setStatus(Order.OrderStatus.PROCESSING);
                tracking.setDescription("Paiement confirmé via Konnect");
                tracking.setTimestamp(LocalDateTime.now());
                order.getTrackingHistory().add(tracking);

                orderRepository.save(order);
                return true;
            }
            return false;

        } catch (Exception e) {
            System.err.println("Konnect verification error: " + e.getMessage());
            return false;
        }
    }
}
