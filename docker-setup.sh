#!/bin/bash

# Docker Setup Script for Windows Hawaii Next.js App
# This script helps set up and manage the Docker environment

set -e

GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}=====================================${NC}"
echo -e "${GREEN}Windows Hawaii - Docker Setup${NC}"
echo -e "${GREEN}=====================================${NC}\n"

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo -e "${RED}Error: Docker is not installed${NC}"
    echo "Please install Docker Desktop from https://www.docker.com/products/docker-desktop"
    exit 1
fi

# Check if Docker Compose is available
if ! docker compose version &> /dev/null; then
    echo -e "${RED}Error: Docker Compose is not available${NC}"
    echo "Please ensure you have Docker Desktop with Compose support"
    exit 1
fi

# Function to display menu
show_menu() {
    echo -e "\n${YELLOW}Select an option:${NC}"
    echo "1) Build and start containers"
    echo "2) Stop containers"
    echo "3) View logs"
    echo "4) Run database migrations"
    echo "5) Seed database"
    echo "6) Rebuild containers (clean build)"
    echo "7) Clean up (remove containers and volumes)"
    echo "8) Exit"
    echo -n "Enter choice [1-8]: "
}

# Function to build and start containers
start_containers() {
    echo -e "\n${GREEN}Building and starting containers...${NC}"
    docker compose up -d --build
    echo -e "${GREEN}✓ Containers started successfully${NC}"
    echo -e "\n${YELLOW}Application will be available at: http://localhost:3000${NC}"
    echo -e "${YELLOW}Login credentials:${NC}"
    echo -e "  Username: admin"
    echo -e "  Password: admin123\n"
}

# Function to stop containers
stop_containers() {
    echo -e "\n${GREEN}Stopping containers...${NC}"
    docker compose down
    echo -e "${GREEN}✓ Containers stopped${NC}"
}

# Function to view logs
view_logs() {
    echo -e "\n${GREEN}Viewing logs (Ctrl+C to exit)...${NC}\n"
    docker compose logs -f
}

# Function to run migrations
run_migrations() {
    echo -e "\n${GREEN}Running database migrations...${NC}"
    docker compose exec app pnpm db:push
    echo -e "${GREEN}✓ Migrations completed${NC}"
}

# Function to seed database
seed_database() {
    echo -e "\n${GREEN}Seeding database...${NC}"
    docker compose exec app pnpm db:seed
    echo -e "${GREEN}✓ Database seeded${NC}"
}

# Function to rebuild containers
rebuild_containers() {
    echo -e "\n${GREEN}Rebuilding containers (this may take a few minutes)...${NC}"
    docker compose down
    docker compose build --no-cache
    docker compose up -d
    echo -e "${GREEN}✓ Containers rebuilt and started${NC}"
}

# Function to clean up
cleanup() {
    echo -e "\n${RED}Warning: This will remove all containers and data volumes!${NC}"
    read -p "Are you sure? (yes/no): " confirm
    if [ "$confirm" = "yes" ]; then
        echo -e "\n${GREEN}Cleaning up...${NC}"
        docker compose down -v
        echo -e "${GREEN}✓ Cleanup completed${NC}"
    else
        echo -e "${YELLOW}Cleanup cancelled${NC}"
    fi
}

# Main loop
while true; do
    show_menu
    read choice

    case $choice in
        1) start_containers ;;
        2) stop_containers ;;
        3) view_logs ;;
        4) run_migrations ;;
        5) seed_database ;;
        6) rebuild_containers ;;
        7) cleanup ;;
        8)
            echo -e "\n${GREEN}Goodbye!${NC}"
            exit 0
            ;;
        *)
            echo -e "${RED}Invalid option. Please try again.${NC}"
            ;;
    esac
done
