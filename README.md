# FileSure Backend API

RESTful API service for the FileSure Referral & Credit System built with Node.js, Express, TypeScript, and MongoDB.

## 📖 Overview

This backend service provides authentication, referral tracking, credit management, and purchase simulation for the FileSure platform. It implements a complete referral system where users earn credits when their referrals make purchases.

## ✨ Features

- 🔐 **JWT Authentication** - Secure user registration and login
- 👥 **Referral System** - Track referrer-referred relationships
- 💰 **Credit Management** - Award credits on first purchase only
- 🛡️ **Data Integrity** - MongoDB transactions prevent double-crediting
- 📊 **Dashboard APIs** - Real-time statistics and referral tracking
- 🔒 **Security** - Password hashing, rate limiting, helmet protection
- ✅ **Validation** - Zod schema validation on all endpoints
- 🚀 **Performance** - Indexed queries and efficient data retrieval

## 🏗️ Architecture

file-sure-server/
├── src/
│ ├── config/ # Configuration files
│ │ ├── database.ts # MongoDB connection
│ │ └── env.ts # Environment variables
│ ├── models/ # Mongoose schemas
│ │ ├── User.ts
│ │ ├── Referral.ts
│ │ └── Purchase.ts
│ ├── routes/ # Express routes
│ │ ├── auth.routes.ts
│ │ ├── purchase.routes.ts
│ │ └── dashboard.routes.ts
│ ├── controllers/ # Request handlers
│ │ ├── auth.controller.ts
│ │ ├── purchase.controller.ts
│ │ └── dashboard.controller.ts
│ ├── services/ # Business logic
│ │ ├── auth.service.ts
│ │ ├── purchase.service.ts
│ │ ├── referral.service.ts
│ │ └── credit.service.ts
│ ├── middlewares/ # Custom middleware
│ │ ├── auth.middleware.ts
│ │ ├── validation.middleware.ts
│ │ └── error.middleware.ts
│ ├── validators/ # Zod schemas
│ │ ├── auth.validator.ts
│ │ └── purchase.validator.ts
│ ├── utils/ # Utility functions
│ │ ├── jwt.util.ts
│ │ ├── password.util.ts
│ │ └── referralCode.util.ts
│ ├── types/ # TypeScript types
│ │ └── index.ts
│ └── server.ts # Application entry point

## 🚀 Tech Stack

- **Runtime:** Node.js (v18+)
- **Framework:** Express.js
- **Language:** TypeScript
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JWT (jsonwebtoken)
- **Validation:** Zod
- **Security:** bcryptjs, helmet, express-rate-limit
- **Environment:** dotenv

## 📦 Installation

### Prerequisites

- Node.js v18 or higher
- MongoDB (local or Atlas)
- npm or yarn

