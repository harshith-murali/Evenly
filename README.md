# Evenly

Evenly is a Splitwise-style expense sharing web app built with Next.js App Router, Clerk, Prisma, PostgreSQL, Tailwind CSS, and Cloudinary.

## Features

- Clerk sign in, sign up, sign out, and profile management
- Protected app routes
- PostgreSQL-backed group creation
- Pending group invitations by email
- Cloudinary receipt upload for expense receipts
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

## Receipt Uploads And Amount Calculation

Cloudinary stores receipt files. Uploading a receipt does not automatically calculate the expense amount right now.

Current flow:

1. The user manually enters the amount.
2. The receipt is uploaded to Cloudinary.
3. The Cloudinary `secure_url` can be stored with the expense as `receiptUrl`.

To calculate the amount automatically from a receipt, the app needs an OCR or AI extraction step after upload. A production flow would be:

1. Upload receipt to Cloudinary.
2. Send the image/PDF URL to an OCR service or vision model.
3. Extract merchant, date, total amount, tax, and line items.
4. Show the extracted amount to the user for confirmation.
5. Save the confirmed amount in integer minor units.

This confirmation step matters because receipt OCR can misread totals, discounts, tips, or multiple tax lines.

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
