package com.agricultural.marketplace.config;

import com.agricultural.marketplace.model.*;
import com.agricultural.marketplace.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;

@Component
@ConditionalOnProperty(name = "app.seed.enabled", havingValue = "true", matchIfMissing = true)
public class DataSeeder implements CommandLineRunner {
    
    @Autowired
    private UserRepository userRepository;
    
    @Autowired
    private ProductRepository productRepository;
    
    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ConversationRepository conversationRepository;
    
    @Autowired
    private JobOfferRepository jobOfferRepository;
    
    @Autowired
    private DeliveryRouteRepository deliveryRouteRepository;
    
    @Autowired
    private PaymentMethodRepository paymentMethodRepository;
    
    @Autowired
    private PasswordEncoder passwordEncoder;
    
    @Override
    public void run(String... args) {
        // Only seed if test farmer doesn't exist yet (avoids wiping user accounts on restart)
        if (userRepository.findByEmail("farmer@test.com").isPresent()) {
            System.out.println("✅ Database already seeded, skipping.");
            return;
        }
        
        System.out.println("🌱 Seeding database with demo data...");
        
        // Create users
        User farmer = createFarmer();
        User customer1 = createCustomer1();
        User customer2 = createCustomer2();
        
        // Create products for farmer
        List<Product> products = createProducts(farmer);
        
        // Create orders
        createOrders(customer1, customer2, farmer, products);
        
        // Create messages
        createMessages(customer1, farmer);
        
        // Create job offers
        createJobOffers(farmer);
        
        // Create delivery routes
        createDeliveryRoutes(farmer);
        
        // Create payment methods
        createPaymentMethods(customer1, customer2);
        
        System.out.println("✅ Database seeded successfully!");
        System.out.println("📧 Farmer: farmer@test.com / password123");
        System.out.println("📧 Customer 1: customer1@test.com / password123");
        System.out.println("📧 Customer 2: customer2@test.com / password123");
        System.out.println("💼 Created 3 job offers");
        System.out.println("🚚 Created 2 delivery routes");
        System.out.println("💳 Created payment methods for customers");
    }
    
    private User createFarmer() {
        User farmer = new User();
        farmer.setEmail("farmer@test.com");
        farmer.setPassword(passwordEncoder.encode("password123"));
        farmer.setFirstName("Mohamed");
        farmer.setLastName("Ben Ali");
        farmer.setPhone("+216 98 123 456");
        farmer.setRole(User.UserRole.FARMER);
        farmer.setIsVerified(true);
        farmer.setIsActive(true);
        farmer.setProfileImage("https://ui-avatars.com/api/?name=Mohamed+Ben+Ali&background=10b981&color=fff");
        
        User.Address address = new User.Address();
        address.setStreet("Route de Nabeul Km 5");
        address.setCity("Hammamet");
        address.setState("Nabeul");
        address.setZipCode("8050");
        address.setCountry("Tunisia");
        address.setLatitude(36.4008);
        address.setLongitude(10.6176);
        farmer.setAddress(address);
        
        User.FarmerProfile profile = new User.FarmerProfile();
        profile.setFarmName("Ferme El Baraka");
        profile.setDescription("Exploitation agricole familiale depuis 1985. Spécialisée dans les produits bio et les agrumes de qualité.");
        profile.setCertifications("Bio Tunisie, Ecocert");
        profile.setRating(4.8);
        profile.setTotalReviews(45);
        profile.setFarmImage("https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800");
        profile.setSpecialties(Arrays.asList("Agrumes bio", "Légumes de saison", "Olives et huile d'olive"));
        farmer.setFarmerProfile(profile);
        
        return userRepository.save(farmer);
    }
    
