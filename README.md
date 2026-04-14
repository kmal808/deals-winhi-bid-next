# Windows Hawaii - Next.js Version

Modern window and door sales management system built with Next.js 15, NextAuth, and Drizzle ORM.

## Getting Started

### Prerequisites
- **For Docker (Recommended):** Docker Desktop
- **For Local Development:** Node.js 20+ and pnpm

### Option 1: Docker Setup (Recommended)

The easiest way to get started:

**Using the setup script:**
\`\`\`bash
./docker-setup.sh
# Select option 1 to build and start
# Select option 5 to seed the database
\`\`\`

**Or manually:**
\`\`\`bash
# Build and start all services
docker compose up -d --build

# Wait for services to be healthy, then seed the database
docker compose exec app pnpm db:push
docker compose exec app pnpm db:seed
\`\`\`

The app will be available at [http://localhost:3000](http://localhost:3000)

**Useful Docker commands:**
\`\`\`bash
# View logs
docker compose logs -f

# Stop services
docker compose down

# Rebuild after code changes
docker compose up -d --build

# Clean up (removes data)
docker compose down -v
\`\`\`

### Option 2: Local Development

1. **Install dependencies:**
\`\`\`bash
pnpm install
\`\`\`

2. **Set up environment** - `.env.local` is already configured with default values

3. **Start PostgreSQL** - Use Docker or your local PostgreSQL instance
\`\`\`bash
# If using the old project's database (already running):
# The database is already configured and shared

# Or start just the database from this project:
docker compose up db -d
\`\`\`

4. **Push database schema:**
\`\`\`bash
pnpm db:push
\`\`\`

5. **Seed the database:**
\`\`\`bash
pnpm db:seed
\`\`\`

6. **Run the development server:**
\`\`\`bash
pnpm dev
\`\`\`

Open [http://localhost:3000](http://localhost:3000)

### Default Login
- Username: \`admin\`
- Password: \`admin123\`

## Migration Status

### ✅ Completed Features

**Authentication & Authorization**
- ✅ NextAuth v5 with credentials provider
- ✅ Login page at `/login`
- ✅ Protected routes via middleware
- ✅ Session management with user roles
- ✅ Sign out functionality

**Customer Management**
- ✅ Customer list page (`/customers`)
- ✅ Create customer (`/customers/new`)
- ✅ View customer details (`/customers/:id`)
- ✅ Edit customer (`/customers/:id/edit`)
- ✅ Delete customer with confirmation
- ✅ Full CRUD with server actions

**Window/Door Configurator**
- ✅ Configurator page (`/configurator/:customerId`)
- ✅ Add windows/doors (`/configurator/:customerId/add`)
- ✅ Edit windows/doors (`/configurator/:customerId/edit/:windowId`)
- ✅ Delete windows/doors
- ✅ Comprehensive configuration form:
  - Location, Brand, Config (XO, OX, XOX, etc.)
  - Frame Type (RBO, NF, RET, BLK)
  - Dimensions (width/height in inches)
  - Frame Color
  - Glass Type (including Etch Matte from your PDFs)
  - Grid Style & Size
  - Low-E option
  - Special instructions
- ✅ **Real-time price calculation** based on:
  - Square footage (width × height)
  - Brand factor multiplier
  - Frame type, color, glass, grid factors
  - Low-E multiplier
- ✅ Manual price override
- ✅ Pricing summary with discount calculation
- ✅ Table view matching PHP app layout

**PDF Generation**
- ✅ Estimate PDF (`/estimate/:customerId`)
  - Windows Hawaii branding
  - Customer & representative info
  - Specification table
  - List price, discount, subtotal
  - Valid through date
  - Download functionality
- ✅ Contract PDF (`/contract/:customerId`)
  - Agreement specification page
  - Terms & conditions with initial boxes
  - Pricing summary with tax calculation
  - Customer information sheet
  - Legal notices
  - Multi-page document (3 pages)
  - Download functionality

**Database & Seeding**
- ✅ Complete schema migration
- ✅ Sample data seeded with:
  - **Alii** brand (from your estimate)
  - XO, OX, XOX configs
  - RBO frame type
  - **Etch Matte** glass (from your PDFs)
  - White, Tan, Bronze, Black colors
  - Colonial, Prairie, SDL grid styles
  - All necessary reference data

**Infrastructure**
- ✅ Docker setup with multi-stage builds
- ✅ Environment configuration
- ✅ Database connection pooling
- ✅ All UI components (Button, Input, Select, etc.)

**Admin Panel** (Complete!)
- ✅ Admin layout with sidebar navigation
- ✅ Dashboard with statistics
- ✅ Brands management (CRUD)
- ✅ Frame Types management (CRUD)
- ✅ Frame Colors management (CRUD with color picker)
- ✅ Glass Types management (CRUD)
- ✅ Grid Styles management (CRUD)
- ✅ Grid Sizes management (CRUD)
- ✅ Product Configs management (CRUD with category badges)
- ✅ Users/Representatives management (CRUD with password hashing)
- ✅ Disclaimers management (CRUD)

**Additional Features**
- ✅ Customer search and filtering (searches name, email, phone, address, city)
- ✅ Admin Panel button for admin users
- ✅ Toggle active/inactive status for all settings
- ✅ Consistent CRUD patterns across all entities
- ✅ Form validation and error handling
- ✅ Toast notifications for all operations

### 🎯 Core Functionality Status: **100% COMPLETE! 🎉**

The application is production-ready with ALL features implemented:

**For Sales Representatives:**
1. ✅ Full customer management (create, edit, view, delete)
2. ✅ Advanced search and filtering
3. ✅ Complete configurator with real-time pricing
4. ✅ Professional estimate PDFs
5. ✅ Multi-page contract PDFs with legal terms

**For Administrators:**
1. ✅ Manage all product configurations (brands, types, colors, glass, grids)
2. ✅ Manage user accounts with role-based access
3. ✅ Manage contract disclaimers
4. ✅ Full control over pricing factors
5. ✅ Toggle active/inactive status for any setting

### 🚀 Optional Future Enhancements
- Signature capture for contracts (with e-signature pad)
- Email functionality for sending PDFs directly to customers
- Reporting dashboard with sales analytics
- Customer activity tracking and notes
