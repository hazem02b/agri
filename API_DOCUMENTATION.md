# API Documentation - Agricultural Marketplace Platform

## Base URL
```
http://localhost:8080/api
```

## Authentication

Tous les endpoints protégés nécessitent un header `Authorization`:
```
Authorization: Bearer <JWT_TOKEN>
```

---

## 🔐 Authentication Endpoints

### POST /auth/login
Authentifier un utilisateur.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzUxMiJ9...",
  "type": "Bearer",
  "id": "507f1f77bcf86cd799439011",
  "email": "user@example.com",
  "firstName": "John",
  "lastName": "Doe",
  "role": "CUSTOMER"
}
```

### POST /auth/signup
Créer un nouveau compte.

**Request:**
```json
{
  "email": "farmer@example.com",
  "password": "password123",
  "firstName": "Jean",
  "lastName": "Dupont",
  "phone": "0612345678",
  "role": "FARMER",
  "farmName": "Ferme Bio",
  "farmDescription": "Production bio de légumes"
}
```

**Response:** Même format que `/auth/login`

---

## 🛒 Product Endpoints

### GET /products/public/all
Récupérer tous les produits disponibles.

**Response:**
```json
[
  {
    "id": "507f1f77bcf86cd799439011",
    "name": "Tomates Bio",
    "description": "Tomates fraîches du jardin",
    "category": "VEGETABLES",
    "price": 3.5,
    "unit": "kg",
    "stock": 100,
    "images": ["https://example.com/tomato.jpg"],
    "farmerId": "507f1f77bcf86cd799439022",
    "isOrganic": true,
    "isAvailable": true,
    "rating": 4.5,
    "totalReviews": 23,
    "location": "Paris",
    "createdAt": "2024-01-15T10:00:00Z"
  }
]
```

### GET /products/public/{id}
Récupérer un produit par son ID.

### GET /products/public/category/{category}
Filtrer par catégorie.

**Categories:** `VEGETABLES`, `FRUITS`, `GRAINS`, `DAIRY`, `MEAT`, `POULTRY`, `EGGS`, `HONEY`, `HERBS`, `FLOWERS`, `SEEDS`, `OTHER`

### GET /products/public/search?keyword=tomate
Rechercher des produits.

### POST /products
Créer un nouveau produit (FARMER only).

**Request:**
```json
{
  "name": "Carottes Bio",
  "description": "Carottes fraîches et croquantes",
  "category": "VEGETABLES",
  "price": 2.5,
  "unit": "kg",
  "stock": 50,
  "images": ["https://example.com/carrot.jpg"],
  "isOrganic": true,
  "location": "Lyon",
  "harvestDate": "2024-03-01T00:00:00Z"
}
```

### PUT /products/{id}
Modifier un produit (FARMER only, own products).

### DELETE /products/{id}
Supprimer un produit (FARMER only, own products).

### POST /products/{id}/review?rating=5&comment=Excellent
Ajouter un avis sur un produit.

---

## 📦 Order Endpoints

### POST /orders
Créer une nouvelle commande.

**Request:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "productName": "Tomates Bio",
      "farmerId": "507f1f77bcf86cd799439022",
      "farmerName": "Jean Dupont",
      "quantity": 5,
      "price": 3.5,
      "subtotal": 17.5
    }
  ],
  "deliveryAddress": {
    "street": "123 Rue de la Paix",
    "city": "Paris",
    "state": "Île-de-France",
    "zipCode": "75001",
    "country": "France"
  },
  "deliveryNotes": "Sonner à la porte"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Order created successfully",
  "data": {
    "id": "507f1f77bcf86cd799439033",
    "orderNumber": "ORD-A1B2C3D4",
    "status": "PENDING",
    "totalAmount": 17.5,
    "estimatedDeliveryDate": "2024-03-18T00:00:00Z"
  }
}
```

### GET /orders
Récupérer mes commandes.

### GET /orders/{id}
Détails d'une commande.

### PUT /orders/{id}/status?status=SHIPPED&description=Package shipped
Mettre à jour le statut (FARMER only).

**Status:** `PENDING`, `CONFIRMED`, `PROCESSING`, `SHIPPED`, `DELIVERED`, `CANCELLED`

### DELETE /orders/{id}
Annuler une commande (only if not shipped).

---

## 👨‍🌾 Farmer Endpoints

### GET /farmers/public/all
Liste de tous les agriculteurs.

### GET /farmers/public/{id}
Profil d'un agriculteur.

### GET /farmers/profile
Mon profil (FARMER only).

### PUT /farmers/profile
Modifier mon profil (FARMER only).

---

## 📊 Response Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Created |
| 400 | Bad Request |
| 401 | Unauthorized |
| 403 | Forbidden |
| 404 | Not Found |
| 500 | Internal Server Error |

## 🔒 Security

- Tous les mots de passe sont hashés avec **BCrypt**
- JWT tokens expirent après **24 heures**
- CORS configuré pour `http://localhost:4200`
- Validation des entrées avec **Bean Validation**

## 🧪 Testing with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

### Get all products
```bash
curl http://localhost:8080/api/products/public/all
```

### Create product (with auth)
```bash
curl -X POST http://localhost:8080/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Product Name",
    "description": "Description",
    "category": "VEGETABLES",
    "price": 5.0,
    "unit": "kg",
    "stock": 50,
    "isOrganic": true,
    "location": "Paris"
  }'
```