    private User createCustomer1() {
        User customer = new User();
        customer.setEmail("customer1@test.com");
        customer.setPassword(passwordEncoder.encode("password123"));
        customer.setFirstName("Leila");
        customer.setLastName("Mansour");
        customer.setPhone("+216 22 456 789");
        customer.setRole(User.UserRole.CUSTOMER);
        customer.setIsVerified(true);
        customer.setIsActive(true);
        customer.setProfileImage("https://ui-avatars.com/api/?name=Leila+Mansour&background=0ea5e9&color=fff");
        
        User.Address address = new User.Address();
        address.setStreet("Avenue Habib Bourguiba");
        address.setCity("Tunis");
        address.setState("Tunis");
        address.setZipCode("1000");
        address.setCountry("Tunisia");
        address.setLatitude(36.8065);
        address.setLongitude(10.1815);
        customer.setAddress(address);
        
        return userRepository.save(customer);
    }
    
    private User createCustomer2() {
        User customer = new User();
        customer.setEmail("customer2@test.com");
        customer.setPassword(passwordEncoder.encode("password123"));
        customer.setFirstName("Karim");
        customer.setLastName("Jebali");
        customer.setPhone("+216 55 789 123");
        customer.setRole(User.UserRole.CUSTOMER);
        customer.setIsVerified(true);
        customer.setIsActive(true);
        customer.setProfileImage("https://ui-avatars.com/api/?name=Karim+Jebali&background=8b5cf6&color=fff");
        
        User.Address address = new User.Address();
        address.setStreet("Rue de la République");
        address.setCity("Sousse");
        address.setState("Sousse");
        address.setZipCode("4000");
        address.setCountry("Tunisia");
        address.setLatitude(35.8256);
        address.setLongitude(10.6369);
        customer.setAddress(address);
        
        return userRepository.save(customer);
    }
    
    private List<Product> createProducts(User farmer) {
        List<Product> products = new ArrayList<>();
        
        // Product 1: Tomates Bio
        products.add(createProduct(farmer, "Tomates Bio", "Tomates fraîches et juteuses, cultivées sans pesticides", 
            Product.ProductCategory.VEGETABLES, 8.5, "kg", 150, 
            Arrays.asList("https://images.unsplash.com/photo-1546094096-0df4bcaaa337?w=800"),
            true, "Hammamet, Nabeul", LocalDateTime.now().minusDays(2)));
        
        // Product 2: Oranges Maltaises
        products.add(createProduct(farmer, "Oranges Maltaises", "Oranges sucrées et parfumées, idéales pour le jus", 
            Product.ProductCategory.FRUITS, 6.0, "kg", 200, 
            Arrays.asList("https://images.unsplash.com/photo-1582979512210-99b6a53386f9?w=800"),
            true, "Hammamet, Nabeul", LocalDateTime.now().minusDays(1)));
        
        // Product 3: Poivrons
        products.add(createProduct(farmer, "Poivrons Mixtes", "Mélange coloré de poivrons rouges, jaunes et verts", 
            Product.ProductCategory.VEGETABLES, 9.0, "kg", 80, 
            Arrays.asList("https://images.unsplash.com/photo-1563565375-f3fdfdbefa83?w=800"),
            false, "Hammamet, Nabeul", LocalDateTime.now().minusDays(1)));
        
        // Product 4: Citrons
        products.add(createProduct(farmer, "Citrons de Tunisie", "Citrons juteux et acidulés, parfaits pour la cuisine", 
            Product.ProductCategory.FRUITS, 4.5, "kg", 120, 
            Arrays.asList("https://images.unsplash.com/photo-1590502593747-42a996133562?w=800"),
            true, "Hammamet, Nabeul", LocalDateTime.now().minusDays(3)));
        
        // Product 5: Courgettes
        products.add(createProduct(farmer, "Courgettes Fraîches", "Courgettes tendres et fraîches, cueillies du jour", 
            Product.ProductCategory.VEGETABLES, 5.5, "kg", 100, 
            Arrays.asList("https://images.unsplash.com/photo-1597362925123-77861d3fbac7?w=800"),
            true, "Hammamet, Nabeul", LocalDateTime.now()));
        
        // Product 6: Fraises
        products.add(createProduct(farmer, "Fraises de Saison", "Fraises sucrées et parfumées, cultivées localement", 
            Product.ProductCategory.FRUITS, 12.0, "kg", 50, 
            Arrays.asList("https://images.unsplash.com/photo-1543528176-61b239494933?w=800"),
            true, "Hammamet, Nabeul", LocalDateTime.now().minusDays(1)));
        
        // Product 7: Huile d'Olive
        products.add(createProduct(farmer, "Huile d'Olive Extra Vierge", "Huile d'olive pure, première pression à froid", 
            Product.ProductCategory.OTHER, 25.0, "litre", 30, 
            Arrays.asList("https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?w=800"),
            true, "Hammamet, Nabeul", LocalDateTime.now().minusMonths(1)));
        
        // Product 8: Oeufs Fermiers
        products.add(createProduct(farmer, "Œufs Fermiers Bio", "Œufs frais de poules élevées en plein air", 
            Product.ProductCategory.EGGS, 15.0, "douzaine", 100, 
            Arrays.asList("https://images.unsplash.com/photo-1582722872445-44dc5f7e3c8f?w=800"),
            true, "Hammamet, Nabeul", LocalDateTime.now()));
        
        // Product 9: Carottes
        products.add(createProduct(farmer, "Carottes Bio", "Carottes croquantes et sucrées, cultivées sans chimie", 
            Product.ProductCategory.VEGETABLES, 6.5, "kg", 90, 
            Arrays.asList("https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?w=800"),
            true, "Hammamet, Nabeul", LocalDateTime.now().minusDays(2)));
        
        // Product 10: Miel
        products.add(createProduct(farmer, "Miel de Fleurs", "Miel artisanal récolté dans nos ruches", 
            Product.ProductCategory.HONEY, 35.0, "pot 500g", 20, 
            Arrays.asList("https://images.unsplash.com/photo-1587049352846-4a222e784718?w=800"),
            true, "Hammamet, Nabeul", LocalDateTime.now().minusMonths(2)));
        
        return productRepository.saveAll(products);
    }
    
