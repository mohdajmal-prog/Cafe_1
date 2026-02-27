# Supabase Backend Setup

## Prerequisites
1. Create a Supabase account at https://supabase.com
2. Create a new project

## Setup Steps

### 1. Database Setup
1. Go to your Supabase project dashboard
2. Navigate to SQL Editor
3. Run the SQL script from `config/schema.sql`

### 2. Environment Variables
1. Copy `.env.example` to `.env`
2. Get your Supabase URL and Service Key:
   - Go to Project Settings > API
   - Copy the Project URL to `SUPABASE_URL`
   - Copy the `service_role` key to `SUPABASE_SERVICE_KEY`
3. Set a strong `JWT_SECRET`
4. Configure email settings for OTP

### 3. Install Dependencies
```bash
npm install
```

### 4. Run the Server
```bash
npm start
```

## API Endpoints

### Authentication
- POST `/auth/send-otp` - Send OTP to email
- POST `/auth/verify-otp` - Verify OTP and login/register

### Menu
- GET `/menu` - Get all menu items
- GET `/menu/:id` - Get menu item by ID

### Orders (Authenticated)
- POST `/orders` - Create new order
- GET `/orders` - Get user orders
- GET `/orders/:id` - Get order by ID

### User (Authenticated)
- GET `/user/profile` - Get user profile
- PATCH `/user/profile` - Update user profile

### Admin (Authenticated + Admin)
- GET `/admin/orders` - Get all orders
- PATCH `/admin/orders/:id` - Update order status
- POST `/admin/menu` - Add menu item
- PATCH `/admin/menu/:id` - Update menu item
- DELETE `/admin/menu/:id` - Delete menu item

## Notes
- All authenticated routes require `Authorization: Bearer <token>` header
- Admin routes require user to have `is_admin: true` in database
