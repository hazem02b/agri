import re
with open('src/main/java/com/agricultural/marketplace/controller/MessageController.java', 'r') as f:
    content = f.read()

# adding imports
content = content.replace('import org.springframework.web.bind.annotation.*;', 'import org.springframework.web.bind.annotation.*;\nimport com.agricultural.marketplace.client.AuthServiceClient;\nimport com.agricultural.marketplace.dto.UserDto;')

fields = """
    @Autowired
    private MessageService messageService;
    
    @Autowired
    private AuthServiceClient authServiceClient;"""
content = re.sub(r'    @Autowired\s+private MessageService messageService;', fields, content)

mock_method_old = """    // User data should be fetched from auth-service via API call
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
    }"""

mock_method_new = """    private User getCurrentUserMock(String email) {
        UserDto userDto = authServiceClient.getUserByEmail(email);
        if (userDto == null) {
            throw new RuntimeException("User not found");
        }
        User user = new User();
        user.setId(userDto.getId());
        user.setEmail(userDto.getEmail());
        user.setFirstName(userDto.getName());
        return user;
    }"""

content = content.replace(mock_method_old, mock_method_new)

with open('src/main/java/com/agricultural/marketplace/controller/MessageController.java', 'w') as f:
    f.write(content)

