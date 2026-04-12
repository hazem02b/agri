import re

with open('src/main/java/com/agricultural/marketplace/service/OrderService.java', 'r') as f:
    content = f.read()

# adding imports
content = content.replace('import org.springframework.stereotype.Service;', 'import org.springframework.stereotype.Service;\nimport com.agricultural.marketplace.client.ProductServiceClient;\nimport com.agricultural.marketplace.client.AuthServiceClient;\nimport com.agricultural.marketplace.dto.ProductDto;\nimport com.agricultural.marketplace.dto.UserDto;')

# Add client fields to OrderService
fields = """    @Autowired
    private OrderRepository orderRepository;
    
    @Autowired
    private ProductServiceClient productServiceClient;
    
    @Autowired
    private AuthServiceClient authServiceClient;"""
content = re.sub(r'    @Autowired\s+private OrderRepository orderRepository;', fields, content)

# Remove UserRepository
content = re.sub(r'    @Autowired\s+private UserRepository userRepository;\s*', '', content)

# Helper for converting UserDto to User
helper = """
    private User getUserFromAuthService(String email) {
        UserDto userDto = authServiceClient.getUserByEmail(email);
        if (userDto == null) {
            throw new RuntimeException("User not found");
        }
        User user = new User();
        user.setId(userDto.getId());
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getName());
        return user;
    }
"""
content = content.replace('public class OrderService {\n', 'public class OrderService {\n' + helper)

# Replace userRepository calls
content = re.sub(r'User customer = userRepository\.findByEmail\(customerEmail\)\s*\.orElseThrow\(\(\) -> new RuntimeException\("Customer not found"\)\);', 'User customer = getUserFromAuthService(customerEmail);', content)
content = re.sub(r'User farmer = userRepository\.findByEmail\(farmerEmail\)\s*\.orElseThrow\(\(\) -> new RuntimeException\("Farmer not found"\)\);', 'User farmer = getUserFromAuthService(farmerEmail);', content)

# Replace mock product logic
prod_logic_old = """            // Mock product verification for now since DB is decoupled
            // Product product = callProductServiceHttpApi(item.getProductId());
            boolean productExists = true; 
            
            if (!productExists) {
                throw new RuntimeException("Insufficient stock for product id: " + item.getProductId());
            }
            
            // Mock item price calculation for now
            double mockPrice = 10.0; // Assume all mock items cost 10
            item.setPrice(mockPrice);
            item.setSubtotal(mockPrice * item.getQuantity());
            totalAmount += item.getSubtotal();"""

prod_logic_new = """            ProductDto product = productServiceClient.getProductById(item.getProductId());
            if (product == null) {
                throw new RuntimeException("Product not found: " + item.getProductId());
            }
            
            item.setPrice(product.getPrice());
            item.setSubtotal(product.getPrice() * item.getQuantity());
            totalAmount += item.getSubtotal();"""
content = content.replace(prod_logic_old, prod_logic_new)

with open('src/main/java/com/agricultural/marketplace/service/OrderService.java', 'w') as f:
    f.write(content)

