# EmpowerHer - Women Empowerment Platform 🚀

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-green?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma&logoColor=white)](https://www.prisma.io/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?style=for-the-badge&logo=vercel&logoColor=white)](https://vercel.com/)

> **Empowering women and girls in India with the tools for education, entrepreneurship, and financial independence.**

> **Live Demo:** [https://empowerher-beta.vercel.app/](https://empowerher-beta.vercel.app/)

---

## 🌟 Project Overview

**EmpowerHer** is a comprehensive, role-based web platform designed to bridge the digital divide for women in rural and semi-urban India. It serves as a unified ecosystem connecting:
1.  **Girls (Students)**: To education, scholarships, and career guidance.
2.  **Women (Entrepreneurs)**: To e-commerce tools, global markets, and business analytics.
3.  **Customers**: To unique, handmade products from rural artisans.
4.  **Field Agents/Admins**: To ground-level data verification and impact tracking.

---

## 🔑 Key Features by Role

### 👩‍🎓 For Girls (Education & Growth)
*   **Skill Tutorials**:
    *   Curated video library in Hindi & English (Youtube integration).
    *   Tracks "Watched" status with a visual progress bar.
    *   *Categories*: Business, Technology, Arts, Communication.
*   **Scholarship Schemes**:
    *   Searchable database of government schemes.
    *   One-click application tracking.
*   **Career Guidance**:
    *   Interactive quiz to recommend career paths.
    *   Connection to mentors and experts.
*   **Certificates**: Auto-generated certificates of completion.

### 👩‍💼 For Women (Entrepreneurship)
*   **Seller Dashboard**:
    *   Manage product listings (upload photos, set prices).
    *   Track inventory and sales orders.
*   **Analytics**: Visual graphs showing revenue growth and village impact.
*   **Workshops**: Register for offline training sessions (Tailoring, Digital Literacy).
*   **Financial Literacy**: Modules on budgeting and small business loans.

### 🛒 For Customers (Marketplace)
*   **E-Commerce Store**:
    *   Browse handmade products (Pickles, Crafts, Textiles, etc.).
    *   Advanced filters (Category, Price, Sort).
*   **Shopping Experience**:
    *   Add to cart functionality.
    *   Secure checkout process.
*   **Support Local**: Direct purchase from rural women entrepreneurs.

### 🛡️ For Admins & Field Agents
*   **Verification System**: Validate new users and business listings.
*   **Event Management**: CRUD operations for organizing workshops.
*   **Impact Dashboard**: Real-time stats on registered users and total revenue generated.

---

## 🛠️ Technology Stack

| Category | Technology | Usage |
| :--- | :--- | :--- |
| **Frontend** | **Next.js 14 (App Router)** | Core framework for SSR/CSR |
|  | **Tailwind CSS** | Responsive styling & Design System |
|  | **Framer Motion** | Smooth animations & transitions |
| **Backend** | **Next.js API Routes** | Serverless API endpoints |
|  | **Prisma ORM** | Type-safe database queries |
| **Database** | **PostgreSQL (Supabase)** | scalable relational database |
| **Auth** | **Custom / NextAuth** | Role-based authentication & protection |
| **Charts** | **Recharts** | Data visualization for dashboards |

---

## 🚀 Getting Started locally

Follow these steps to set up the project on your machine.

### Prerequisites
*   Node.js 18+ installed.
*   PostgreSQL database (or a Supabase project).

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/empowerher.git
cd empowerher
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory and add your credentials:
```env
# Database Connection (Get this from Supabase)
DATABASE_URL="postgres://[user]:[password]@[host]:6543/postgres?pgbouncer=true"
DIRECT_URL="postgres://[user]:[password]@[host]:5432/postgres"

# Optional: NextAuth Secret (generate one)
NEXTAUTH_SECRET="your-super-secret-key-123"
NEXTAUTH_URL="http://localhost:3000"
```

### 4. Database Migration & Seed
Initialize your database schema and populate it with sample data:
```bash
# Push schema to DB
npx prisma db push

# Seed initial data (Courses, Products, Schemes)
npx prisma db seed
```

### 5. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the app.

---

## 📦 Admin & Maintenance Tools

We have built custom scripts to make maintaining the platform easier.

### 🎥 Update Video Tutorials
Change the educational videos displayed on the site without editing code.
1.  Open `scripts/update-videos.ts`
2.  Add/Edit YouTube IDs.
3.  Run: `npm run video-fix`
*(Detailed guide located in: `MANUAL_VIDEO_UPDATE.md`)*

### 👤 Create Admin User
To check the Admin Dashboard, create a secure admin account via CLI:
```bash
npx tsx scripts/create-admin.ts
```

---

## ☁️ Deployment Guide

This project is optimized for **Vercel**.

1.  **Push to GitHub**: Ensure your latest code is on the `main` branch.
2.  **Import to Vercel**:
    *   Go to Vercel Dashboard -> Add New Project -> Import from GitHub.
3.  **Environment Variables**:
    *   Add your `DATABASE_URL` and `DIRECT_URL` (from Supabase) in Vercel project settings.
4.  **Deploy**: Click deploy. Vercel will build the app and provide a live URL.

> **Note**: After deployment, if you change `prisma/schema.prisma`, remember to redeploy or run migrations.

---

## 📂 Project Structure

```bash
/app
  /(roles)         # Role-based pages (Protected)
    /girls         # Student Dashboard & Features
    /women         # Entrepreneur Dashboard
    /customer      # Public Marketplace
    /admin         # Administration
  /api             # Backend API Routes
  /components      # Reusable UI Components
/prisma
  schema.prisma    # Database Models
  seed.ts          # Sample Data Script
/scripts           # Maintenance Tools (Video updates, etc.)
/public            # Static Assets
```

---

## 🤝 Contributing

Contributions are welcome! Please fork the repo and submit a Pull Request.

---

## 📄 License

This project is licensed under the MIT License.
