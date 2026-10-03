# Didier Luboya portfolio (React + Vite, Node.js, PostgreSQL)

```
client/            React app (Vite): src/App.jsx, src/data.js, src/styles.css, public/photo.jpg
server.js          Express API (POST /api/contact) + serves client/dist
init-db.js         creates the contact_messages table
schema.sql         table definition
```

## Setup (Windows)
1. Create a PostgreSQL database named `portfolio` (pgAdmin: Databases > Create > Database).
2. `npm install`
3. `copy .env.example .env`, then edit `.env` and put your PostgreSQL password in `DATABASE_URL`.
4. `npm run db:init`  (prints "Table ready")
5. `npm run build`
6. `npm start`  then open http://localhost:3001


## Auto-reply email + dashboard

**Email.** When someone sends the form, they get an automatic email saying you will reach out to them, and you get a "new message" alert. Messages are always saved first, so an email problem never loses one.
Gmail setup: Google Account > Security > turn on 2-Step Verification > App passwords > create one. Put the 16 letters in `SMTP_PASS` (no spaces) in `.env`. See `.env.example`.

**Dashboard.** Open http://localhost:3001/admin and sign in with `ADMIN_PASSWORD` from `.env`. You can search, filter (all / unread / handled), read messages, reply by email, mark handled or unread, and delete. The page is not linked from the public site.

**After updating from an older version:** run `npm install`, then `npm run db:init` (adds new columns, keeps your data), then `npm run build`, then `npm start`.

## Customise
- Texts, skills, jobs, services, LinkedIn/Instagram links: `client/src/data.js`
- Photo: replace `client/public/photo.jpg`
- Styles: `client/src/styles.css`
After any change in `client/`, run `npm run build` again.

## Live editing (two terminals)
- `npm start` (API on :3001, or the PORT in .env)
- `npm run dev:client` (React on :5173; edit vite.config.js proxy target if your PORT is not 3000)

## Read messages
pgAdmin: portfolio > Schemas > Tables > contact_messages > View/Edit Data.

## Deploy
Any Node host (e.g. Azure App Service): run `npm run build`, set `DATABASE_URL` (and `PGSSL=true` for managed Postgres), start with `npm start`. Never upload `.env`.
