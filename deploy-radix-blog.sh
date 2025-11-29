#!/bin/bash

# Quick deployment script to replace cybernimbus with radix-blog-app
# Usage: ./deploy-radix-blog.sh

set -e

SERVER_IP="107.152.41.24"
SSH_USER="root"
DOMAIN="dawarazhar.com"
EMAIL="mdawar.azhar@gmail.com"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
PROJECT_NAME="radix-blog-app"
DEPLOY_PATH="/var/www/$DOMAIN"
PORT="3000"

echo "🚀 Deploying Radix Blog App to replace Cybernimbus"
echo "Server: $SERVER_IP"
echo "Domain: $DOMAIN"
echo "Current directory: $(pwd)"
echo ""

# Step 1: Build locally
print_status "Building Radix blog app locally..."
if ! npm run build; then
    print_error "Build failed!"
    exit 1
fi
print_success "Build completed successfully"

# Step 2: Create deployment package
print_status "Creating deployment package..."
tar -czf radix-blog-deploy.tar.gz \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='*.log' \
    --exclude='.env.local' \
    --exclude='*.tar.gz' \
    .
print_success "Package created"

# Step 3: Copy to server
print_status "Uploading to server (enter root password when prompted)..."
scp radix-blog-deploy.tar.gz ${SSH_USER}@${SERVER_IP}:/tmp/

# Step 4: Deploy on server
print_status "Deploying on server (you'll be prompted for password)..."
ssh ${SSH_USER}@${SERVER_IP} << 'EOF'
set -e

echo "=== Current status before replacement ==="
pm2 list 2>/dev/null || echo "No PM2 processes"
ls -la /var/www/ 2>/dev/null || echo "No web directories"

echo "=== Stopping all existing applications ==="
# Stop all PM2 processes
pm2 stop all 2>/dev/null || true
pm2 delete all 2>/dev/null || true

echo "=== Removing old deployment ==="
rm -rf /var/www/dawarazhar.com
mkdir -p /var/www/dawarazhar.com

echo "=== Extracting new Radix blog app ==="
cd /var/www/dawarazhar.com
tar -xzf /tmp/radix-blog-deploy.tar.gz

echo "=== Verifying extracted app ==="
if grep -q "radix-blog-app" package.json; then
    echo "✅ SUCCESS: Radix blog app extracted correctly"
    grep '"name"' package.json
else
    echo "❌ ERROR: Wrong app extracted"
    grep '"name"' package.json || echo "No package.json found"
    exit 1
fi

echo "=== Installing dependencies ==="
npm ci --only=production

echo "=== Setting up PM2 configuration ==="
cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: 'radix-blog-app',
    script: 'npm',
    args: 'start',
    cwd: '/var/www/dawarazhar.com',
    instances: 1,
    exec_mode: 'fork',
    env: {
      NODE_ENV: 'production',
      PORT: 3000
    }
  }]
}
EOL

echo "=== Starting Radix blog app ==="
pm2 start ecosystem.config.js
pm2 save

echo "=== Final status ==="
pm2 status
pm2 logs radix-blog-app --lines 5

echo "=== Testing application ==="
sleep 3
if curl -f http://localhost:3000 > /dev/null 2>&1; then
    echo "✅ Radix blog app is responding on port 3000"
else
    echo "❌ Application not responding"
    pm2 logs radix-blog-app --lines 10
fi

# Clean up
rm -f /tmp/radix-blog-deploy.tar.gz

echo ""
echo "🎉 Deployment complete!"
echo "Radix blog app should now be running on dawarazhar.com"
echo "Old cybernimbus app has been replaced"
EOF

# Cleanup local files
rm -f radix-blog-deploy.tar.gz

print_success "🎉 Radix blog deployment completed!"
echo ""
echo "Your Radix blog app is now deployed on dawarazhar.com"
echo "The cybernimbus app has been completely replaced"
echo ""
echo "To verify:"
echo "1. Visit https://dawarazhar.com"
echo "2. You should now see your Radix blog instead of cybernimbus"
echo "3. Check server status: ssh root@107.152.41.24 'pm2 status'"