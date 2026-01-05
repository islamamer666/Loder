# Loder - Construction Equipment Rental Marketplace

Loder is a global listing marketplace for construction equipment rentals. Contractors can browse equipment by category, and equipment owners can list their equipment for rent.

## Features

- 🌍 **Global Marketplace**: Browse construction equipment from around the world
- 🌐 **Multi-language Support**: English and Arabic with RTL support
- 🔍 **Advanced Search**: Search by category, location, and keywords
- 📱 **Responsive Design**: Works on desktop, tablet, and mobile devices
- 🎨 **Brand Colors**: Safety Yellow (#FFD700) and Charcoal Grey (#36454F)

## Tech Stack

- **Frontend**: React + TailwindCSS
- **Backend**: Node.js (Express)
- **Database**: PostgreSQL

## Project Structure

```
loder/
├── client/          # React frontend
├── server/          # Express backend
└── package.json     # Root package.json for running both
```

## Quick Start (Local Deployment)

### Windows

1. **Run setup script:**
   ```powershell
   .\setup.ps1
   ```

2. **Start the application:**
   ```powershell
   .\start.ps1
   ```
   Or: `npm run dev`

### Linux/Mac

1. **Make scripts executable and run setup:**
   ```bash
   chmod +x setup.sh start.sh
   ./setup.sh
   ```

2. **Start the application:**
   ```bash
   ./start.sh
   ```
   Or: `npm run dev`

### Manual Setup

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed manual setup instructions.

**Quick manual steps:**
1. Install dependencies: `npm run install-all`
2. Set up PostgreSQL (or use Docker: `docker-compose up -d`)
3. Run schema: `psql -U postgres -d loder -f server/database/schema.sql`
4. Copy `server/env.example` to `server/.env`
5. Start: `npm run dev`

The app will be available at:
- Frontend: http://localhost:3001 (or 3000 if available)
- Backend: http://localhost:5000

### Environment Variables

Create a `server/.env` file with the following variables:

```
PORT=5000
DB_USER=postgres
DB_HOST=localhost
DB_NAME=loder
DB_PASSWORD=your_password
DB_PORT=5432
```

## Deployment

See [DEPLOYMENT.md](./DEPLOYMENT.md) for detailed deployment instructions to:
- **Render**: Backend and PostgreSQL database
- **Vercel**: Frontend React application

## Usage

1. **Browse Equipment**: Visit the home page or browse page to see available equipment
2. **Search**: Use the search bar to find specific equipment or filter by category and location
3. **View Details**: Click on any equipment card to see full details and contact information
4. **List Equipment**: Click "List Equipment" to add your equipment to the marketplace

## API Endpoints

- `GET /api/health` - Health check
- `GET /api/categories` - Get all categories
- `GET /api/equipment` - Get equipment listings (supports query params: category, search, location)
- `GET /api/equipment/:id` - Get single equipment details
- `POST /api/equipment` - Create new equipment listing

## Development

- Frontend runs on port 3001 (or 3000 if available)
- Backend runs on port 5000
- Make sure PostgreSQL is running before starting the backend

## License

ISC
