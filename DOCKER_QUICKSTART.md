# Docker Quick Start Guide

## TL;DR - Get Running in 30 Seconds

```bash
# 1. Start everything
docker compose up -d --build

# 2. Wait 10 seconds for database to be ready, then seed
docker compose exec app pnpm db:seed

# 3. Open http://localhost:3000
# Login: admin / admin123
```

## Interactive Setup Script

For a guided setup experience:

```bash
./docker-setup.sh
```

This script provides an interactive menu for:
- ✅ Building and starting containers
- 📋 Viewing logs
- 🔄 Running migrations
- 🌱 Seeding the database
- 🧹 Cleaning up

## Manual Commands

### Starting Services

```bash
# Build and start in background
docker compose up -d --build

# Start without rebuilding
docker compose up -d

# Start and view logs
docker compose up
```

### Database Operations

```bash
# Push schema (creates/updates tables)
docker compose exec app pnpm db:push

# Seed sample data
docker compose exec app pnpm db:seed

# Open Drizzle Studio (database GUI)
docker compose exec app pnpm db:studio
# Then open: https://local.drizzle.studio
```

### Viewing Status

```bash
# Check running containers
docker compose ps

# View all logs
docker compose logs -f

# View app logs only
docker compose logs -f app

# View database logs only
docker compose logs -f db
```

### Stopping Services

```bash
# Stop containers (keeps data)
docker compose down

# Stop and remove volumes (DELETES DATA!)
docker compose down -v
```

### Rebuilding

```bash
# After code changes
docker compose up -d --build

# Complete rebuild (clears cache)
docker compose build --no-cache
docker compose up -d
```

## Troubleshooting

### Port Already in Use

**Error:** `Bind for 0.0.0.0:3000 failed: port is already allocated`

**Solution:** Either stop the service using port 3000, or change the port in `docker-compose.yml`:

```yaml
services:
  app:
    ports:
      - "3001:3000"  # Use 3001 on your machine
```

### Database Connection Failed

**Solution:**
```bash
# Check database health
docker compose ps

# Restart database
docker compose restart db

# Wait for healthy status
docker compose exec db pg_isready -U windows_hawaii
```

### Build Errors

**Solution:**
```bash
# Clean rebuild
docker compose down
docker system prune -f
docker compose build --no-cache
docker compose up -d
```

### Can't Execute Commands

**Error:** `ERROR: No container found for app_1`

**Solution:** Make sure containers are running first:
```bash
docker compose up -d
# Wait a few seconds
docker compose exec app pnpm db:seed
```

## Production Deployment

For production deployment, see [DEPLOYMENT.md](./DEPLOYMENT.md) for:
- Security best practices
- Backup strategies
- Performance tuning
- Cloud deployment options
- SSL/HTTPS setup

## What's Running?

When you run `docker compose up`, you get:

- **app** (port 3000): Next.js application
  - Built with multi-stage Docker for optimal size
  - Runs as non-root user for security
  - Auto-restarts on failure

- **db** (port 5432): PostgreSQL 16
  - Persistent data volume
  - Health checks enabled
  - Auto-restarts on failure

## Default Credentials

**Application:**
- URL: http://localhost:3000
- Username: `admin`
- Password: `admin123`

**Database:**
- Host: localhost
- Port: 5432
- Database: windows_hawaii
- Username: windows_hawaii
- Password: changeme (configurable via .env)

⚠️ **Change these in production!**