    private Product createProduct(User farmer, String name, String description, 
                                 Product.ProductCategory category, double price, String unit,
                                 int stock, List<String> images, boolean isOrganic,
                                 String location, LocalDateTime harvestDate) {
        Product product = new Product();
        product.setName(name);
        product.setDescription(description);
        product.setCategory(category);
        product.setPrice(price);
        product.setUnit(unit);
        product.setStock(stock);
        product.setImages(images);
        product.setFarmer(farmer);
        product.setFarmerId(farmer.getId());
        product.setIsOrganic(isOrganic);
        product.setIsAvailable(true);
        product.setLocation(location);
        product.setHarvestDate(harvestDate);
        product.setRating(4.0 + Math.random()); // Random rating between 4.0 and 5.0
        product.setTotalReviews((int)(Math.random() * 20) + 5); // Random reviews between 5 and 25
        product.setCreatedAt(LocalDateTime.now().minusDays((long)(Math.random() * 30)));
        return product;
    }
    
    private void createOrders(User customer1, User customer2, User farmer, List<Product> products) {
        // Order 1: Customer1 buys tomatoes and oranges
        Order.OrderItem item1 = new Order.OrderItem();
        item1.setProductId(products.get(0).getId());
        item1.setProductName(products.get(0).getName());
        item1.setFarmerId(farmer.getId());
        item1.setFarmerName(farmer.getFarmerProfile().getFarmName());
        item1.setQuantity(2);
        item1.setPrice(products.get(0).getPrice());
        item1.setSubtotal(item1.getQuantity() * item1.getPrice());
        item1.setProductImage(products.get(0).getImages().get(0));
        
        Order.OrderItem item2 = new Order.OrderItem();
        item2.setProductId(products.get(1).getId());
        item2.setProductName(products.get(1).getName());
        item2.setFarmerId(farmer.getId());
        item2.setFarmerName(farmer.getFarmerProfile().getFarmName());
        item2.setQuantity(3);
        item2.setPrice(products.get(1).getPrice());
        item2.setSubtotal(item2.getQuantity() * item2.getPrice());
        item2.setProductImage(products.get(1).getImages().get(0));
        
        Order order1 = new Order();
        order1.setOrderNumber("ORD-2026-001");
        order1.setCustomer(customer1);
        order1.setCustomerId(customer1.getId());
        order1.setFarmerId(farmer.getId());
        order1.setFarmerName(farmer.getFarmerProfile().getFarmName());
        order1.setItems(Arrays.asList(item1, item2));
        order1.setTotalAmount(item1.getSubtotal() + item2.getSubtotal());
        order1.setStatus(Order.OrderStatus.PROCESSING);
        order1.setPaymentStatus(Order.PaymentStatus.PAID);
        order1.setPaymentMethod(Order.PaymentMethod.CREDIT_CARD);
        order1.setDeliveryAddress(customer1.getAddress());
        order1.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(2));
        order1.setCreatedAt(LocalDateTime.now().minusDays(1));
        
