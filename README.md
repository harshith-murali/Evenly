# Evenly

Evenly is a Splitwise-style expense sharing web app built with Next.js App Router, Clerk, Prisma, PostgreSQL, Tailwind CSS, and Cloudinary.

## Features

- Clerk sign in, sign up, sign out, and profile management
- Protected app routes
- PostgreSQL-backed group creation
- Pending group invitations by email
- Cloudinary receipt upload for expense receipts
- Claude receipt detail extraction after image upload
- Resend invitation emails
- INR currency formatting
- Empty states for fresh accounts with no groups, expenses, or settlements
- Pure split and settlement utility tests

## Tech Stack

- Next.js 15 with App Router
- TypeScript
- Tailwind CSS
- Clerk authentication
- Prisma
- PostgreSQL / Neon
- Cloudinary signed uploads
- Claude API
- Resend
- Vitest

## Getting Started

Install dependencies:

```bash
npm install
```

Create `.env.local` from `.env.example` and fill in your own keys:

```bash
cp .env.example .env.local
```

Generate Prisma Client and sync the database:

```bash
npx prisma generate
npx prisma db push
```

Start the app:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Groups And Invites

Go to `/groups` and use the “Create group” form. Enter a group name, category, and optional invite emails separated by commas or spaces.

When a group is created:

- the signed-in Clerk user is synced into the `User` table
- the group is saved in PostgreSQL
- the creator is added as an owner in `GroupMember`
- each invite email is saved as a pending `Invitation`

On a group detail page, use the “Invite friends” form to add more pending invitations.

Current invite behavior saves invitations in the database. It does not send emails yet. To send real emails, connect the `Invitation` rows to an email provider such as Resend, Postmark, SendGrid, or Clerk invitations.
With `RESEND_API_KEY` configured, Evenly sends invite emails through Resend. Each email links to `/invite/[token]`, where the invited user can accept the invitation after signing in.

## Receipt Uploads And Amount Calculation

Cloudinary stores receipt files. After an image receipt is uploaded, Evenly sends it to Claude to extract merchant, date, total amount, and category.

Current flow:

1. The receipt is uploaded to Cloudinary.
2. The Cloudinary `secure_url` is sent to `/api/receipts/extract`.
3. The server fetches the image and sends it to Claude.
4. Claude returns structured receipt details.
5. The form fills the merchant, amount, date, and category when Claude can read them.
6. The user reviews and saves the expense.

This confirmation step still matters because receipt OCR/AI can misread totals, discounts, tips, or multiple tax lines. PDF receipt extraction is not enabled yet; the current Claude extraction endpoint supports image receipts.

## Validation

Run tests:

```bash
npm test
```

Build for production:

```bash
npm run build
```

## Security Notes

Do not commit `.env.local`. It contains database, Clerk, and Cloudinary secrets and is ignored by git.
