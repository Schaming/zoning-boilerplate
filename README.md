# Payload Website Template

This is the official [Payload Website Template](https://github.com/payloadcms/payload/blob/main/templates/website). Use it to power websites, blogs, or portfolios from small to enterprise. This repo includes a fully-working backend, enterprise-grade admin panel, and a beautifully designed, production-ready website.

This template is right for you if you are working on:

- A personal or enterprise-grade website, blog, or portfolio
- A content publishing platform with a fully featured publication workflow
- Exploring the capabilities of Payload

Core features:

- [Pre-configured Payload Config](#how-it-works)
- [Authentication](#users-authentication)
- [Access Control](#access-control)
- [Layout Builder](#layout-builder)
- [Draft Preview](#draft-preview)
- [Live Preview](#live-preview)
- [On-demand Revalidation](#on-demand-revalidation)
- [SEO](#seo)
- [Search](#search)
- [Redirects](#redirects)
- [Jobs and Scheduled Publishing](#jobs-and-scheduled-publish)
- [Website](#website)
- [Windows Dev Environment Setup](#windows-development-environment-setup)

## Quick Start

### Prerequisites

Before you begin, you need to install:

1. **Node.js** (v18 or higher)
   - Download from: https://nodejs.org/
   - Check if installed: `node --version`

2. **Docker Desktop**
   - **Mac**: Download from https://www.docker.com/products/docker-desktop/
   - **Windows**: Download from https://www.docker.com/products/docker-desktop/
   - **Linux**: Follow instructions at https://docs.docker.com/desktop/install/linux-install/
   - After installation, **start Docker Desktop** and wait for it to be ready (look for the green "running" indicator)

3. **Git**
   - Download from: https://git-scm.com/downloads
   - Check if installed: `git --version`

### Installation & Setup

Once you have the prerequisites installed, run these commands in your terminal:

```bash
# 1. Clone the repository
git clone <repo-url>

# 2. Navigate to the project folder
cd zoningbylaw

# 3. Copy the environment variables file
cp env.example .env

# 4. Install dependencies (this may take a few minutes)
npm install

# 5. Start the development server (this command does everything!)
npm run dev
```

**That's it!** 🎉

Open [http://localhost:3000](http://localhost:3000) in your browser and follow the on-screen instructions to create your first admin user.

### What Just Happened?

The `npm run dev` command automatically:
- ✅ Starts PostgreSQL database in Docker (if not running)
- ✅ Waits for the database to be ready
- ✅ Runs any pending database migrations
- ✅ Starts the Next.js development server

Changes you make in `./src` will hot-reload instantly in your browser.

### Next Time You Want to Develop

Just run:
```bash
npm run dev
```

That's the only command you need! Everything else is handled automatically.

## Development

### Recommended Setup (Fast)

**Start developing:**
```bash
npm run dev
```

This runs the app natively with the database in Docker. It's fast, with instant hot-reload.

**When you modify collections:**
```bash
npm run migrate:create  # Generate migration from your schema changes
npm run dev             # Restart (runs migration automatically)
```

**Stop the database:**
```bash
npm run db:stop
```

**Reset database (fresh start):**
```bash
npm run db:reset
```

### Full Docker Setup (Optional)

For teams that prefer everything containerized:

```bash
npm run dev:docker
```

This runs both the app and database in Docker. It's slower but more isolated.

### Available Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Start database + run migrations + start dev server |
| `npm run dev:docker` | Run everything in Docker (slower) |
| `npm run db:start` | Start just the database |
| `npm run db:stop` | Stop the database |
| `npm run db:reset` | Drop database and restart fresh |
| `npm run migrate` | Run pending migrations |
| `npm run migrate:create` | Create a new migration |

### Connecting to the Database

**Connection Details:**
- Host: `localhost`
- Port: `5434`
- Database: `zoningbylawdemo`
- Username: `postgres`
- Password: `password` (from `.env`)

Use DBeaver, TablePlus, or any PostgreSQL client.

### Working with Postgres

The project uses PostgreSQL. Data is persisted in a Docker volume (`postgres_data`).

#### Database Migrations

When you modify collections (add/remove fields, change types, etc.), you need to create a migration to update the database schema.

**Workflow for Schema Changes:**

1.  **Make your changes** in `src/collections/` or `src/payload.config.ts`
    - Example: Add a new field to a collection, rename a field, change field type, etc.

2.  **Create a migration:**
    ```bash
    npm run migrate:create
    ```
    - Payload will detect your schema changes and generate a migration file in `src/migrations/`
    - Give it a descriptive name when prompted (e.g., "add_phone_field_to_users")

3.  **Run the migration:**
    ```bash
    npm run migrate
    ```
    - Or just restart your dev server with `npm run dev` (migrations run automatically on startup)

4.  **Commit the migration:**
    ```bash
    git add src/migrations/
    git commit -m "Add phone field to users collection"
    ```

**Other Migration Commands:**

```bash
# Check which migrations have run
npm run migrate:status

# Manually run pending migrations
npm run migrate

# Rollback last migration (use with caution - can lose data!)
npm run payload migrate:down
```

**Team Collaboration:**
- ✅ Migrations are tracked in `src/migrations/` folder - **always commit them to git**
- ✅ When teammates pull new migrations, `npm run dev` automatically runs them
- ✅ This keeps everyone's database schema perfectly in sync
- ⚠️ **Never** edit a migration file that has already been committed - create a new one instead

#### Database Syncing (Team)

To share content between team members without overwriting user accounts:

1.  **Export Data (Dump)**:
    Dump the data excluding the `users` table to avoid overwriting credentials:
    ```bash
    docker-compose exec postgres pg_dump -U postgres -d zoningbylaw --data-only --exclude-table=users > dump.sql
    ```

2.  **Import Data (Restore)**:
    Import the data into your local database:
    ```bash
    cat dump.sql | docker-compose exec -T postgres psql -U postgres -d zoningbylaw
    ```

### Seed

To seed the database with initial data, you can use the admin panel 'seed' functionality or run the seed script if available.

### Troubleshooting

**"Docker is not running":**
- Start Docker Desktop and wait for it to be ready

**Database connection errors:**
- Check if database is running: `docker ps | grep zoningbylaw_db`
- Restart database: `npm run db:stop && npm run db:start`

**Port 5434 already in use:**
- Another Postgres instance is running on that port
- Change port in `docker-compose.db.yml` and `env.example`

**Migrations won't run:**
- Check migration status: `npm run migrate:status`
- View migration files: `ls src/migrations/`

**Need a completely fresh start:**
```bash
npm run db:reset  # Drops database and restarts
```


## How it works

The Payload config is tailored specifically to the needs of most websites. It is pre-configured in the following ways:

### Collections

See the [Collections](https://payloadcms.com/docs/configuration/collections) docs for details on how to extend this functionality.

- #### Users (Authentication)

  Users are auth-enabled collections that have access to the admin panel and unpublished content. See [Access Control](#access-control) for more details.

  For additional help, see the official [Auth Example](https://github.com/payloadcms/payload/tree/main/examples/auth) or the [Authentication](https://payloadcms.com/docs/authentication/overview#authentication-overview) docs.

- #### Posts

  Posts are used to generate blog posts, news articles, or any other type of content that is published over time. All posts are layout builder enabled so you can generate unique layouts for each post using layout-building blocks, see [Layout Builder](#layout-builder) for more details. Posts are also draft-enabled so you can preview them before publishing them to your website, see [Draft Preview](#draft-preview) for more details.

- #### Pages

  All pages are layout builder enabled so you can generate unique layouts for each page using layout-building blocks, see [Layout Builder](#layout-builder) for more details. Pages are also draft-enabled so you can preview them before publishing them to your website, see [Draft Preview](#draft-preview) for more details.

- #### Media

  This is the uploads enabled collection used by pages, posts, and projects to contain media like images, videos, downloads, and other assets. It features pre-configured sizes, focal point and manual resizing to help you manage your pictures.

- #### Categories

  A taxonomy used to group posts together. Categories can be nested inside of one another, for example "News > Technology". See the official [Payload Nested Docs Plugin](https://payloadcms.com/docs/plugins/nested-docs) for more details.

### Globals

See the [Globals](https://payloadcms.com/docs/configuration/globals) docs for details on how to extend this functionality.

- `Header`

  The data required by the header on your front-end like nav links.

- `Footer`

  Same as above but for the footer of your site.

## Access control

Basic access control is setup to limit access to various content based based on publishing status.

- `users`: Users can access the admin panel and create or edit content.
- `posts`: Everyone can access published posts, but only users can create, update, or delete them.
- `pages`: Everyone can access published pages, but only users can create, update, or delete them.

For more details on how to extend this functionality, see the [Payload Access Control](https://payloadcms.com/docs/access-control/overview#access-control) docs.

## Layout Builder

Create unique page layouts for any type of content using a powerful layout builder. This template comes pre-configured with the following layout building blocks:

- Hero
- Content
- Media
- Call To Action
- Archive

Each block is fully designed and built into the front-end website that comes with this template. See [Website](#website) for more details.

## Lexical editor

A deep editorial experience that allows complete freedom to focus just on writing content without breaking out of the flow with support for Payload blocks, media, links and other features provided out of the box. See [Lexical](https://payloadcms.com/docs/rich-text/overview) docs.

## Draft Preview

All posts and pages are draft-enabled so you can preview them before publishing them to your website. To do this, these collections use [Versions](https://payloadcms.com/docs/configuration/collections#versions) with `drafts` set to `true`. This means that when you create a new post, project, or page, it will be saved as a draft and will not be visible on your website until you publish it. This also means that you can preview your draft before publishing it to your website. To do this, we automatically format a custom URL which redirects to your front-end to securely fetch the draft version of your content.

Since the front-end of this template is statically generated, this also means that pages, posts, and projects will need to be regenerated as changes are made to published documents. To do this, we use an `afterChange` hook to regenerate the front-end when a document has changed and its `_status` is `published`.

For more details on how to extend this functionality, see the official [Draft Preview Example](https://github.com/payloadcms/payload/tree/examples/draft-preview).

## Live preview

In addition to draft previews you can also enable live preview to view your end resulting page as you're editing content with full support for SSR rendering. See [Live preview docs](https://payloadcms.com/docs/live-preview/overview) for more details.

## On-demand Revalidation

We've added hooks to collections and globals so that all of your pages, posts, footer, or header changes will automatically be updated in the frontend via on-demand revalidation supported by Nextjs.

> Note: if an image has been changed, for example it's been cropped, you will need to republish the page it's used on in order to be able to revalidate the Nextjs image cache.

## SEO

This template comes pre-configured with the official [Payload SEO Plugin](https://payloadcms.com/docs/plugins/seo) for complete SEO control from the admin panel. All SEO data is fully integrated into the front-end website that comes with this template. See [Website](#website) for more details.

## Search

This template also pre-configured with the official [Payload Search Plugin](https://payloadcms.com/docs/plugins/search) to showcase how SSR search features can easily be implemented into Next.js with Payload. See [Website](#website) for more details.

## Hybrid Semantic Search & AI Summary (RAG)

The project features a specialized hybrid search system for the City's Zoning Bylaws, combining traditional keyword matching with modern AI-powered semantic understanding.

### How it works:

1.  **Hybrid Retrieval**: When a user asks a question, the system searches the PostgreSQL database using three simultaneous methods:
    *   **Semantic Search (Vector)**: Uses OpenAI `text-embedding-3-small` to understand the *meaning* and *intent* behind the query.
    *   **Keyword Search (FTS)**: Uses PostgreSQL Full-Text Search with English stemming to find precise legal terms.
    *   **Fuzzy Matching (Trigrams)**: Uses `pg_trgm` to catch typos and minor spelling variations.
2.  **Weighted Ranking & RRF**: Results are ranked using a weighted scoring system that prioritizes exact title/code matches and applies a "Coincidence Boost" if multiple search methods agree on a result.
3.  **Dynamic Cutoff**: The system automatically filters out "junk" matches by only keeping results that are at least 60% as relevant as the top match.
4.  **AI Summary (RAG)**: The top 15-20 relevant bylaw sections are passed to OpenAI's `gpt-4o-mini`. The AI synthesizes a concise, legally-grounded answer that specifically cites the section codes for every claim made.

### Technical Stack:
- **Database**: PostgreSQL with `pgvector` and `pg_trgm` extensions.
- **Embeddings**: OpenAI `text-embedding-3-small`.
- **LLM**: OpenAI `gpt-4o-mini` for RAG synthesis.
- **Frontend**: React client-side search with real-time AI status updates.

## Redirects

If you are migrating an existing site or moving content to a new URL, you can use the `redirects` collection to create a proper redirect from old URLs to new ones. This will ensure that proper request status codes are returned to search engines and that your users are not left with a broken link. This template comes pre-configured with the official [Payload Redirects Plugin](https://payloadcms.com/docs/plugins/redirects) for complete redirect control from the admin panel. All redirects are fully integrated into the front-end website that comes with this template. See [Website](#website) for more details.

## Jobs and Scheduled Publish

We have configured [Scheduled Publish](https://payloadcms.com/docs/versions/drafts#scheduled-publish) which uses the [jobs queue](https://payloadcms.com/docs/jobs-queue/jobs) in order to publish or unpublish your content on a scheduled time. The tasks are run on a cron schedule and can also be run as a separate instance if needed.

> Note: When deployed on Vercel, depending on the plan tier, you may be limited to daily cron only.

## Website

This template includes a beautifully designed, production-ready front-end built with the [Next.js App Router](https://nextjs.org), served right alongside your Payload app in a instance. This makes it so that you can deploy both your backend and website where you need it.

Core features:

- [Next.js App Router](https://nextjs.org)
- [TypeScript](https://www.typescriptlang.org)
- [React Hook Form](https://react-hook-form.com)
- [Payload Admin Bar](https://github.com/payloadcms/payload/tree/main/packages/admin-bar)
- [TailwindCSS styling](https://tailwindcss.com/)
- [shadcn/ui components](https://ui.shadcn.com/)
- User Accounts and Authentication
- Fully featured blog
- Publication workflow
- Dark mode
- Pre-made layout building blocks
- SEO
- Search
- Redirects
- Live preview

### Cache

Although Next.js includes a robust set of caching strategies out of the box, Payload Cloud proxies and caches all files through Cloudflare using the [Official Cloud Plugin](https://www.npmjs.com/package/@payloadcms/payload-cloud). This means that Next.js caching is not needed and is disabled by default. If you are hosting your app outside of Payload Cloud, you can easily reenable the Next.js caching mechanisms by removing the `no-store` directive from all fetch requests in `./src/app/_api` and then removing all instances of `export const dynamic = 'force-dynamic'` from pages files, such as `./src/app/(pages)/[slug]/page.tsx`. For more details, see the official [Next.js Caching Docs](https://nextjs.org/docs/app/building-your-application/caching).


## Production

To run Payload in production, you need to build and start the Admin panel. To do so, follow these steps:

1. Invoke the `next build` script by running `pnpm build` or `npm run build` in your project root. This creates a `.next` directory with a production-ready admin bundle.
1. Finally run `pnpm start` or `npm run start` to run Node in production and serve Payload from the `.build` directory.
1. When you're ready to go live, see Deployment below for more details.

### Deploying to Vercel

This template can also be deployed to Vercel for free. You can get started by choosing the Vercel DB adapter during the setup of the template or by manually installing and configuring it:

```bash
pnpm add @payloadcms/db-vercel-postgres
```

```ts
// payload.config.ts
import { vercelPostgresAdapter } from '@payloadcms/db-vercel-postgres'

export default buildConfig({
  // ...
  db: vercelPostgresAdapter({
    pool: {
      connectionString: process.env.VECTOR_DATABASE_URL || '',
    },
  }),
  // ...
```

We also support Vercel's blob storage:

```bash
pnpm add @payloadcms/storage-vercel-blob
```

```ts
// payload.config.ts
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

export default buildConfig({
  // ...
  plugins: [
    vercelBlobStorage({
      collections: {
        [Media.slug]: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
  // ...
```

There is also a simplified [one click deploy](https://github.com/payloadcms/payload/tree/templates/with-vercel-postgres) to Vercel should you need it.

### Self-hosting

Before deploying your app, you need to:

1. Ensure your app builds and serves in production. See [Production](#production) for more details.
2. You can then deploy Payload as you would any other Node.js or Next.js application either directly on a VPS, DigitalOcean's Apps Platform, via Coolify or more. More guides coming soon.

You can also deploy your app manually, check out the [deployment documentation](https://payloadcms.com/docs/production/deployment) for full details.

## Questions

If you have any issues or questions, reach out to us on [Discord](https://discord.com/invite/payload) or start a [GitHub discussion](https://github.com/payloadcms/payload/discussions).

### Windows Development Environment Setup

Windows Setup (<strong style="color:red;">in git Bash</strong>)  

-NPM Install in the root directory  

-in bash type "npm config set script-shell "C:\Program Files\Git\bin\bash.exe""

-Make sure docker is running  

-Type in “./scripts/start-db.sh” // starts database  

-then run “npm run build” // starts application  

-to STOP the database “./scripts/stop-db.sh”

