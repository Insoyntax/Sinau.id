# Sinau.id - Product Specification (PRD)

## 1. Product Overview
**Product Name:** Sinau.id (formerly Learn Tracker)
**Product Type:** Learning Management System (LMS) SaaS
**Tagline:** A premium, modern, and intuitive platform for students and learners to track progress, manage tasks, and stay motivated with an interactive Cyber-Avatar.

### 1.1 Vision
To provide a seamless, aesthetically pleasing, and highly functional learning workspace that empowers users to manage their academic life or self-learning journey with minimal friction. 

### 1.2 Target Audience
- Students (High School, University)
- Self-taught learners
- Anyone needing a structured approach to track their educational progress.

---

## 2. Design System & Aesthetics
**Theme:** "Matte Dark SaaS" 
- **Core Aesthetics:** Premium, minimalist dark mode with subtle accents, glassmorphism elements, and smooth micro-animations.
- **Typography:** Modern sans-serif (e.g., Inter or similar standard).
- **UI Framework:** Radix UI primitives with Tailwind CSS v4 styling.

---

## 3. Core Features & Capabilities

### 3.1 Authentication & User Management (Supabase)
- **Sign Up / Login:** Secure authentication flow using Supabase.
- **Onboarding:** A dedicated onboarding flow to set up user profiles, learning goals, and preferences.
- **Role-Based Access Control:** Secure protected routes ensuring only authenticated users can access the dashboard and core features.

### 3.2 Dashboard
- A centralized hub providing an overview of the user's learning journey.
- Displays upcoming schedule, pending tasks, and recent progress.
- Quick actions to navigate to core modules.

### 3.3 Task Management (Studio/Tugas)
- **Kanban Board:** A fully functional drag-and-drop task management system.
- **Interactions:** Built with `@dnd-kit` for a native-feeling drag-and-drop experience.
- **State Management:** Uses Zustand for real-time optimistic updates on the client side.
- **Data Synchronization:** Syncs with the backend via API endpoints (e.g., `PUT /api/studio/[id]`) to maintain data persistence seamlessly.

### 3.4 Schedule (Jadwal)
- Calendar or list view for upcoming classes, deadlines, and study sessions.
- Ability to add, edit, and delete scheduled items.

### 3.5 Focus Mode (Fokus)
- A dedicated module to assist users during active study sessions.
- Potentially incorporates Pomodoro timers, task-specific focus tracking, and minimal distractions.


### 3.6 Gamification & Cyber-Avatar
- **Virtual Companion:** An interactive Cyber-Avatar that accompanies the user and reflects their learning journey.
- **XP & Leveling:** Users earn Experience Points (XP) for completing tasks, logging activity, and using focus sessions.
- **Daily Streaks:** Encourages consistency by tracking consecutive days of activity, with visual indicators for max streaks.
- **Activity Logs:** Weekly tracking of user engagement and learning patterns to maintain motivation.

---

## 4. Technical Architecture

### 4.1 Frontend Stack
- **Framework:** React 19 + TanStack Start (SSR/CSR hybrid capabilities).
- **Routing:** TanStack Router for type-safe routing.
- **Styling:** Tailwind CSS v4 + `tw-animate-css`.
- **Components:** Radix UI (`@radix-ui/react-*`), Framer Motion (for animations).
- **State Management:** Zustand, TanStack Query (`@tanstack/react-query`).
- **Forms & Validation:** React Hook Form + Zod.

### 4.2 Backend & Data Layer
- **Backend/Database:** Supabase (PostgreSQL, Auth, Realtime).
- **API Strategy:** TanStack Start API routes/server functions for backend logic and database synchronization.

---

## 5. Development Milestones & Future Roadmap
- [x] Phase 1: Rebranding from Learn Tracker to Sinau.id & Matte Dark SaaS design implementation.
- [x] Phase 2: Frontend routing setup (Dashboard, Jadwal, Tugas, Fokus).
- [x] Phase 3: Supabase Authentication integration (Login, Signup, Onboarding).
- [x] Phase 4: Production-ready Kanban board (Tugas) with `@dnd-kit` and optimistic updates.
- [x] Phase 5: Advanced reporting, activity logs, and gamification elements (XP, Streaks, Cyber-Avatar).
- [ ] Phase 6: Mobile application or Progressive Web App (PWA) optimization.
