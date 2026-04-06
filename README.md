# Finance Dashboard System — Backend

A backend REST API for a finance dashboard system that supports financial 
record management, user role-based access control, and summary-level analytics.

---

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (Mongoose)
- **Authentication**: JWT stored in HTTP-only cookies
- **Password Hashing**: bcryptjs
- **Validation**: validator.js + custom validation utils

---

## Project Structure
```
src/
├── config/
│   └── database.js
├── controllers/
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── transaction.controller.js
│   └── dashboard.controller.js
├── middlewares/
│   ├── auth.middleware.js
│   └── role.middleware.js
├── models/
│   ├── user.js
│   └── transaction.js
├── routes/
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── transaction.route.js
│   └── dashboard.route.js
├── utils/
│   └── validation.js
├── .env
└── app.js
```

---

## Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/yourusername/finance-dashboard-backend.git
cd finance-dashboard-backend
```

### 2. Install dependencies
```bash
npm install
```

### 3. Create `.env` file in root directory
```bash
PORT=3000
DB_URL=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<dbname>
JWT_SECRET=your_super_secret_key_here
```

### 4. Run the server
```bash
# development
npm run dev

# production
npm start
```

### 5. Server running at
```
http://localhost:3000
```

---

## Roles and Permissions

| Action | Viewer | Analyst | Admin |
|--------|--------|---------|-------|
| Signup / Login | ✅ | ✅ | ✅ |
| View own profile | ✅ | ✅ | ✅ |
| View transactions | ✅ | ✅ | ✅ |
| Create transaction | ❌ | ❌ | ✅ |
| Update transaction | ❌ | ❌ | ✅ |
| Delete transaction | ❌ | ❌ | ✅ |
| View dashboard summary | ❌ | ✅ | ✅ |
| View analytics | ❌ | ✅ | ✅ |
| Manage users | ❌ | ❌ | ✅ |

---

## API Endpoints

### Auth Routes — `/auth`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| POST | `/auth/signup` | Public | Register new user |
| POST | `/auth/login` | Public | Login and receive cookie |
| POST | `/auth/logout` | Logged in | Logout and clear cookie |

#### Signup
```
POST /auth/signup
Content-Type: application/json

{
  "name": "Sanjana Kumari",
  "email": "sanjana@gmail.com",
  "password": "Password@123"
}
```
Note: Password must be strong — uppercase, lowercase, number, symbol required.

Response:
```json
{
  "success": true,
  "message": "User signed up successfully.",
  "user": {
    "id": "664abc123",
    "name": "Sanjana Kumari",
    "email": "sanjana@gmail.com",
    "role": "viewer",
    "status": "active"
  }
}
```

#### Login
```
POST /auth/login
Content-Type: application/json

{
  "email": "sanjana@gmail.com",
  "password": "Password@123"
}
```

Response:
```json
{
  "success": true,
  "message": "Login successful.",
  "user": {
    "id": "664abc123",
    "name": "Sanjana Kumari",
    "email": "sanjana@gmail.com",
    "role": "viewer",
    "status": "active"
  }
}
```

---

### User Routes — `/users`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/users/me` | All logged in | Get own profile |
| GET | `/users` | Admin | Get all users (excludes self) |
| GET | `/users/:id` | Admin | Get single user |
| PATCH | `/users/:id/role` | Admin | Update user role |
| PATCH | `/users/:id/status` | Admin | Update user status |
| DELETE | `/users/:id` | Admin | Delete user |

#### Update Role
```
PATCH /users/:id/role
Content-Type: application/json

{
  "role": "analyst"
}
```

#### Update Status
```
PATCH /users/:id/status
Content-Type: application/json

{
  "status": "inactive"
}
```

---

### Transaction Routes — `/transactions`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/transactions` | All logged in | Get all transactions |
| GET | `/transactions/:id` | All logged in | Get single transaction |
| POST | `/transactions` | Admin | Create transaction |
| PATCH | `/transactions/:id` | Admin | Update transaction |
| DELETE | `/transactions/:id` | Admin | Delete transaction |

#### Create Transaction
```
POST /transactions
Content-Type: application/json

{
  "amount": 50000,
  "type": "income",
  "category": "salary",
  "date": "2026-04-01",
  "notes": "April salary"
}
```

#### Supported Categories
| Income | Expense |
|--------|---------|
| salary | rent |
| freelance | food |
| investment | transport |
| business | utilities |
| other_income | healthcare |
| | education |
| | entertainment |
| | other_expense |

#### Filtering and Pagination
```bash
# filter by type
GET /transactions?type=expense

# filter by category
GET /transactions?category=rent

# filter by date range
GET /transactions?startDate=2026-01-01&endDate=2026-03-31

# combine filters
GET /transactions?type=expense&category=food

# pagination (max 50 per page)
GET /transactions?page=1&limit=10
```

---

### Dashboard Routes — `/dashboard`
| Method | Endpoint | Access | Description |
|--------|----------|--------|-------------|
| GET | `/dashboard/summary` | Admin + Analyst | Income, expenses, balance |
| GET | `/dashboard/categoryWise` | Admin + Analyst | Totals by category |
| GET | `/dashboard/monthlyTrends` | Admin + Analyst | Income vs expense by month |
| GET | `/dashboard/recent` | Admin + Analyst | Last 5 transactions |

#### Summary Response
```json
{
  "success": true,
  "message": "Summary found.",
  "TotalIncome": 100000,
  "TotalExpense": 40000,
  "NetBalance": 60000
}
```

#### Monthly Trends Response
```json
{
  "success": true,
  "message": "Monthly Trends found.",
  "monthly": [
    { "_id": { "month": 1, "type": "income" }, "total": 50000 },
    { "_id": { "month": 1, "type": "expense" }, "total": 20000 }
  ]
}
```

---

## Error Responses

| Status Code | Meaning |
|-------------|---------|
| 400 | Bad request — missing or invalid input |
| 401 | Unauthorized — not logged in or invalid token |
| 403 | Forbidden — not allowed to perform this action |
| 404 | Not found — resource does not exist |
| 500 | Server error |

Example:
```json
{
  "success": false,
  "message": "Access denied. Your role (viewer) is not allowed to perform this action."
}
```

---

## Assumptions Made

1. Every new user gets **viewer** role by default. Only admin can change roles.
2. Only **admin** can create, update, or delete transactions.
3. **Analyst** can view transactions and access dashboard analytics.
4. **Viewer** can only view transactions.
5. Admin cannot change their own role, status, or delete their own account.
6. JWT is stored in an **HTTP-only cookie** — not accessible via JavaScript.
7. Password must be strong — validated using `validator.isStrongPassword()`.
8. Transaction categories are predefined and fixed in the schema.
9. Pagination is capped at **50 records per page** maximum.
10. `getMe` returns own profile. `getAllUsers` returns all users except the requesting admin.

---

## Security Measures

- Passwords hashed with **bcryptjs** before saving
- JWT stored in **HTTP-only cookie** — safe from XSS attacks
- `sameSite: strict` on cookie — safe from CSRF attacks
- Role based access control enforced on every protected route
- `createdBy` always taken from JWT token — cannot be faked
- Strong password enforcement via `validator.isStrongPassword()`

---

## Author

**Sanjana Kumari**
Backend Developer Intern Assignment
Zorvyn FinTech Pvt. Ltd.