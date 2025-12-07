#!/bin/bash
echo "=== R03 Clean Energy App Deployment ==="

# 1. Install dependencies
cd backend
npm install
cd ..

cd frontend/r03-app
npm install
npm run build -- --configuration production
cd ..

# 2. Start Backend with PM2
echo "Starting Backend on port 3000..."
pm2 start backend/src/server.js --name "r03-backend"

# 3. Serve Frontend with PM2
echo "Serving Frontend on port 80..."
pm2 serve frontend/r03-app/dist/r03-app/browser 80 --name "r03-frontend" --spa

echo "=== Deployment Complete ==="
echo "Frontend: http://localhost"
echo "Backend API: http://localhost:3000/api"
echo "PM2 Status: pm2 status"