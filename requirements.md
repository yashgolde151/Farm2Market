# requirements.md

## Project Title
Farm2Market B2B Marketplace

## Overview
Farm2Market is a B2B marketplace website connecting farmers directly with bulk buyers (MNCs, retailers, wholesalers, processors) to eliminate middlemen, improve farmer income, and provide buyers with lower-cost, high-quality produce.

The platform allows two types of users:
1. Farmers – to list and sell crops.
2. Buyers – to purchase crops in bulk directly from farmers.

Users must verify their profiles using required documents before trading.

Backend: Node.js
Frontend: HTML, CSS, JavaScript

---

## Problem Statement
Farmers earn less due to price control by intermediaries and lack of direct market access. Buyers often pay higher prices due to supply-chain layers. The platform solves this by enabling direct farmer-to-buyer transactions.

### Farm2Market Solution:
- ✅ Direct farmer-buyer connection (Zero middlemen)
- ✅ Real-time CACP & FCI data integration
- ✅ AI-powered price prediction and trends
- ✅ Government-verified trust system
- ✅ Hyperlocal weather alerts and crop risk management

---

## Objectives
- Remove dependency on middlemen.
- Increase farmer profits.
- Provide affordable produce to buyers.
- Enable transparent price discovery.
- Provide direct B2B crop trading.

---

## User Roles

### 1. Farmer
- Register and verify account
- Add farm and crop details
- List crops for sale
- Set price and quantity
- Accept or reject buyer orders
- Track orders and payments

### 2. Buyer (Retailer/MNC/Wholesaler)
- Register and verify business
- Browse crops
- Place bulk orders
- Negotiate or accept pricing
- Track deliveries

### 3. Admin (optional)
- Verify users
- Manage disputes
- Monitor transactions
- Manage platform data

---

## Functional Requirements

### Authentication & Verification
- User registration (Farmer/Buyer)
- Document upload for verification
- Admin approval or automated validation
- Login and session management

### Farmer Module
- Dashboard
- Crop listing creation
- Inventory management
- Order acceptance/rejection
- Sales history

### Buyer Module
- Search and filter crops
- View farmer listings
- Place bulk orders
- Order tracking
- Purchase history

### Order Management
- Order creation
- Order confirmation
- Status updates
- Delivery tracking

### Payment Integration (Future Phase)
- Online payment support
- Transaction records

---

## Non-Functional Requirements
- Secure authentication
- Scalable backend
- Mobile responsive UI
- Fast search and listing load
- Reliable uptime

---

## Technology Stack

### Frontend
- HTML
- CSS
- JavaScript

### Backend
- Node.js
- Express.js

### Database (suggested)
- MongoDB / MySQL

### Deployment
- Cloud hosting (AWS, Render, or similar)

---

## Future Enhancements
- Real-time price analytics
- Logistics integration
- Payment gateway integration
- AI-based price prediction
- Farmer training resources

---

## Success Metrics
- Number of farmers onboarded
- Transaction volume
- Increased farmer income
- Buyer cost reduction

---

## Support & Contact

### For Farmers:
- **Helpline**: 1800-FARM-HELP (24/7)
- **WhatsApp**: +91-98765-43210
- **Email**: farmers@farm2market.com

### For Buyers:
- **Business Line**: +91-98765-43211
- **Email**: buyers@farm2market.com

### Technical Support:
- **Email**: tech@farm2market.com
- **GitHub**: [Farm2Market Repository]

---

## License & Credits

*Built with ❤️ for Indian Farmers*
*© 2026 Farm2Market - Empowering Agriculture Through Technology*

---

End of requirements document.

### 4. Internationalization (i18n)
- **Primary Language**: English and Hindi.
- **Regional Language Support**:
  - **North/West**: Hindi (hi), Gujarati (gu), Marathi (mr).
  - **South**: Tamil (ta), Telugu (te), Kannada (kn), Malayalam (ml).
  - **Implementation**:
    - Full-site translation covers Home, Trade, Analytics, About, Market, and Auth pages.
    - **Language Selector**: Direct dropdown in the main navigation bar for instant switching.
    - **Persistent Preference**: Selected language is saved in local storage.

### 5. Deployment & Launch
- **Launch Page**: The application must launch directly to the Home Page (index.html) without requiring user navigation through directories.
- **Redirect Mechanism**: Root index.html automatically redirects to Vertsion/index.html to handle local server configurations.
