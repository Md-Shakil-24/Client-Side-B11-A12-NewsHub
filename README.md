# 📰 NewsHub - FullStack Newspaper Website

**NewsHub** is a dynamic full-stack newspaper platform that offers trending news, premium content, and publisher management. Built with React, Firebase, Node.js, Express, and MongoDB, this application provides both public and role-based private features, JWT-secured routes, article moderation, subscription system, and data-driven charts.

---

## 🌍 Live Site

🔗 [NewsHub Live](https://news-hub-b11-a12.netlify.app/)

---



## 💡 Key Features

- 📰 **Trending Articles Carousel** based on article views  
- 🧑‍💼 **Publisher Approval System** by admin  
- 👥 **Role-based Access** (Admin, Normal, Premium Users)  
- 🔒 **Firebase Auth + JWT Protection** (localStorage based)  
- ✍️ **Add Article (Single for Normal, Unlimited for Premium)**  
- 🌟 **Premium Article System** with subscription expiry logic  
- 📈 **React Google Charts** (Pie, Bar, Line) in Admin Dashboard  
- 🗃️ **Search & Filter Articles by Tags/Publisher** (Backend-driven)  
- 💸 **Stripe Payment Gateway** for Subscriptions  
- 🕵️‍♂️ **View Count Logic** for Trending Calculation  
- 🛎️ **SweetAlert & Toastify for all interactions**

---

## 🚀 Tech Stack

### Client Side
- ⚛️ React
- 🔐 Firebase Authentication
- 🛣️ React Router DOM
- 💅 TailwindCSS + Daisy UI
- 🎨 AOS / Framer Motion / Lottie
- 📦 React Query (TanStack Query)
- 📊 React Google Charts / CountUp / Typewriter / Select
- 🍞 React Toastify / SweetAlert
- 💳 Stripe.js
- 🌎 React Helmet / React Leaflet (optional)

### Server Side
- 🧰 Node.js + Express.js
- 🌐 MongoDB Atlas
- 🔑 Firebase Admin SDK
- 🛡️ JWT Verification Middleware
- ☁️ Image Hosting: ImgBB or Cloudinary
- 🔍 Search & Filter Logic in Backend

---

## 🔐 Authentication & Authorization

- ✅ Email/Password Sign Up & Login
- 🌐 Google OAuth
- 🔑 Role-based Route Protection (JWT with localStorage)
- 🧾 Custom Error Handling (no default alerts)
- 🚫 404 Not Found Page
- 🔄 Persist Login Across Reloads

---

## 📊 Admin Dashboard

- 👥 All Users (make admin)
- 📄 All Articles (approve/decline/make premium)
- 🏷️ Add Publishers (image + name)
- 📈 Pie Chart of Article Ratio per Publisher
- 📊 Bar & Line Chart with static data
- 📄 Pagination Support on Tables

---

## 🔔 Subscription System

- 🧾 Choose Duration (1 min / 1d / 7d/ 1month)
- 💰 Prices vary by duration
- 🧠 Track subscription with `premiumTaken` timestamp
- 🧼 Auto-expiry check on login
- 💳 Stripe-based payment
- 💬 Homepage modal after 10s encouraging subscription

---

## 📂 Pages Overview

- 🏠 Home (Trending, Publishers, Stats, Plans, +2 Custom Sections)
- ✍️ Add Article (Private)
- 📚 All Articles (Filter/Search/Details)
- 📑 Article Details (Private)
- ⭐ Premium Articles (Private + Premium Only)
- 📦 Subscription (Stripe Payment Modal)
- 📁 My Articles (Update/Delete/Status/Decline Reason)
- 👤 My Profile (Update Info)
- 📊 Dashboard (Admin Only)
- ❌ 404 Not Found Page

---

## 📦 Installation

```bash

npm install


npm install express cors dotenv mongodb firebase-admin



---

## 🧪 NPM Packages Used

```bash
# React Frontend
npm install react-router-dom
npm install firebase
npm install react-icons
npm install react-helmet
npm install framer-motion
npm install swiper
npm install aos
npm install react-toastify
npm install daisyui
npm install tailwindcss
npm install react-awesome-reveal
npm install react-simple-typewriter
npm install lottie-react

# Express Backend
npm install express cors dotenv mongodb
npm install firebase-admin
