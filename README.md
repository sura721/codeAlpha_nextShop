# 🚀 NextShop: The AI-Powered E-Commerce Platform
<p align="center"> <img alt="Next.js" src="https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js"> <img alt="React" src="https://img.shields.io/badge/React-19-blue?style=for-the-badge&logo=react"> <img alt="TypeScript" src="https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript"> <img alt="MongoDB" src="https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb"> <img alt="License: MIT" src="https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge"> </p> <p align="center"> ✨ A modern, full-stack e-commerce platform powered by Next.js, featuring a conversational AI assistant designed to revolutionize the shopping experience. </p> <p align="center"> <a href="https://ping-nextshop.vercel.app" target="_blank"> <img src="https://img.shields.io/badge/🚀 View Live Demo-NextShop-blueviolet?style=for-the-badge"> </a> </p>
✨ Key Features
✅ Conversational AI Assistant

Understands natural language product queries.

Performs advanced searches (e.g., “watches under $30”).

Provides recommendations and assists users while shopping.

✅ Secure Authentication

Social sign-in, passwordless login, and robust session management using Clerk.

✅ Event-Driven Architecture

Background job processing with Inngest for tasks like sending emails and processing orders without blocking the main thread.

✅ Comprehensive Admin Dashboard

Protected admin routes to manage products and view/store orders.

✅ Full-Featured Shopping Cart

Persistent, seamless add-to-cart and checkout experiences.

✅ Order Management & History

Users can view and track all orders from their dashboard.

✅ Modern, Responsive UI

Built with Tailwind CSS and TypeScript for a fast, sleek experience on all devices.

✅ Robust Backend

MongoDB with type-safe data access through Prisma ORM.

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
Follow these steps to set up and run NextShop locally:

Prerequisites
✅ Node.js (v20 or later)
✅ pnpm (or npm/yarn)
✅ MongoDB instance (local or Atlas)

1️⃣ Clone the Repository
 
git clone https://github.com/sura721/codeAlpha_nextShop.git
cd codeAlpha_nextShop
2️⃣ Install Dependencies
 
pnpm install
 or
npm install
3️⃣ Set Up Environment Variables
Create a .env.local file and add:
 
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
4️⃣ Push Prisma Schema
 
pnpm prisma db push
 or
npx prisma db push
5️⃣ Run the Development Server
 
pnpm dev
 or
npm run dev

🌐 Visit Live Site
<p align="center"> <a href="https://ping-nextshop.vercel.app" target="_blank"> <img src="https://img.shields.io/badge/Click Here to View Live Demo-NextShop-blueviolet?style=for-the-badge&logo=vercel"> </a> </p>
🙌 Contributions
Pull requests and issues are welcome!
Feel free to fork the project and contribute.

📞 Contact
📬 Email: surafeladmas721@gmail.com

🌐 Portfolio: [Surafel's Portfolio](https://surafels-portfolio.vercel.app)

💼 LinkedIn: Surafel Admas

📱 Telegram: @sura7_21

📞 Phone: +251 902 663 698
