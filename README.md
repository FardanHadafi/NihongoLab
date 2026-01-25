# NihongoLab 🇯🇵

NihongoLab is a modern web application designed to help users learn Japanese effectively. It provides a comprehensive platform for vocabulary management, progress tracking, and interactive learning.

## 🚀 Tech Stack

- **Monorepo:** [Turborepo](https://turbo.build/)
- **Frontend:** [SvelteKit](https://kit.svelte.dev/) (Svelte 5)
- **Backend:** [Hono](https://hono.dev/)
- **Database:** [PostgreSQL](https://www.postgresql.org/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Authentication:** [Better-Auth](https://www.better-auth.com/)
- **Validation:** [Zod](https://zod.dev/)
- **Animations:** [GSAP](https://gsap.com/)
- **Package Manager:** [pnpm](https://pnpm.io/)

## ✨ Features

- **User Authentication:** Secure sign-up and login powered by Better-Auth.
- **Dashboard:** Personalized dashboard to track your learning progress.
- **Vocabulary Management:** Browse and manage your Japanese vocabulary.
- **Learning System:** Interactive modules for learning new words and concepts.
- **Rate Limiting:** Built-in protection for API routes.

## 📁 Project Structure

This monorepo includes the following applications and packages:

### Apps
- `apps/web`: The SvelteKit-based frontend application.
- `apps/api`: The Hono-based backend API.

### Packages
- `packages/db`: Database schema, migrations, and repository implementations using Drizzle ORM.
- `packages/ui`: Shared UI component library.
- `packages/eslint-config`: Shared ESLint configurations.
- `packages/typescript-config`: Shared TypeScript configurations.

## 🛠️ Getting Started

### Prerequisites
- Node.js (>= 18)
- pnpm (>= 10)
- PostgreSQL database

### Installation
1. Clone the repository.
2. Install dependencies:
   ```bash
   pnpm install
   ```
3. Set up environment variables. Create a `.env` file in the root directory and add the necessary variables (e.g., `DATABASE_URL`, `BETTER_AUTH_SECRET`, etc.).

### Development
To start the entire project in development mode:
```bash
pnpm dev
```

To run specific applications:
- **Web:** `pnpm dev:web`
- **API:** `pnpm dev:api`

### Database Management
Commands are executed within the `packages/db` directory or via the root using appropriate filters:
- **Generate Migrations:** `pnpm --filter @nihongolab/db db:generate:migration`
- **Apply Migrations:** `pnpm --filter @nihongolab/db db:migrate`
- **Database Studio:** `pnpm --filter @nihongolab/db db:studio`
- **Seed Database:** `pnpm --filter @nihongolab/db db:seed`

## 📄 License
This project is licensed under the ISC License.
