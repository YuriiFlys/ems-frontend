# EMS Frontend (Event Management System)

This is the user-facing web application for the Event Management System, built with **Next.js** and **React**. 

## 🚀 Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (Version 16, App Router)
- **Language:** TypeScript
- **UI Library:** [Material UI (MUI)](https://mui.com/)
- **Data Fetching & State:** [TanStack React Query](https://tanstack.com/query/latest)
- **Date Formatting:** [Day.js](https://day.js.org/)
- **Maps Integration:** `@vis.gl/react-google-maps`

## ✨ Features

- **Authentication Flows:** Seamless user registration and login forms with toast notifications.
- **Event Discovery:** Browse, search, and filter available events.
- **Event Management:** Create and edit custom events.
- **Interactive Maps:** View event locations directly on embedded Google Maps.
- **Performant Data Caching:** React Query is used to avoid redundant API calls and keep UI data fresh.

## ⚙️ Setup & Installation

**1. Install dependencies:**

```bash
npm install
```

**2. Environment Configuration:**

Create a `.env.local` file in the root directory to store necessary environment variables such as your backend API base URL or Google Maps API key.

```env
NEXT_PUBLIC_API_URL="http://localhost:3000/api"
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY="your_api_key_here"
```

**3. Running the application:**

Start the development server. By default, it runs on port **7777**.

```bash
npm run dev
```

Open [http://localhost:7777](http://localhost:7777) with your browser to see the result.

**4. Building for Production:**

```bash
npm run build
npm run start
```

## 🏗️ Project Structure

- `src/app/` - Next.js App Router pages (Auth, Events, Profile, etc.).
- `src/context/` - React Context providers (e.g., Toast notifications).
- `src/hooks/` - Custom React hooks (`useToast`, React Query hooks, etc.).
- `src/components/` - Reusable UI components.
