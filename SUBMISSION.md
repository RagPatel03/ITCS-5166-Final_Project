# R03 Clean Energy App - Final Project
**Student:** Raghav Patel (801255003)  
**Course:** ITCS/ITIS-5166  
**Date:** December 2025

## Project Overview
A Single Page Application (SPA) showcasing recent innovations in clean energy technology, specifically a breakthrough copper-magnesium-iron catalyst for CO2 conversion developed by the Korea Institute of Energy Research.

## Technology Stack
- **Frontend:** Angular 18 (Standalone Components)
- **Backend:** Node.js + Express
- **Database:** MySQL (with mock implementation)
- **Authentication:** JWT
- **Charts:** Chart.js
- **Deployment:** PM2 + NGINX

## Features Implemented
1. ✅ JWT Authentication (username: raghav, password: raghav)
2. ✅ Dashboard with 228-word summary
3. ✅ Two dynamic charts (Summary & Reports pages)
4. ✅ MySQL database integration (mock)
5. ✅ Protected routes with auth guards
6. ✅ WCAG 2.1 accessibility compliance
7. ✅ Responsive design
8. ✅ RESTful API with CORS support

## Installation & Deployment

### Prerequisites
- Node.js 18+
- MySQL (optional - uses mock data)
- PM2 (for deployment)

### Quick Start
1. Clone repository
2. Run deployment script:
   ```bash
   # Windows
   deploy.bat
   
   # Linux/Mac
   chmod +x deploy.sh
   ./deploy.sh