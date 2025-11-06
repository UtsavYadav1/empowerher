# Setup Instructions

## Quick Start

Run these commands in order:

### 1. Install Dependencies (if not already done)
```bash
npm install
```

### 2. Generate Prisma Client
```bash
npx prisma generate
```
When prompted, type `y` and press Enter.

### 3. Create Database and Run Migrations
```bash
npx prisma migrate dev --name init
```
When prompted, type `y` and press Enter.

### 4. Seed the Database
```bash
npm run prisma:seed
```

### 5. Start Development Server
```bash
npm run dev
```

The application will be available at: **http://localhost:3000**

## Troubleshooting

### PowerShell Execution Policy Issue
If you get execution policy errors, run:
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

### Prisma Client Not Found
If you get "PrismaClient is not defined" errors, run:
```bash
npx prisma generate
```

### Database Already Exists
If you need to reset the database:
```bash
npx prisma migrate reset
npm run prisma:seed
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run prisma:seed` - Seed database with sample data

## Default Test Accounts

After seeding, you can use any of the seeded users from `/data/seed.json`:
- Phone numbers start with: +91 9876543210, +91 9876543211, etc.
- Password: `hashed_password_123` (and similar)

## Environment Variables

Make sure `.env` file exists with:
```
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key-change-in-production"
NEXTAUTH_URL="http://localhost:3000"
```

