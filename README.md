# Content Broadcasting System

A modern, role-based content broadcasting platform built with Next.js and Tailwind CSS.

## Key Features

- Role-based Access Control (Teacher, Principal, and Public views)
- Secure Content Upload with real-time validation
- Principal Approval Workflow with detailed feedback mechanisms
- Public Live Pages with high-performance background polling
- Responsive, accessible UI with skeleton loading states
- Clean Service Layer architecture for easy backend integration

## Getting Started

### Prerequisites
- Node.js 18.x or higher
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies: `npm install`
3. Configure environment variables in `.env.local`
4. Start development server: `npm run dev`

The application will be available at http://localhost:3000

## Demo Accounts

| Role | Email | Password |
|------|-------|----------|
| Teacher | teacher@school.com | teacher123 |
| Principal | principal@school.com | principal123 |

Public live broadcast example: `/live/teacher-1`

## API Configuration

To switch from mock data to a real backend, update `.env.local`:

```env
NEXT_PUBLIC_USE_MOCK=false
NEXT_PUBLIC_API_URL=https://your-api-endpoint.com/api
```

## Directory Structure

- `src/app`: Routing and page components
- `src/components`: Reusable UI and feature components
- `src/services`: API abstraction layer
- `src/hooks`: Custom React hooks for data and UI logic
- `src/context`: Global state (Authentication)
- `src/lib`: Shared utilities and constants

## Technical Stack

- Framework: Next.js (App Router)
- Styling: Tailwind CSS
- Validation: React Hook Form + Zod
- Networking: Axios
- Icons: Lucide React
- Notifications: react-hot-toast
- Date Handling: date-fns

## Documentation

Comprehensive architecture notes, including authentication flows and state management decisions, can be found in `Frontend-notes.txt`.
