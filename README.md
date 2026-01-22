# EmpowerHer

A comprehensive role-based platform designed to empower women and girls in India through education, entrepreneurship, and community support.

## 🚀 Features

### For Girls (Education & Career)
-   **Skill Tutorials**: curated video courses in Hindi & English (Business, Tech, Arts).
-   **Progress Tracking**: Real-time tracking of watched videos with a visual progress bar.
-   **Certificates**: Auto-generated personalized certificates upon course completion.
-   **Scholarship Schemes**: Database of government schemes with tracking of application status.
-   **Career Guidance**: Quiz-based career recommendations and connection to mentors.

### For Women (Entrepreneurship)
-   **Business Tools**: Dashboard for managing products, orders, and sales analytics.
-   **Marketplace**: Listing platform to sell handmade products directly to customers.
-   **Financial Literacy**: Specialized modules on budgeting, saving, and managing a small business.

### For Admins & Field Agents
-   **User Management**: Verify users and track regional impact.
-   **Event Management**: Create and manage workshops and training sessions.
-   **Analytics**: Global view of platform adoption and success schemes.

---

## 🛠️ Tech Stack

-   **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
-   **Language**: TypeScript
-   **Database**: [PostgreSQL (Supabase)](https://supabase.com/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Styling**: Tailwind CSS + Framer Motion
-   **Deployment**: [Vercel](https://vercel.com/)

---

## ⚙️ Setup & Installation

### 1. Clone the repository
```bash
git clone <repository-url>
cd empowerher
npm install
```

### 2. Configure Environment
Create a `.env` file in the root directory:
```env
# Database (Supabase Transaction Pooler)
DATABASE_URL="postgres://[user]:[password]@[host]:6543/postgres?pgbouncer=true"

# Database (Supabase Direct Connection)
DIRECT_URL="postgres://[user]:[password]@[host]:5432/postgres"

# NextAuth (Optional for future)
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

### 3. Database Setup
Push the schema to your Supabase database and seed initial data.
```bash
# Push schema
npx prisma db push

# Seed data (Users, Courses, Schemes)
npx prisma db seed
```

### 4. Run Locally
```bash
npm run dev
```
Visit `http://localhost:3000` to see the app.

---

## 📦 Scripts & Tools

### Manual Video Update
We have a custom tool to easily update the "Skill Tutorials" content without touching the code.
1.  Edit `scripts/update-videos.ts` with your new YouTube IDs.
2.  Run the fix script:
    ```bash
    npm run video-fix
    ```
    *(See `MANUAL_VIDEO_UPDATE.md` for a detailed guide)*

### Create Admin
To create a privileged admin account via CLI:
```bash
npx tsx scripts/create-admin.ts
```

---

## 🚀 Deployment

### Vercel + Supabase
This project is optimized for deployment on Vercel with a Supabase backend.

1.  **Supabase**:
    -   Create a new project.
    -   Get the connection strings (Transaction Pooler & Direct).
    -   Add them to your Vercel Environment Variables.

2.  **Vercel**:
    -   Import the repository.
    -   Add `DATABASE_URL` and `DIRECT_URL` to the Environment Variables.
    -   **Build Command**: `next build`
    -   **Install Command**: `npm install`
    -   **Post-Install**: It is recommended to run `npx prisma generate` in the build command or post-install script.

3.  **Production Database**:
    -   After deployment, run `npx prisma db push` locally (pointing to prod DB) or configure a build command to migrate.