        Order.OrderTracking tracking1 = new Order.OrderTracking();
        tracking1.setStatus(Order.OrderStatus.PENDING);
        tracking1.setDescription("Commande reçue");
        tracking1.setTimestamp(LocalDateTime.now().minusDays(1));
        tracking1.setLocation("Plateforme Agricultural Marketplace");
        
        Order.OrderTracking tracking2 = new Order.OrderTracking();
        tracking2.setStatus(Order.OrderStatus.CONFIRMED);
        tracking2.setDescription("Commande confirmée par le producteur");
        tracking2.setTimestamp(LocalDateTime.now().minusHours(18));
        tracking2.setLocation("Ferme El Baraka, Hammamet");
        
        Order.OrderTracking tracking3 = new Order.OrderTracking();
        tracking3.setStatus(Order.OrderStatus.PROCESSING);
        tracking3.setDescription("En cours de préparation");
        tracking3.setTimestamp(LocalDateTime.now().minusHours(6));
        tracking3.setLocation("Ferme El Baraka, Hammamet");
        
        order1.setTrackingHistory(Arrays.asList(tracking1, tracking2, tracking3));
        orderRepository.save(order1);
        
        // Order 2: Customer2 buys strawberries
        Order.OrderItem item3 = new Order.OrderItem();
        item3.setProductId(products.get(5).getId());
        item3.setProductName(products.get(5).getName());
        item3.setFarmerId(farmer.getId());
        item3.setFarmerName(farmer.getFarmerProfile().getFarmName());
        item3.setQuantity(1);
        item3.setPrice(products.get(5).getPrice());
        item3.setSubtotal(item3.getQuantity() * item3.getPrice());
        item3.setProductImage(products.get(5).getImages().get(0));
        
        Order order2 = new Order();
        order2.setOrderNumber("ORD-2026-002");
        order2.setCustomer(customer2);
        order2.setCustomerId(customer2.getId());
        order2.setFarmerId(farmer.getId());
        order2.setFarmerName(farmer.getFarmerProfile().getFarmName());
        order2.setItems(Arrays.asList(item3));
        order2.setTotalAmount(item3.getSubtotal());
        order2.setStatus(Order.OrderStatus.DELIVERED);
        order2.setPaymentStatus(Order.PaymentStatus.PAID);
        order2.setPaymentMethod(Order.PaymentMethod.CASH_ON_DELIVERY);
        order2.setDeliveryAddress(customer2.getAddress());
        order2.setEstimatedDeliveryDate(LocalDateTime.now().minusDays(1));
        order2.setActualDeliveryDate(LocalDateTime.now().minusHours(2));
        order2.setCreatedAt(LocalDateTime.now().minusDays(3));
        
        Order.OrderTracking tracking4 = new Order.OrderTracking();
        tracking4.setStatus(Order.OrderStatus.DELIVERED);
        tracking4.setDescription("Commande livrée avec succès");
        tracking4.setTimestamp(LocalDateTime.now().minusHours(2));
        tracking4.setLocation("Sousse, Tunisia");
        
