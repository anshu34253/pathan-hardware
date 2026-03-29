# Backend Setup Guide - Pathan Hardware SaaS

## 🚀 Complete Backend Setup with MongoDB

### Prerequisites
- Node.js 18+ installed
- MongoDB installed and running
- Git installed

### 1. MongoDB Setup

#### Option A: Install MongoDB locally
```bash
# Windows: Download from https://www.mongodb.com/try/download/community
# macOS: brew install mongodb-community
# Linux: sudo apt-get install mongodb

# Start MongoDB service
# Windows: Start MongoDB service from Services
# macOS: brew services start mongodb-community
# Linux: sudo systemctl start mongod
```

#### Option B: Use MongoDB Atlas (Cloud)
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster
4. Get connection string
5. Update `.env` file with your connection string

### 2. Environment Setup

Create `.env` file in project root:
```bash
# Copy the example file
cp .env.example .env

# Edit .env with your values:
MONGODB_URI=mongodb://localhost:27017/pathan-hardware
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRE=7d
PORT=3001
NODE_ENV=development
FRONTEND_URL=http://localhost:5173
```

### 3. Install Dependencies
```bash
npm install
```

### 4. Start the Application

#### Development Mode:
```bash
# Start both frontend and backend
npm start

# Or start individually:
npm run server  # Backend only (port 3001)
npm run dev     # Frontend only (port 5173)
```

#### Production Mode:
```bash
# Build frontend
npm run build

# Start production server
npm run server
```

### 5. Database Initialization

The database will be automatically created when you first start the server. Here's what gets created:

#### Collections:
- **users** - Authentication and user management
- **products** - Product inventory
- **customers** - Customer information
- **bills** - Billing and invoices

#### Default Admin User:
Create first admin user via API:
```bash
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123",
    "role": "admin"
  }'
```

### 6. API Endpoints

#### Authentication:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - Register new user
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - Logout

#### Products:
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `GET /api/products/:id` - Get single product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `GET /api/products/categories/all` - Get categories
- `GET /api/products/stats/summary` - Get product stats

#### Customers:
- `GET /api/customers` - Get all customers
- `POST /api/customers` - Create customer
- `GET /api/customers/:id` - Get single customer
- `PUT /api/customers/:id` - Update customer
- `DELETE /api/customers/:id` - Delete customer
- `GET /api/customers/cities/all` - Get cities
- `GET /api/customers/stats/summary` - Get customer stats

#### Bills:
- `GET /api/bills` - Get all bills
- `POST /api/bills` - Create bill
- `GET /api/bills/:id` - Get single bill
- `PUT /api/bills/:id` - Update bill
- `DELETE /api/bills/:id` - Delete bill
- `GET /api/bills/stats/summary` - Get bill stats

### 7. Testing the API

#### Health Check:
```bash
curl http://localhost:3001/api/health
```

#### API Info:
```bash
curl http://localhost:3001/api
```

#### Login Test:
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "username": "admin",
    "password": "admin123"
  }'
```

### 8. Features Included

✅ **Authentication & Authorization**
- JWT-based authentication
- Role-based access control (admin/customer)
- Protected routes

✅ **Product Management**
- CRUD operations
- Stock tracking
- Low stock alerts
- Category filtering
- Search functionality

✅ **Customer Management**
- CRUD operations
- Credit management
- Purchase history
- Address management

✅ **Billing System**
- Generate invoices
- Payment tracking
- Credit/Udhar system
- Stock management integration

✅ **Data Validation**
- Input validation
- Error handling
- Data integrity

✅ **API Features**
- Pagination
- Filtering
- Sorting
- Search
- Statistics

### 9. Troubleshooting

#### MongoDB Connection Issues:
```bash
# Check if MongoDB is running
mongosh --eval "db.adminCommand('ismaster')"

# For MongoDB Atlas, check your connection string
# Make sure IP address is whitelisted
```

#### Port Already in Use:
```bash
# Kill process on port 3001
npx kill-port 3001

# Or use different port
PORT=3002 npm run server
```

#### Authentication Issues:
```bash
# Clear local storage
localStorage.clear()

# Check JWT secret in .env
# Make sure it's the same as server
```

### 10. Production Deployment

#### Environment Variables:
```bash
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/pathan-hardware
JWT_SECRET=your-production-secret-key
FRONTEND_URL=https://yourdomain.com
```

#### Build and Deploy:
```bash
# Build frontend
npm run build

# Start production server
npm run server
```

### 11. Security Considerations

- Change JWT_SECRET in production
- Use HTTPS in production
- Implement rate limiting
- Add input sanitization
- Use environment variables for secrets
- Regular security updates

### 12. Monitoring & Logs

The server logs:
- Database connections
- API requests
- Errors
- Authentication events

Check console output for real-time logs.

---

🎉 **Your Pathan Hardware SaaS backend is now fully functional!**

The backend provides a complete API for managing products, customers, and billing with MongoDB persistence, authentication, and comprehensive error handling.
