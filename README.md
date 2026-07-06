# Dev Blog

A headless CMS backend powering a developer blog, courses, and services site — built on [Strapi 5](https://strapi.io) with PostgreSQL, GraphQL, Cloudinary media storage, and a custom GitHub Projects plugin.

🔗 **Live API:** [strapi-devblog-w5wp.onrender.com](https://strapi-devblog-w5wp.onrender.com/)

## ✨ Features

- **Blog engine** — posts with rich text content, authors, tags, SEO metadata, drafts, likes, and a custom "role check" policy
- **Site content** — home page, blog/courses landing pages, static pages, header/footer, navigation menu, and company info, all editable from the admin panel
- **GraphQL API** — exposed via `@strapi/plugin-graphql` alongside the standard REST endpoints
- **GitHub Projects plugin** (`@andriibabiuk/github-projects`) — pulls repositories from GitHub and turns them into portfolio/project entries
- **Media uploads** — stored on Cloudinary in production (`@strapi/provider-upload-cloudinary`), with a restricted allow-list of media types
- **Transactional email** — SMTP via `@strapi/provider-email-nodemailer`
- **Users & permissions** — RBAC with refresh-token session management

## 🧱 Tech stack

| Layer      | Technology                                  |
|------------|----------------------------------------------|
| CMS        | Strapi 5 (TypeScript)                        |
| Database   | PostgreSQL (production) / SQLite (local dev) |
| Media      | Cloudinary                                   |
| Email      | SMTP (Nodemailer)                            |
| API        | REST + GraphQL                               |
| Deployment | Render                                       |

## 🚀 Getting started

### Prerequisites

- Node.js `>=20.0.0 <=26.x.x`
- npm or yarn

### Setup

```bash
# install dependencies
yarn install

# copy the environment template and fill in your own values
cp .env.example .env

# start the dev server with autoReload
yarn develop
```

The admin panel will be available at `http://localhost:1337/admin`.

### Available scripts

| Command            | Description                                   |
|---------------------|------------------------------------------------|
| `yarn develop`      | Start Strapi in development mode (autoReload)  |
| `yarn start`        | Start Strapi in production mode                |
| `yarn build`        | Build the admin panel                          |
| `yarn console`      | Open the Strapi console                        |
| `yarn seed:example` | Seed the database with example content         |
| `yarn upgrade`      | Upgrade Strapi to the latest version            |

## 🔑 Environment variables

| Variable                      | Required in       | Description                                  |
|--------------------------------|--------------------|-----------------------------------------------|
| `HOST`, `PORT`                 | all                | Server bind address/port                     |
| `APP_KEYS`                     | all                | Comma-separated Strapi session keys          |
| `API_TOKEN_SALT`               | all                | Salt for API tokens                          |
| `ADMIN_JWT_SECRET`             | all                | Admin panel JWT secret                       |
| `TRANSFER_TOKEN_SALT`          | all                | Salt for data transfer tokens                |
| `JWT_SECRET`                   | all                | End-user (users-permissions) JWT secret      |
| `ENCRYPTION_KEY`               | all                | Encryption key for sensitive fields          |
| `GITHUB_TOKEN`                 | all                | GitHub API token used by the projects plugin |
| `DATABASE_URL`                 | production         | PostgreSQL connection string                 |
| `DATABASE_SSL`                 | production         | Enable SSL for the DB connection (default `true`) |
| `SMTP_HOST` / `SMTP_PORT`      | production         | SMTP server for outgoing email               |
| `SMTP_USERNAME` / `SMTP_PASSWORD` | production      | SMTP credentials                             |
| `CLOUDINARY_NAME` / `CLOUDINARY_KEY` / `CLOUDINARY_SECRET` | production | Cloudinary media storage credentials |
| `RENDER_EXTERNAL_URL`          | production (Render) | Public URL of the deployed service           |
| `PUBLIC_ADMIN_URL`             | production         | Custom admin panel path/URL                  |

See [`.env.example`](.env.example) for the local development template.

## ⚙️ Deployment

This project is configured for deployment on [Render](https://render.com), using environment-specific overrides in [`config/env/production`](config/env/production). Locally it falls back to SQLite so no database setup is required for development.

## 📚 Learn more

- [Strapi documentation](https://docs.strapi.io)
- [Strapi GraphQL plugin](https://docs.strapi.io/dev-docs/plugins/graphql)
- [Render deployment docs](https://render.com/docs)
