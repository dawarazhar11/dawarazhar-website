#!/bin/bash

# Deployment script for Next.js blog app with Apache
# Usage: ./setup-server.sh <server_ip> <ssh_user> <domain> <email> [-Apache]

set -e

# Parse command line arguments
SERVER_IP="$1"
SSH_USER="$2"
DOMAIN="$3"
EMAIL="$4"
WEB_SERVER="$5"

# Validate arguments
if [ -z "$SERVER_IP" ] || [ -z "$SSH_USER" ] || [ -z "$DOMAIN" ] || [ -z "$EMAIL" ]; then
    echo "Usage: $0 <server_ip> <ssh_user> <domain> <email> [-Apache]"
    echo "Example: $0 107.152.41.24 root dawarazhar.com mdawar.azhar@gmail.com -Apache"
    exit 1
fi

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Configuration
PROJECT_NAME="radix-blog-app"
DEPLOY_PATH="/var/www/$DOMAIN"
NODE_VERSION="20"
PORT="3000"

print_status "Starting deployment to $SERVER_IP for domain $DOMAIN"
print_status "Working from directory: $(pwd)"
print_status "Deploying project: $(grep '"name"' package.json | cut -d'"' -f4)"

# Step 1: Prepare local build
print_status "Building application locally..."
if ! npm run build; then
    print_error "Local build failed"
    exit 1
fi
print_success "Local build completed"

# Step 2: Create deployment archive
print_status "Creating deployment archive..."
tar -czf deploy.tar.gz \
    --exclude='.git' \
    --exclude='node_modules' \
    --exclude='*.log' \
    --exclude='.env.local' \
    --exclude='deploy.tar.gz' \
    .
print_success "Deployment archive created"

# Step 3: Copy files to server
print_status "Copying files to server..."
scp deploy.tar.gz ${SSH_USER}@${SERVER_IP}:/tmp/
print_success "Files copied to server"

# Step 4: Execute server setup
print_status "Setting up server environment..."

# First, let's see what's currently running
print_status "Checking current server state..."
ssh ${SSH_USER}@${SERVER_IP} << 'EOD'
    echo "=== Current PM2 processes ==="
    pm2 list || echo "PM2 not installed or no processes running"
    
    echo "=== Current web directories ==="
    ls -la /var/www/ || echo "No web directories found"
    
    echo "=== Apache sites enabled ==="
    ls -la /etc/apache2/sites-enabled/ 2>/dev/null || echo "Apache not installed or no sites"
EOD

print_status "Starting fresh deployment..."

ssh ${SSH_USER}@${SERVER_IP} << EOF
    set -e
    
    # Update system
    echo "Updating system packages..."
    apt update && apt upgrade -y
    
    # Install Node.js
    echo "Installing Node.js ${NODE_VERSION}..."
    curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | sudo -E bash -
    apt install -y nodejs
    
    # Install PM2 globally
    echo "Installing PM2..."
    npm install -g pm2
    
    # Install Apache if specified
    if [ "$WEB_SERVER" = "-Apache" ]; then
        echo "Installing Apache..."
        apt install -y apache2
        a2enmod proxy
        a2enmod proxy_http
        a2enmod rewrite
        a2enmod ssl
        systemctl enable apache2
    fi
    
    # Stop any existing PM2 processes
    echo "Stopping any existing PM2 processes..."
    pm2 stop $PROJECT_NAME || true
    pm2 delete $PROJECT_NAME || true
    
    # Remove existing deployment directory
    echo "Cleaning up existing deployment..."
    rm -rf $DEPLOY_PATH
    
    # Create fresh deployment directory
    echo "Setting up deployment directory..."
    mkdir -p $DEPLOY_PATH
    cd $DEPLOY_PATH
    
    # Extract application
    echo "Extracting application..."
    tar -xzf /tmp/deploy.tar.gz -C $DEPLOY_PATH
    
    # Verify we extracted the right app
    echo "Verifying deployed application..."
    if grep -q "radix-blog-app" package.json; then
        echo "✅ Correct application deployed: radix-blog-app"
    else
        echo "❌ Warning: Unexpected application detected"
        cat package.json | grep '"name"'
    fi
    
    # Install dependencies
    echo "Installing production dependencies..."
    npm ci --only=production
    
    # Set proper permissions
    chown -R www-data:www-data $DEPLOY_PATH
    
    # Create PM2 ecosystem file
    echo "Creating PM2 configuration..."
    cat > ecosystem.config.js << EOL
module.exports = {
  apps: [{
    name: '$PROJECT_NAME',
    script: 'npm',
    args: 'start',
    cwd: '$DEPLOY_PATH',
    instances: 'max',
    exec_mode: 'cluster',
    env: {
      NODE_ENV: 'production',
      PORT: $PORT
    },
    error_file: '/var/log/pm2/$PROJECT_NAME-error.log',
    out_file: '/var/log/pm2/$PROJECT_NAME-out.log',
    log_file: '/var/log/pm2/$PROJECT_NAME.log'
  }]
}
EOL
    
    # Create PM2 log directory
    mkdir -p /var/log/pm2
    chown -R www-data:www-data /var/log/pm2
    
    # Start application with PM2
    echo "Starting application with PM2..."
    pm2 start ecosystem.config.js
    pm2 save
    pm2 startup
    
    echo "Application started successfully!"