### Setup Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/filesure-backend.git
   cd filesure-backend
   Install dependencies
   ```

npm install
Environment Configuration

cp .env.example .env
Update .env with your configuration:

### env

NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/filesure
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRES_IN=7d
FRONTEND_URL=http://localhost:3000
APP_URL=http://localhost:5000
REFERRAL_CREDIT_AMOUNT=2
Run Development Server

npm run dev
Build for Production

npm run build
npm start

### 🔧 Environment Variables

Variable Description Example
NODE_ENV Environment mode development / production
PORT Server port 5000
MONGODB_URI MongoDB connection string mongodb://localhost:27017/filesure
JWT_SECRET Secret key for JWT signing your_secret_key
JWT_EXPIRES_IN JWT token expiration 7d
FRONTEND_URL Frontend application URL http://localhost:3000
APP_URL Backend API URL http://localhost:5000
REFERRAL_CREDIT_AMOUNT Credits per referral 2

### 🗄️ Database Schema

User Model
TypeScript

{
name: String (required, 2-50 chars)
email: String (required, unique, lowercase)
password: String (required, hashed, min 6 chars)
referralCode: String (unique, uppercase)
credits: Number (default: 0)
referredBy: ObjectId (ref: User)
hasPurchased: Boolean (default: false)
createdAt: Date
updatedAt: Date
}
Referral Model
TypeScript

{
referrer: ObjectId (ref: User)
referred: ObjectId (ref: User, unique)
status: String (enum: ['pending', 'converted'])
creditAwarded: Boolean (default: false)
createdAt: Date
updatedAt: Date
}
Purchase Model
TypeScript

{
user: ObjectId (ref: User)
productId: String
productName: String
amount: Number
isFirstPurchase: Boolean
createdAt: Date
}
📡 API Endpoints
Authentication
Register User
http

POST /api/auth/register
Content-Type: application/json

{
"name": "John Doe",
"email": "john@example.com",
"password": "password123",
"referralCode": "LINA8X7Y9Z" // Optional
}

Response: 201 Created
{
"success": true,
"message": "User registered successfully",
"data": {
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "60d5ec49f1b2c72b8c8e4f1a",
"name": "John Doe",
"email": "john@example.com",
"referralCode": "JOHN5A6B7C",
"credits": 0
}
}
}
Login User
http

POST /api/auth/login
Content-Type: application/json

{
"email": "john@example.com",
"password": "password123"
}

Response: 200 OK
{
"success": true,
"message": "Login successful",
"data": {
"token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"user": {
"id": "60d5ec49f1b2c72b8c8e4f1a",
"name": "John Doe",
"email": "john@example.com",
"referralCode": "JOHN5A6B7C",
"credits": 2
}
}
}
Get User Profile
http

GET /api/auth/profile
Authorization: Bearer {token}

Response: 200 OK
{
"success": true,
"data": {
"id": "60d5ec49f1b2c72b8c8e4f1a",
"name": "John Doe",
"email": "john@example.com",
"referralCode": "JOHN5A6B7C",
"credits": 2,
"hasPurchased": true
}
}
Logout
http

POST /api/auth/logout
Authorization: Bearer {token}

Response: 200 OK
{
"success": true,
"message": "Logout successful"
}
Dashboard
Get Dashboard Statistics
http

GET /api/dashboard/stats
Authorization: Bearer {token}

Response: 200 OK
{
"success": true,
"data": {
"totalReferredUsers": 10,
"convertedUsers": 4,
"totalCreditsEarned": 8,
"currentCredits": 10,
"referralLink": "http://localhost:3000/register?r=JOHN5A6B7C"
}
}
Get Referrals List
http

GET /api/dashboard/referrals
Authorization: Bearer {token}

Response: 200 OK
{
"success": true,
"data": [
{
"id": "60d5ec49f1b2c72b8c8e4f1b",
"userName": "Jane Smith",
"userEmail": "jane@example.com",
"status": "converted",
"hasPurchased": true,
"joinedAt": "2024-01-15T10:30:00.000Z"
}
]
}
Purchases
Create Purchase
http

POST /api/purchases
Authorization: Bearer {token}
Content-Type: application/json

{
"productId": "PROD001",
"productName": "Premium E-Book",
"amount": 29.99
}

Response: 201 Created
{
"success": true,
"message": "Purchase completed successfully",
"data": {
"id": "60d5ec49f1b2c72b8c8e4f1c",
"productName": "Premium E-Book",
"amount": 29.99,
"isFirstPurchase": true,
"creditsAwarded": true,
"createdAt": "2024-01-15T10:35:00.000Z"
}
}
Get User Purchases
http

GET /api/purchases
Authorization: Bearer {token}

Response: 200 OK
{
"success": true,
"data": [
{
"id": "60d5ec49f1b2c72b8c8e4f1c",
"productName": "Premium E-Book",
"amount": 29.99,
"isFirstPurchase": true,
"createdAt": "2024-01-15T10:35:00.000Z"
}
]
}
Health Check
Server Health
http

GET /health

Response: 200 OK
{
"success": true,
"message": "Server is running",
"timestamp": "2024-01-15T10:30:00.000Z"
}

### 🔐 Security Features

Password Hashing: bcryptjs with salt rounds of 10
JWT Authentication: Secure token-based authentication
Rate Limiting: 100 requests per 15 minutes (1000 in dev)
Helmet: Security headers protection
CORS: Configured for frontend origin only
Input Validation: Zod schema validation on all inputs
MongoDB Injection Prevention: Mongoose sanitization

### 💼 Business Logic

Referral Flow
User A registers → Receives unique referral code USERA123
User B registers with code USERA123 → Referral record created with status pending
User B makes first purchase →
User A gets 2 credits
User B gets 2 credits
Referral status updated to converted
Flags set to prevent double-crediting
User B makes second purchase → No additional credits awarded
Data Integrity
MongoDB Transactions: All credit operations use transactions
Unique Constraints: Prevent duplicate referrals
Boolean Flags: creditAwarded and hasPurchased prevent double-crediting
Atomic Operations: $inc operator for credit updates

### 🚀 Deployment

Railway
Push code to GitHub
Connect repository in Railway
Add environment variables
Deploy automatically

{
"dev": "tsx watch src/server.ts",
"build": "tsc",
"start": "node dist/server.js",
"lint": "eslint . --ext .ts",
"format": "prettier --write \"src/\*_/_.ts\""
}

### 🐛 Error Handling

All errors return consistent format:

JSON

{
"success": false,
"message": "Error description",
"errors": [
{
"field": "email",
"message": "Invalid email address"
}
]
}

### HTTP Status Codes:

200 - Success
201 - Created
400 - Bad Request (validation error)
401 - Unauthorized
404 - Not Found
429 - Too Many Requests
500 - Internal Server Error

### 👥 Author

Md. Mezanur Rahman

### 🤝 Contributing

Contributions, issues, and feature requests are welcome!
