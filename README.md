# V-Fridge (Virtual Fridge)

**V-Fridge** is an intelligent food management system integrated with Artificial Intelligence (Gemini AI). The application helps users track expiration dates, manage inventory, and receive personalized recipes based on the ingredients currently available in their fridge.

---

## Features

* **AI Chef Assistant:** Recipe generation using **Gemini** that intelligently considers your current inventory.
* **Smart Inventory:** Seamlessly add products with quantity, units of measurement, and expiration date tracking.
* **Self-Destructing History:** Automatic chat history cleanup after 24 hours to ensure privacy and optimize storage.
* **Performance Caching:** Integrated **Redis (Upstash)** for near-instant access to chat history and efficient **Rate Limiting**.
* **Responsive UI:** A modern, mobile-friendly interface built with **Tailwind CSS** and **Shadcn UI**.

---

## Tech Stack

### Frontend
* **Framework:** Next.js 15 (App Router)
* **State Management:** Zustand
* **Styling:** Tailwind CSS + Shadcn UI
* **Validation:** Zod

### Backend & Database
* **Database:** PostgreSQL (Neon DB)
* **ORM:** Drizzle ORM
* **Authentication:** NextAuth.js
* **Caching & Rate Limiting:** Redis (Upstash)
* **AI Integration:** Google Gemini SDK

---

## Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Alter-Saint/V-Fridge/git
    cd V-Fridge/web-platform
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Configure environment variables:**
    Create a `.env.local` file in the root directory and add the following:
    ```env
    DATABASE_URL=your_neon_db_url
    NEXTAUTH_SECRET=your_secret
    GEMINI_API_KEY=your_google_ai_key
    UPSTASH_REDIS_REST_URL=your_redis_url
    UPSTASH_REDIS_REST_TOKEN=your_redis_token
    ```

4.  **Push the database schema:**
    ```bash
    npm run db:push
    ```

5.  **Run the development server:**
    ```bash
    npm run dev
    ```

---

## Security & Optimization

* **Validation:** Robust client-side and server-side data validation using Zod schemas.
* **Rate Limiting:** Protection against API abuse for Gemini endpoints via Upstash middleware.
* **Type Safety:** Fully typed codebase with TypeScript to minimize runtime errors and improve maintainability.

