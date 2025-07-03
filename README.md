NextShop: The AI-Powered E-Commerce Platform


<p align="center">
  <img alt="Next.js" src="https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js">
  <img alt="React" src="https://img.shields.io/badge/React-18-blue?style=for-the-badge&logo=react">
  <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript">
  <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-green?style=for-the-badge&logo=mongodb">
  <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge">
</p>

<p align="center">
  A modern, full-stack e-commerce platform built with Next.js, featuring a highly intelligent conversational AI assistant designed to revolutionize the shopping experience.
</p>

<p align="center">
  <strong><a href="https://ping-nextshop.vercel.app">🚀 View Live Demo</a></strong>
</p>

✨ Key Features
🤖 Conversational AI Assistant
An intelligent chatbot powered by large language models that can:

Understand natural language product queries.

Perform advanced searches with filters (e.g., “watches under $30”).

Provide recommendations and guide users throughout the store.

🔐 Secure Authentication
User authentication and session management handled by Clerk, supporting social sign-in, passwordless login, and robust security.

⚡ Event-Driven Architecture
Utilizes Inngest for reliable background job processing (e.g., sending welcome emails, processing orders) without blocking the main thread.

⚙️ Comprehensive Admin Dashboard
Protected admin routes to manage products, view orders, and oversee operations.

🛍️ Full-Featured Shopping Cart
Persistent cart with seamless add-to-cart and checkout experiences.

📊 Order Management & History
Users can view complete order history and track their orders in their personal dashboard.

✨ Modern, Responsive UI
Beautiful, fast interface using Tailwind CSS and TypeScript for a seamless experience on all devices.

🗃️ Robust Backend
MongoDB database with type-safe data access via Prisma ORM.

🛠️ Tech Stack
Framework: Next.js 15 (App Router)

Styling: Tailwind CSS

Language: TypeScript

Authentication: Clerk

Background Jobs: Inngest

Database: MongoDB

ORM: Prisma

AI: GitHub Models / OpenAI GPT-4.1

Deployment: Vercel (Recommended)

🚀 Getting Started
Follow these steps to set up and run NextShop locally.

Prerequisites
Node.js (v20 or later)

pnpm (or npm / yarn)

MongoDB instance or Atlas

git clone https://github.com/sura721/codeAlpha_nextShop
cd nextshop

pnpm/npm install



enviroment variables
# Database
DATABASE_URL=

# Inngest
INNGEST_EVENT_KEY=
INNGEST_SIGNING_KEY=

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=
CLERK_SECRET_KEY=
NEXT_PUBLIC_CLERK_SIGN_IN_URL=
NEXT_PUBLIC_CLERK_SIGN_IN_FALLBACK_REDIRECT_URL=
NEXT_PUBLIC_CLERK_SIGN_UP_FALLBACK_REDIRECT_URL=

# UploadThing
UPLOADTHING_SECRET=
UPLOADTHING_APP_ID=
UPLOADTHING_TOKEN=

# Chapa
TEST_PUBLIC_KEY=
TEST_SECRET_KEY=
ENCRYPTION_KEY=

# Application
NEXT_PUBLIC_APP_URL=

# AI
GEMINI_API_KEY=
GPT_API_KEY=

# Contacts
LINKEDIN=
TELEGRAM=
PORTFOLIO=
PHONE=
EMAIL=


pnpm/npm prisma db push 
pnpm/npm dev



[🌐 Visit Live Site](https://ping-nextshop.vercel.app)