        order2.setTrackingHistory(Arrays.asList(tracking4));
        orderRepository.save(order2);
        
        // Order 3: Customer1 buys olive oil and honey
        Order.OrderItem item4 = new Order.OrderItem();
        item4.setProductId(products.get(6).getId());
        item4.setProductName(products.get(6).getName());
        item4.setFarmerId(farmer.getId());
        item4.setFarmerName(farmer.getFarmerProfile().getFarmName());
        item4.setQuantity(2);
        item4.setPrice(products.get(6).getPrice());
        item4.setSubtotal(item4.getQuantity() * item4.getPrice());
        item4.setProductImage(products.get(6).getImages().get(0));
        
        Order.OrderItem item5 = new Order.OrderItem();
        item5.setProductId(products.get(9).getId());
        item5.setProductName(products.get(9).getName());
        item5.setFarmerId(farmer.getId());
        item5.setFarmerName(farmer.getFarmerProfile().getFarmName());
        item5.setQuantity(1);
        item5.setPrice(products.get(9).getPrice());
        item5.setSubtotal(item5.getQuantity() * item5.getPrice());
        item5.setProductImage(products.get(9).getImages().get(0));
        
        Order order3 = new Order();
        order3.setOrderNumber("ORD-2026-003");
        order3.setCustomer(customer1);
        order3.setCustomerId(customer1.getId());
        order3.setFarmerId(farmer.getId());
        order3.setFarmerName(farmer.getFarmerProfile().getFarmName());
        order3.setItems(Arrays.asList(item4, item5));
        order3.setTotalAmount(item4.getSubtotal() + item5.getSubtotal());
        order3.setStatus(Order.OrderStatus.CONFIRMED);
        order3.setPaymentStatus(Order.PaymentStatus.PAID);
        order3.setPaymentMethod(Order.PaymentMethod.CREDIT_CARD);
        order3.setDeliveryAddress(customer1.getAddress());
        order3.setEstimatedDeliveryDate(LocalDateTime.now().plusDays(3));
        order3.setCreatedAt(LocalDateTime.now().minusHours(6));
        
        Order.OrderTracking tracking5 = new Order.OrderTracking();
        tracking5.setStatus(Order.OrderStatus.CONFIRMED);
        tracking5.setDescription("Commande confirmée");
        tracking5.setTimestamp(LocalDateTime.now().minusHours(6));
        tracking5.setLocation("Ferme El Baraka, Hammamet");
        
