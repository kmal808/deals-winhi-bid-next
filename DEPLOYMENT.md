# Deployment Guide

This document provides instructions for deploying the Windows Hawaii application in various environments.

## Docker Deployment

### Prerequisites
- Docker Desktop installed and running
- Docker Compose available (included with Docker Desktop)

### Quick Start

1. **Clone the repository** (if not already done):
\`\`\`bash
git clone <repository-url>
cd deals-winhi-bid-next
\`\`\`

2. **Configure environment variables** (optional):
\`\`\`bash
# Copy and edit the production env file
cp .env.production .env.production.local

# Edit with your production values
# IMPORTANT: Generate a new AUTH_SECRET in production
openssl rand -base64 32
\`\`\`

3. **Build and start**:
\`\`\`bash
# Using the helper script (interactive)
./docker-setup.sh

# Or manually
docker compose up -d --build
\`\`\`

4. **Initialize the database**:
\`\`\`bash
# Push schema
docker compose exec app pnpm db:push

# Seed initial data
docker compose exec app pnpm db:seed
\`\`\`

5. **Access the application**:
- URL: http://localhost:3000
- Username: `admin`
- Password: `admin123`

### Production Deployment

#### Environment Variables

Create a `.env.production.local` file with production values:

\`\`\`bash
# Database
DATABASE_URL=postgresql://windows_hawaii:YOUR_SECURE_PASSWORD@db:5432/windows_hawaii

# Authentication (CRITICAL: Generate new secret)
AUTH_SECRET=<output-of-openssl-rand-base64-32>
NEXTAUTH_URL=https://your-domain.com

# Application
NODE_ENV=production
PORT=3000
\`\`\`

#### Docker Compose Override

For production, create a `docker-compose.prod.yml`:

\`\`\`yaml
services:
  app:
    environment:
      - NEXTAUTH_URL=https://your-domain.com
    restart: always

  db:
    restart: always
    # Consider using external volume for data persistence
    volumes:
      - /var/lib/postgresql-data:/var/lib/postgresql/data
\`\`\`

Deploy with:
\`\`\`bash
docker compose -f docker-compose.yml -f docker-compose.prod.yml up -d --build
\`\`\`

### Docker Management

#### Viewing Logs
\`\`\`bash
# All services
docker compose logs -f

# Specific service
docker compose logs -f app
docker compose logs -f db
\`\`\`

#### Executing Commands
\`\`\`bash
# Run database migrations
docker compose exec app pnpm db:push

# Seed database
docker compose exec app pnpm db:seed

# Open database studio
docker compose exec app pnpm db:studio

# Shell access
docker compose exec app sh
\`\`\`

#### Backup and Restore

**Backup database:**
\`\`\`bash
docker compose exec db pg_dump -U windows_hawaii windows_hawaii > backup-$(date +%Y%m%d).sql
\`\`\`

**Restore database:**
\`\`\`bash
cat backup-20260128.sql | docker compose exec -T db psql -U windows_hawaii windows_hawaii
\`\`\`

#### Updating the Application

\`\`\`bash
# Pull latest changes
git pull

# Rebuild and restart
docker compose up -d --build

# Run any new migrations
docker compose exec app pnpm db:push
\`\`\`

### Troubleshooting

#### Container won't start
\`\`\`bash
# Check logs
docker compose logs app

# Check health status
docker compose ps

# Restart services
docker compose restart
\`\`\`

#### Database connection issues
\`\`\`bash
# Check if database is healthy
docker compose exec db pg_isready -U windows_hawaii

# Verify connection from app container
docker compose exec app sh -c 'echo "SELECT 1" | psql $DATABASE_URL'
\`\`\`

#### Port conflicts
\`\`\`bash
# Check what's using port 3000
lsof -i :3000

# Or change the port in docker-compose.yml
services:
  app:
    ports:
      - "3001:3000"  # Use port 3001 on host
\`\`\`

## Production Considerations

### Security

1. **Change default credentials** immediately after first deployment
2. **Use strong AUTH_SECRET** (generate with `openssl rand -base64 32`)
3. **Enable HTTPS** using a reverse proxy (nginx, Traefik, Caddy)
4. **Regular security updates** for base images
5. **Limit database exposure** (don't expose port 5432 in production)

### Performance

1. **Resource limits** in docker-compose.yml:
\`\`\`yaml
services:
  app:
    deploy:
      resources:
        limits:
          cpus: '2'
          memory: 2G
\`\`\`

2. **Database tuning** for production workloads
3. **Use CDN** for static assets
4. **Enable database connection pooling** (already configured)

### Monitoring

Consider adding:
- Health check endpoints
- Log aggregation (ELK stack, Datadog)
- Error tracking (Sentry)
- Uptime monitoring

### Backup Strategy

1. **Daily automated backups** of PostgreSQL
2. **Store backups off-site** (S3, cloud storage)
3. **Test restore procedures** regularly
4. **Version control** for configuration

## Cloud Deployment Options

### Using a Reverse Proxy

Example nginx configuration:

\`\`\`nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
\`\`\`

### Deploying to VPS/Cloud

The Docker setup works on any platform that supports Docker:
- DigitalOcean Droplets
- AWS EC2
- Google Cloud Compute Engine
- Azure VMs
- Linode
- Hetzner

Basic steps:
1. Provision a server with Docker installed
2. Clone repository
3. Configure environment variables
4. Run docker compose
5. Set up reverse proxy with SSL (Let's Encrypt)

## Support

For issues or questions:
- Check the logs: `docker compose logs -f`
- Review the README.md for setup instructions
- Verify environment variables are correctly set
