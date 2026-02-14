# design.md

## System Design Document
Farm2Market B2B Marketplace

---

## 1. System Architecture

The platform follows a client-server architecture.

Users interact with a web frontend which communicates with a Node.js backend API. The backend handles business logic and interacts with the database.

Architecture Flow:

Client (Browser)
   ↓
Frontend (HTML/CSS/JS)
   ↓ API Calls
Node.js + Express Backend
   ↓
Database

---

## 2. High-Level Components

### Frontend
- Login & Registration pages
- Farmer Dashboard
- Buyer Dashboard
- Crop Listing Page
- Order Management UI
- Profile & Verification Pages

### Backend Services
- Authentication Service
- User Management Service
- Crop Listing Service
- Order Service
- Document Verification Service

### Database Collections / Tables
- Users
- Farmer Profiles
- Buyer Profiles
- Crops
- Orders
- Documents

---

## 3. User Flow Design

### Farmer Flow
1. Register account
2. Upload verification documents
3. Admin/auto verification
4. Login to dashboard
5. Add crop listings
6. Receive buyer orders
7. Accept order
8. Dispatch crops

### Buyer Flow
1. Register business account
2. Upload business verification documents
3. Login
4. Browse crops
5. Place order
6. Receive confirmation
7. Receive delivery

---

## 4. Database Design (Conceptual)

### Users Collection
- userId
- role (farmer/buyer)
- name
- email
- passwordHash
- phone
- verificationStatus

### Crops Collection
- cropId
- farmerId
- cropName
- quantity
- pricePerUnit
- location
- availabilityDate

### Orders Collection
- orderId
- buyerId
- farmerId
- cropId
- quantity
- price
- orderStatus
- deliveryStatus

---

## 5. API Design (Sample Endpoints)

### Auth APIs
- POST /register
- POST /login

### Farmer APIs
- POST /crops
- GET /farmer/crops
- PUT /crops/:id

### Buyer APIs
- GET /crops
- POST /orders

### Order APIs
- GET /orders
- PUT /orders/:id/status

---

## 6. Security Design

- Password hashing
- JWT authentication
- Role-based authorization
- Document validation
- HTTPS usage

---

## 7. Scalability Considerations

- Microservices migration in future
- Caching popular listings
- CDN for media assets
- Load balancing backend servers

---

## 8. UI/UX Design Considerations

- Simple interface for farmers
- Mobile-friendly design
- Quick crop listing
- Minimal steps for placing orders

---

## 9. Future Design Enhancements

- Real-time price comparison
- Logistics integration
- AI crop demand forecasting
- Multi-language support

---

End of design document.

## 10. Recent Architectural Updates

### 10.1 Internationalization Architecture
- **JSON-based Translation System**: All language strings are stored in js/translations.js organized by language code (en, hi, gu, mr, ta, te, kn, ml) and section (nav, home, trade, etc.).
- **Global State Management**: Language preference is stored in localStorage and accessed via window.changeLanguage(langCode).
- **DOM Updates**: The changeLanguage function traverses the DOM, updating elements with data-i18n attributes to match the selected language keys.

### 10.2 Navigation & Launch Flow
- **Root Redirect**: A lightweight index.html at the project root maps to Vertsion/index.html using meta-refresh and JS redirection, ensuring seamless entry from any server root.
- **Unified Navigation**: The 
av-language-selector class in css/styles.css ensures consistent dropdown styling across all pages.