        order3.setTrackingHistory(Arrays.asList(tracking5));
        orderRepository.save(order3);
    }
    
    private void createMessages(User customer, User farmer) {
        // Create conversation between customer and farmer
        Conversation conversation = new Conversation();
        conversation.setCustomerId(customer.getId());
        conversation.setCustomerName(customer.getFirstName() + " " + customer.getLastName());
        conversation.setFarmerId(farmer.getId());
        conversation.setFarmerName(farmer.getFarmerProfile().getFarmName());
        conversation.setCreatedAt(LocalDateTime.now().minusDays(2));
        
        // Message 1: Customer asks about tomatoes
        Conversation.Message msg1 = new Conversation.Message();
        msg1.setSenderId(customer.getId());
        msg1.setSenderName(customer.getFirstName() + " " + customer.getLastName());
        msg1.setContent("Bonjour, vos tomates sont-elles vraiment bio ?");
        msg1.setTimestamp(LocalDateTime.now().minusDays(2));
        msg1.setIsRead(true);
        
        // Message 2: Farmer responds
        Conversation.Message msg2 = new Conversation.Message();
        msg2.setSenderId(farmer.getId());
        msg2.setSenderName(farmer.getFarmerProfile().getFarmName());
        msg2.setContent("Oui absolument ! Nous sommes certifiés Bio Tunisie et Ecocert. Toutes nos cultures sont sans pesticides.");
        msg2.setTimestamp(LocalDateTime.now().minusDays(2).plusHours(2));
        msg2.setIsRead(true);
        
        // Message 3: Customer thanks
        Conversation.Message msg3 = new Conversation.Message();
        msg3.setSenderId(customer.getId());
        msg3.setSenderName(customer.getFirstName() + " " + customer.getLastName());
        msg3.setContent("Parfait ! Je vais commander 2kg alors. Merci !");
        msg3.setTimestamp(LocalDateTime.now().minusDays(2).plusHours(3));
        msg3.setIsRead(true);
        
        // Message 4: Farmer responds
        Conversation.Message msg4 = new Conversation.Message();
        msg4.setSenderId(farmer.getId());
        msg4.setSenderName(farmer.getFarmerProfile().getFarmName());
        msg4.setContent("Avec plaisir ! N'hésitez pas si vous avez d'autres questions.");
        msg4.setTimestamp(LocalDateTime.now().minusDays(1));
        msg4.setIsRead(false);
        
        conversation.setMessages(Arrays.asList(msg1, msg2, msg3, msg4));
        conversation.setLastMessageAt(msg4.getTimestamp());
        
        conversationRepository.save(conversation);
    }
    
    private void createJobOffers(User farmer) {
        // Job 1: Seasonal worker
        JobOffer job1 = new JobOffer();
        job1.setTitle("Ouvrier Agricole Saisonnier - Récolte d'Agrumes");
        job1.setDescription("Nous recherchons des ouvriers motivés pour la saison de récolte des agrumes (oranges, citrons, mandarines).\n\nResponsabilités:\n- Cueillette des fruits\n- Tri et conditionnement\n- Chargement des caisses\n\nNous offrons un environnement de travail convivial et des pauses régulières.");
        job1.setJobType(JobOffer.JobType.SEASONAL);
        job1.setContractType(JobOffer.ContractType.FULL_TIME);
        job1.setLocation("Hammamet, Nabeul");
        job1.setSalaryMin(2500.0);
        job1.setSalaryMax(3000.0);
        job1.setFarmerId(farmer.getId());
        job1.setFarmerName(farmer.getFirstName() + " " + farmer.getLastName());
        job1.setFarmName(farmer.getFarmerProfile().getFarmName());
        job1.setPositions(5);
        job1.setRequirements(Arrays.asList(
            "Bonne condition physique",
            "Capacité à travailler en équipe",
            "Disponibilité immédiate",
            "Expérience en agriculture appréciée mais non obligatoire"
        ));
        job1.setBenefits(Arrays.asList(
            "Logement sur place possible",
            "Transport assuré depuis Nabeul",
            "Repas de midi fourni",
            "Prime de rendement"
        ));
        job1.setStatus(JobOffer.JobStatus.OPEN);
        job1.setApplicationDeadline(LocalDateTime.now().plusDays(15));
        job1.setCreatedAt(LocalDateTime.now().minusDays(3));
        jobOfferRepository.save(job1);
        
        // Job 2: Permanent position
        JobOffer job2 = new JobOffer();
        job2.setTitle("Responsable des Cultures Maraîchères");
        job2.setDescription("Poste permanent pour gérer nos cultures de légumes bio. Vous serez responsable de la planification, du suivi et de la supervision des cultures.\n\nMissions principales:\n- Planification des cultures saisonnières\n- Gestion de l'irrigation et de la fertilisation bio\n- Supervision d'une équipe de 3-5 ouvriers\n- Contrôle qualité et traçabilité");
        job2.setJobType(JobOffer.JobType.PERMANENT);
        job2.setContractType(JobOffer.ContractType.FULL_TIME);
        job2.setLocation("Hammamet, Nabeul");
        job2.setSalaryMin(4000.0);
        job2.setSalaryMax(5500.0);
        job2.setFarmerId(farmer.getId());
        job2.setFarmerName(farmer.getFirstName() + " " + farmer.getLastName());
        job2.setFarmName(farmer.getFarmerProfile().getFarmName());
        job2.setPositions(1);
        job2.setRequirements(Arrays.asList(
            "Diplôme en agronomie ou équivalent",
            "Minimum 3 ans d'expérience en agriculture biologique",
            "Connaissance des techniques de permaculture",
            "Compétences en gestion d'équipe",
            "Permis de conduire obligatoire"
        ));
        job2.setBenefits(Arrays.asList(
            "CDI avec période d'essai de 3 mois",
            "Assurance santé complète",
            "Véhicule de service",
            "Formation continue",
            "Participation aux bénéfices"
        ));
        job2.setStatus(JobOffer.JobStatus.OPEN);
        job2.setApplicationDeadline(LocalDateTime.now().plusDays(30));
        job2.setCreatedAt(LocalDateTime.now().minusDays(7));
        jobOfferRepository.save(job2);
        
        // Job 3: Part-time position
        JobOffer job3 = new JobOffer();
        job3.setTitle("Aide Agricole - Temps Partiel Weekend");
        job3.setDescription("Recherche aide pour travaux agricoles les weekends uniquement.\n\nTâches variées:\n- Entretien des cultures\n- Arrosage\n- Désherbage\n- Aide à la récolte selon saison\n\nIdéal pour complément de revenu ou étudiant.");
        job3.setJobType(JobOffer.JobType.GENERAL_FARM_WORK);
        job3.setContractType(JobOffer.ContractType.PART_TIME);
        job3.setLocation("Hammamet, Nabeul");
        job3.setSalaryMin(1500.0);
        job3.setSalaryMax(2000.0);
        job3.setFarmerId(farmer.getId());
        job3.setFarmerName(farmer.getFirstName() + " " + farmer.getLastName());
        job3.setFarmName(farmer.getFarmerProfile().getFarmName());
        job3.setPositions(2);
        job3.setRequirements(Arrays.asList(
            "Motivation et sérieux",
            "Disponible samedis et dimanches",
            "Aucune expérience requise, formation assurée"
        ));
        job3.setBenefits(Arrays.asList(
            "Horaires flexibles",
            "Ambiance familiale",
            "Produits frais offerts"
        ));
        job3.setStatus(JobOffer.JobStatus.OPEN);
        job3.setApplicationDeadline(LocalDateTime.now().plusDays(20));
        job3.setCreatedAt(LocalDateTime.now().minusDays(1));
        jobOfferRepository.save(job3);
    }
    
    private void createDeliveryRoutes(User farmer) {
        // Route 1: Today's deliveries - In Progress
        DeliveryRoute route1 = new DeliveryRoute();
        route1.setDriverId("driver-001");
        route1.setDriverName("Ahmed Khaled");
        route1.setVehicleType("Camionnette Refrigérée");
        route1.setVehicleNumber("123-TU-4567");
        route1.setStatus(DeliveryRoute.RouteStatus.IN_PROGRESS);
        route1.setScheduledDate(LocalDateTime.now());
        route1.setStartedAt(LocalDateTime.now().minusHours(2));
        route1.setTotalDistance(45.0);
        route1.setTotalOrders(3);
        
        DeliveryRoute.DeliveryStop stop1 = new DeliveryRoute.DeliveryStop();
        stop1.setOrderId("ORD-2026-001");
        stop1.setCustomerName("Leila Mansour");
        stop1.setAddress("Avenue Habib Bourguiba, Tunis 1000");
        stop1.setLatitude(36.8065);
        stop1.setLongitude(10.1815);
        stop1.setSequenceNumber(1);
        stop1.setStatus(DeliveryRoute.DeliveryStop.StopStatus.DELIVERED);
        stop1.setEstimatedArrival(LocalDateTime.now().minusHours(1));
        stop1.setActualArrival(LocalDateTime.now().minusHours(1).plusMinutes(5));
        stop1.setNotes("Livraison effectuée - client satisfait");
        
        DeliveryRoute.DeliveryStop stop2 = new DeliveryRoute.DeliveryStop();
        stop2.setOrderId("ORD-2026-003");
        stop2.setCustomerName("Leila Mansour");
        stop2.setAddress("Avenue Habib Bourguiba, Tunis 1000");
        stop2.setLatitude(36.8065);
        stop2.setLongitude(10.1815);
        stop2.setSequenceNumber(2);
        stop2.setStatus(DeliveryRoute.DeliveryStop.StopStatus.EN_ROUTE);
        stop2.setEstimatedArrival(LocalDateTime.now().plusMinutes(30));
        
        route1.setStops(Arrays.asList(stop1, stop2));
        route1.setCreatedAt(LocalDateTime.now().minusHours(3));
        deliveryRouteRepository.save(route1);
        
        // Route 2: Tomorrow's deliveries - Planned
        DeliveryRoute route2 = new DeliveryRoute();
        route2.setDriverId("driver-002");
        route2.setDriverName("Salim Ben Amor");
        route2.setVehicleType("Camion 3.5T");
        route2.setVehicleNumber("456-TU-7890");
        route2.setStatus(DeliveryRoute.RouteStatus.PLANNED);
        route2.setScheduledDate(LocalDateTime.now().plusDays(1));
        route2.setTotalDistance(120.0);
        route2.setTotalOrders(5);
        
        DeliveryRoute.DeliveryStop stop3 = new DeliveryRoute.DeliveryStop();
        stop3.setOrderId("ORD-2026-004");
        stop3.setCustomerName("Karim Jebali");
        stop3.setAddress("Rue de la République, Sousse 4000");
        stop3.setLatitude(35.8256);
        stop3.setLongitude(10.6369);
        stop3.setSequenceNumber(1);
        stop3.setStatus(DeliveryRoute.DeliveryStop.StopStatus.PENDING);
        stop3.setEstimatedArrival(LocalDateTime.now().plusDays(1).withHour(9).withMinute(0));
        
        route2.setStops(Arrays.asList(stop3));
        route2.setCreatedAt(LocalDateTime.now().minusDays(1));
        deliveryRouteRepository.save(route2);
    }
    
    private void createPaymentMethods(User customer1, User customer2) {
        // Customer 1 - Credit Card (default)
        PaymentMethod card1 = new PaymentMethod();
        card1.setUserId(customer1.getId());
        card1.setType(PaymentMethod.PaymentType.CREDIT_CARD);
        card1.setCardBrand("visa");
        card1.setCardLast4("4242");
        card1.setCardExpMonth("12");
        card1.setCardExpYear("2027");
        card1.setIsDefault(true);
        card1.setIsActive(true);
        card1.setCreatedAt(LocalDateTime.now().minusMonths(2));
        paymentMethodRepository.save(card1);
        
        // Customer 1 - Bank Account
        PaymentMethod bank1 = new PaymentMethod();
        bank1.setUserId(customer1.getId());
        bank1.setType(PaymentMethod.PaymentType.BANK_ACCOUNT);
        bank1.setBankName("Banque de Tunisie");
        bank1.setAccountLast4("1234");
        bank1.setIsDefault(false);
        bank1.setIsActive(true);
        bank1.setCreatedAt(LocalDateTime.now().minusMonths(1));
        paymentMethodRepository.save(bank1);
        
        // Customer 2 - Debit Card (default)
        PaymentMethod card2 = new PaymentMethod();
        card2.setUserId(customer2.getId());
        card2.setType(PaymentMethod.PaymentType.DEBIT_CARD);
        card2.setCardBrand("mastercard");
        card2.setCardLast4("5555");
        card2.setCardExpMonth("08");
        card2.setCardExpYear("2026");
        card2.setIsDefault(true);
        card2.setIsActive(true);
        card2.setCreatedAt(LocalDateTime.now().minusMonths(3));
        paymentMethodRepository.save(card2);
    }
}
