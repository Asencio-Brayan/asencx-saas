# AsencX Web Interactiva

Multi-tenant SaaS platform for business management systems (Academy, Store, Restaurant, etc.).

## Project Structure

- \`/\`: Root directory containing frontend code (Vite + React).
- \`/server\`: Backend directory (Express + Prisma + PostgreSQL).

## Getting Started

### Prerequisites

- Node.js (v18+)
- PostgreSQL installed and running.

### Installation

1.  **Install dependencies**:
    \`\`\`bash
    npm install
    npm run install:all
    \`\`\`

2.  **Database Setup**:
    - Create a PostgreSQL database (e.g., \`asencx_db\`).
    - Configure environment variables in \`/server/.env\` (see \`/server/.env.example\`).
    - Run DB migrations:
      \`\`\`bash
      cd server
      npx prisma migrate dev --name init
      \`\`\`

3.  **Environment Variables**:
    Create a \`.env\` file in \`/server\` based on \`.env.example\`:

    \`\`\`env
    DATABASE_URL="postgresql://user:password@localhost:5432/asencx_db?schema=public"
    PORT=3000
    JWT_SECRET="your_secret_key"
    
    # Email Config
    ADMIN_EMAIL="admin@yourdomain.com"
    SMTP_HOST="smtp.gmail.com"
    SMTP_PORT=587
    SMTP_USER="your-email@gmail.com"
    SMTP_PASS="your-app-password"
    \`\`\`

### Running the App

Run both frontend and backend concurrently:

\`\`\`bash
npm run dev
\`\`\`

- Frontend: [http://localhost:5173](http://localhost:5173)
- Backend: [http://localhost:3000](http://localhost:3000)

## Features

- **Lead Capture**: Visitors can register for a 7 or 14-day free trial.
- **Email Notifications**: Admins receive email alerts for new leads.
- **WhatsApp Integration**: Automatic WhatsApp link generation for follow-up.

## License

Private.

## Deployment & Environment Variables

### Environment Variables
**Do not commit `.env` files.** Set these variables in your Vercel/Railway dashboard.
- `DATABASE_URL`: Connection string to Neon Postgres.
- `JWT_SECRET`: Secret key for JWT signing.
- `VITE_API_URL`: URL of the backend API (e.g. `https://your-api.railway.app`).

### Vercel Configuration (SPA)
The project uses `vercel.json` to handle Single Page Application routing.
Ensure your Vercel Project Root is set to `/app` (or wherever `package.json` for frontend is).
If you see 404s on refresh, ensure `vercel.json` contains:
```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

### Trial & Password Rotation Logic
- **Trial**: Users in trial are created with `status: ACTIVE` but have a `fechaFin` set to 14 days from creation. The system treats them as "Trial" if their plan is 'FREE' and they have an expiration date.
- **Expiration**: Login is blocked if `fechaFin` has passed, regardless of status.
- **Activation**: When promoting a Trial tenant to a paid plan (via Admin "Edit" or "Convert"), the system **rotates** the password automatically and displays the new one to the Admin for distribution.
