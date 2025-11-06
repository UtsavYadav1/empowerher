# API Route Examples

## Base URL
All API routes are available at: `http://localhost:3000/api/mock`

---

## Products API (`/api/mock/products`)

### GET - List Products
**Request:**
```bash
GET /api/mock/products
GET /api/mock/products?category=pickles
GET /api/mock/products?village=Rampur
GET /api/mock/products?category=diyas&village=Devgaon
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Spicy Mango Pickle",
      "description": "Traditional homemade mango pickle with authentic spices",
      "category": "pickles",
      "images": ["/images/pickle1.jpg", "/images/pickle1_2.jpg"],
      "price": 150.0,
      "stock": 50,
      "sellerId": 4,
      "village": "Rampur",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 30
}
```

### POST - Create Product
**Request:**
```bash
POST /api/mock/products
Content-Type: application/json
```
```json
{
  "title": "Homemade Achar",
  "description": "Traditional pickle",
  "category": "pickles",
  "images": ["/images/achar1.jpg"],
  "price": 120.0,
  "stock": 40,
  "sellerId": 5,
  "village": "Devgaon"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 31,
    "title": "Homemade Achar",
    "description": "Traditional pickle",
    "category": "pickles",
    "images": ["/images/achar1.jpg"],
    "price": 120.0,
    "stock": 40,
    "sellerId": 5,
    "village": "Devgaon",
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### PATCH - Update Product
**Request:**
```bash
PATCH /api/mock/products
Content-Type: application/json
```
```json
{
  "id": 1,
  "price": 160.0,
  "stock": 45
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Spicy Mango Pickle",
    "description": "Traditional homemade mango pickle with authentic spices",
    "category": "pickles",
    "images": ["/images/pickle1.jpg", "/images/pickle1_2.jpg"],
    "price": 160.0,
    "stock": 45,
    "sellerId": 4,
    "village": "Rampur",
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Schemes API (`/api/mock/schemes`)

### GET - List Schemes
**Request:**
```bash
GET /api/mock/schemes
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Beti Bachao Beti Padhao Scholarship",
      "description": "Financial support for girls' education from class 1 to 12",
      "eligibility": "Girls aged 6-18 years, family income below 2 lakhs per annum",
      "applyUrl": "https://wcd.nic.in/schemes/beti-bachao-beti-padhao",
      "deadline": "2024-06-30T00:00:00.000Z"
    }
  ],
  "count": 15
}
```

### POST - Create Scheme
**Request:**
```bash
POST /api/mock/schemes
Content-Type: application/json
```
```json
{
  "title": "Girl Education Scholarship 2024",
  "description": "Scholarship for meritorious girls",
  "eligibility": "Girls with 80%+ marks, family income below 5 lakhs",
  "applyUrl": "https://example.com/apply",
  "deadline": "2024-12-31T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 16,
    "title": "Girl Education Scholarship 2024",
    "description": "Scholarship for meritorious girls",
    "eligibility": "Girls with 80%+ marks, family income below 5 lakhs",
    "applyUrl": "https://example.com/apply",
    "deadline": "2024-12-31T00:00:00.000Z"
  }
}
```

### PATCH - Update Scheme
**Request:**
```bash
PATCH /api/mock/schemes
Content-Type: application/json
```
```json
{
  "id": 1,
  "deadline": "2024-07-31T00:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Beti Bachao Beti Padhao Scholarship",
    "description": "Financial support for girls' education from class 1 to 12",
    "eligibility": "Girls aged 6-18 years, family income below 2 lakhs per annum",
    "applyUrl": "https://wcd.nic.in/schemes/beti-bachao-beti-padhao",
    "deadline": "2024-07-31T00:00:00.000Z"
  }
}
```

---

## Workshops API (`/api/mock/workshops`)

### GET - List Workshops
**Request:**
```bash
GET /api/mock/workshops
GET /api/mock/workshops?village=Rampur
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "title": "Digital Literacy for Girls",
      "village": "Rampur",
      "date": "2024-04-15T10:00:00.000Z",
      "description": "Learn basic computer skills, internet usage, and digital safety"
    }
  ],
  "count": 10
}
```

### POST - Create Workshop
**Request:**
```bash
POST /api/mock/workshops
Content-Type: application/json
```
```json
{
  "title": "Cooking Skills Workshop",
  "village": "Shivpur",
  "date": "2024-06-15T10:00:00.000Z",
  "description": "Learn traditional cooking techniques"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "title": "Cooking Skills Workshop",
    "village": "Shivpur",
    "date": "2024-06-15T10:00:00.000Z",
    "description": "Learn traditional cooking techniques"
  }
}
```

### PATCH - Update Workshop
**Request:**
```bash
PATCH /api/mock/workshops
Content-Type: application/json
```
```json
{
  "id": 1,
  "date": "2024-04-20T10:00:00.000Z"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "title": "Digital Literacy for Girls",
    "village": "Rampur",
    "date": "2024-04-20T10:00:00.000Z",
    "description": "Learn basic computer skills, internet usage, and digital safety"
  }
}
```

---

## Users API (`/api/mock/users`)

### GET - List Users
**Request:**
```bash
GET /api/mock/users
GET /api/mock/users?role=woman
GET /api/mock/users?village=Rampur
GET /api/mock/users?verified=true
GET /api/mock/users?role=girl&village=Devgaon
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "Priya Sharma",
      "phone": "+91 9876543210",
      "role": "girl",
      "village": "Rampur",
      "verified": true,
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  ],
  "count": 10
}
```

### POST - Create User
**Request:**
```bash
POST /api/mock/users
Content-Type: application/json
```
```json
{
  "name": "Kiran Devi",
  "phone": "+91 9876543298",
  "password": "hashed_password_132",
  "role": "woman",
  "village": "Rampur",
  "verified": false
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 11,
    "name": "Kiran Devi",
    "phone": "+91 9876543298",
    "role": "woman",
    "village": "Rampur",
    "verified": false,
    "createdAt": "2024-01-15T10:30:00.000Z"
  }
}
```

### PATCH - Update User
**Request:**
```bash
PATCH /api/mock/users
Content-Type: application/json
```
```json
{
  "id": 1,
  "verified": true,
  "village": "New Village"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Priya Sharma",
    "phone": "+91 9876543210",
    "role": "girl",
    "village": "New Village",
    "verified": true,
    "createdAt": "2024-01-01T00:00:00.000Z"
  }
}
```

---

## Seed Data Examples

### Sample User Entry
```json
{
  "name": "Priya Sharma",
  "phone": "+91 9876543210",
  "password": "hashed_password_123",
  "role": "girl",
  "village": "Rampur",
  "verified": true
}
```

### Sample Product Entry
```json
{
  "title": "Spicy Mango Pickle",
  "description": "Traditional homemade mango pickle with authentic spices",
  "category": "pickles",
  "images": ["/images/pickle1.jpg", "/images/pickle1_2.jpg"],
  "price": 150.0,
  "stock": 50,
  "sellerId": 4,
  "village": "Rampur"
}
```

### Sample Scheme Entry
```json
{
  "title": "Beti Bachao Beti Padhao Scholarship",
  "description": "Financial support for girls' education from class 1 to 12",
  "eligibility": "Girls aged 6-18 years, family income below 2 lakhs per annum",
  "applyUrl": "https://wcd.nic.in/schemes/beti-bachao-beti-padhao",
  "deadline": "2024-06-30T00:00:00Z"
}
```

### Sample Workshop Entry
```json
{
  "title": "Digital Literacy for Girls",
  "village": "Rampur",
  "date": "2024-04-15T10:00:00Z",
  "description": "Learn basic computer skills, internet usage, and digital safety"
}
```

### Sample Order Entry
```json
{
  "customerId": 1,
  "items": [{"productId": 1, "quantity": 2, "price": 150.0}, {"productId": 7, "quantity": 1, "price": 200.0}],
  "total": 500.0,
  "status": "delivered"
}
```