EOF

print_success "Server environment configured"

# Step 5: Configure Apache (if specified)
if [ "$WEB_SERVER" = "-Apache" ]; then
    print_status "Configuring Apache virtual host..."
    
    ssh ${SSH_USER}@${SERVER_IP} << EOF
        # Create Apache virtual host
        cat > /etc/apache2/sites-available/${DOMAIN}.conf << EOL
<VirtualHost *:80>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    
    # Redirect HTTP to HTTPS
    RewriteEngine On
    RewriteCond %{HTTPS} off
    RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [R=301,L]
</VirtualHost>

<VirtualHost *:443>
    ServerName $DOMAIN
    ServerAlias www.$DOMAIN
    
    # SSL Configuration (will be handled by Certbot)
    
    # Proxy to Next.js application
    ProxyPreserveHost On
    ProxyRequests Off
    
    # Handle static assets
    ProxyPass /_next/static !
    ProxyPass /favicon.ico !
    ProxyPass /images !
    
    Alias /_next/static $DEPLOY_PATH/.next/static
    Alias /favicon.ico $DEPLOY_PATH/public/favicon.ico
    Alias /images $DEPLOY_PATH/public/images
    
    <Directory "$DEPLOY_PATH/.next/static">
        Require all granted
        ExpiresActive On
        ExpiresDefault "access plus 1 year"
    </Directory>
    
    <Directory "$DEPLOY_PATH/public">
        Require all granted
        ExpiresActive On
        ExpiresDefault "access plus 1 month"
    </Directory>
    
    # Proxy everything else to Next.js
    ProxyPass / http://localhost:$PORT/
    ProxyPassReverse / http://localhost:$PORT/
    
    # Enable compression
    LoadModule deflate_module modules/mod_deflate.so
    <Location />
        SetOutputFilter DEFLATE
        SetEnvIfNoCase Request_URI \\.(?:gif|jpe?g|png)$ no-gzip dont-vary
        SetEnvIfNoCase Request_URI \\.(?:exe|t?gz|zip|bz2|sit|rar)$ no-gzip dont-vary
    </Location>
    
    # Security headers
    Header always set X-Content-Type-Options nosniff
    Header always set X-Frame-Options DENY
    Header always set X-XSS-Protection "1; mode=block"
    Header always set Strict-Transport-Security "max-age=63072000; includeSubDomains; preload"
    Header always set Referrer-Policy "strict-origin-when-cross-origin"
    
    # Logs
    ErrorLog \${APACHE_LOG_DIR}/${DOMAIN}_error.log
    CustomLog \${APACHE_LOG_DIR}/${DOMAIN}_access.log combined
</VirtualHost>
EOL
        
        # Enable site and required modules
        a2ensite ${DOMAIN}.conf
        a2enmod headers
        a2enmod expires
        
        # Test Apache configuration
        apache2ctl configtest
        
        # Reload Apache
        systemctl reload apache2
        
        echo "Apache virtual host configured!"
EOF
    
    print_success "Apache virtual host configured"
fi

# Step 6: Setup SSL with Let's Encrypt
print_status "Setting up SSL certificate..."

ssh ${SSH_USER}@${SERVER_IP} << EOF
    # Install Certbot
    apt install -y certbot
    
    if [ "$WEB_SERVER" = "-Apache" ]; then
        apt install -y python3-certbot-apache
        
        # Get SSL certificate
        certbot --apache -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive
        
        # Setup auto-renewal
        (crontab -l 2>/dev/null; echo "0 12 * * * /usr/bin/certbot renew --quiet") | crontab -
    else
        # Standalone mode for other web servers
        certbot certonly --standalone -d $DOMAIN -d www.$DOMAIN --email $EMAIL --agree-tos --non-interactive
    fi
    
    echo "SSL certificate configured!"
EOF

print_success "SSL certificate configured"

# Step 7: Final verification
print_status "Performing final verification..."

ssh ${SSH_USER}@${SERVER_IP} << EOF
    # Check if PM2 processes are running
    pm2 status
    
    # Check if Apache is running (if applicable)
    if [ "$WEB_SERVER" = "-Apache" ]; then
        systemctl status apache2 --no-pager -l
    fi
    
    # Test application endpoint
    sleep 5
    curl -f http://localhost:$PORT > /dev/null && echo "✅ Application is responding on port $PORT"
    
    # Test domain (if DNS is configured)
    curl -f -k https://$DOMAIN > /dev/null && echo "✅ Domain is accessible via HTTPS" || echo "⚠️  Domain not yet accessible (DNS may need time to propagate)"
EOF

# Cleanup
rm -f deploy.tar.gz

print_success "🎉 Deployment completed successfully!"
print_status "Application is running on: https://$DOMAIN"
print_status "Server monitoring: ssh ${SSH_USER}@${SERVER_IP} 'pm2 status'"
print_status "Server logs: ssh ${SSH_USER}@${SERVER_IP} 'pm2 logs $PROJECT_NAME'"

echo ""
print_warning "Post-deployment checklist:"
echo "1. Ensure DNS A record points $DOMAIN to $SERVER_IP"
echo "2. Test the application at https://$DOMAIN"
echo "3. Monitor logs: pm2 logs $PROJECT_NAME"
echo "4. Set up monitoring and backups as needed"
echo ""
print_status "Deployment script completed! 🚀"