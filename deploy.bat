@echo off
echo R03 Clean Energy App - Local Deployment Test
echo.

echo 1. Starting Backend...
cd backend
start cmd /k "node src/server.js"
cd ..

echo 2. Building Frontend...
cd frontend\r03-app
call npm run build

echo 3. Serving Frontend...
cd ..\..
npx serve frontend/r03-app/dist/r03-app/browser -p 8080

echo.
echo Frontend: http://localhost:8080
echo Backend: http://localhost:3000
echo Login: username=raghav, password=raghav
pause