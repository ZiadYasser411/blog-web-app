# Tutoruu Blog — Next.js + Prisma (MongoDB) + NextAuth (Credentials)

A minimalist, **server-action–driven** blog app with users, posts, comments, likes, and a small service/repository architecture. Built on **Next.js App Router**, **Prisma** (MongoDB), **NextAuth v4 (JWT)**, and **shadcn/ui**.

---

## ✨ Features

- Email/password auth via **NextAuth Credentials** (JWT strategy)
- Users can register/login, edit profile, and delete their account
- CRUD for posts with slugged URLs and tag chips
- Comments on posts
- Likes for posts (and optional likes for comments)
- Optimistic like toggles via **Server Actions**
- Clean separation of concerns:
  - **Repository** — Prisma-only data layer
  - **Service** — business logic & rules
  - **Server Actions** — form/button handlers
  - **UI Components** — shadcn/ui + lucide

---

## 🧱 Stack

- **Next.js** (App Router, RSC, Server Actions)
- **Prisma** + **MongoDB** (provider = "mongodb")
- **NextAuth v4** (Credentials, JWT sessions)
- **shadcn/ui** + **Tailwind CSS**
- **TypeScript**

---

## 🔐 Auth (NextAuth v4 — Credentials + JWT)

- Route: "app/api/auth/[...nextauth]/route.ts"
- Strategy: **JWT**
- authorize: validates email/password (bcrypt)
- Callbacks:
  - jwt → token.id = user.id
  - session → (session.user as any).id = token.id
