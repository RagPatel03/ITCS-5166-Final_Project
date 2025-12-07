#!/bin/bash
echo "=== R03 Clean Energy App - DigitalOcean Deployment ==="

cd /var/www/r03-app

# Install backend dependencies
echo "Installing backend dependencies..."
cd backend
npm install --production
cd ..

# Install frontend dependencies and build
echo "Building frontend..."
cd frontend/r03-app
npm install
npm run build -- --configuration production
cd ../..

# Configure NGINX
echo "Configuring NGINX..."
cat > /etc/nginx/sites-available/r03-app << 'EOL'
server {
    listen 80;
    server_name _;
    
    # Frontend Angular App
    location / {
        root /var/www/r03-app/frontend/r03-app/dist/r03-app/browser;
        try_files $uri $uri/ /index.html;
        index index.html index.htm;
        
        # Security headers
        add_header X-Frame-Options "SAMEORIGIN" always;
        add_header X-Content-Type-Options "nosniff" always;
        add_header X-XSS-Protection "1; mode=block" always;
        add_header Referrer-Policy "no-referrer-when-downgrade" always;
    }
    
    # Backend API Proxy
    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
    
    # Health check endpoint
    location /health {
        access_log off;
        return 200 "healthy\n";
        add_header Content-Type text/plain;
    }
}
EOL

# Enable site
ln -sf /etc/nginx/sites-available/r03-app /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default

# Test NGINX config
nginx -t

# Restart NGINX
systemctl restart nginx

# Start backend with PM2 (auto-restart on crash)
echo "Starting backend with PM2..."
cd /var/www/r03-app/backend
pm2 start src/server.js --name "r03-backend"
pm2 save
pm2 startup

# Enable firewall
echo "Configuring firewall..."
ufw allow OpenSSH
ufw allow 'Nginx Full'
ufw --force enable

echo "=== DEPLOYMENT COMPLETE ==="
echo "App: http://$(curl -s ifconfig.me)"
echo "Health: http://$(curl -s ifconfig.me)/health"
echo "API: http://$(curl -s ifconfig.me)/api"
echo ""
echo "PM2 processes: pm2 list"
echo "PM2 logs: pm2 logs"
echo "NGINX logs: tail -f /var/log/nginx/access.log"