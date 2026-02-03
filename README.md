# Hotel Management System - Frontend

This is the React-based frontend for the Hotel Management System Practical Test.

## Tech Stack
- **Framework**: React 19 (Vite)
- **Styling**: Vanilla CSS (Modern design with Glassmorphism)
- **State Management**: React Hooks (useState, useEffect)
- **Networking**: Axios (Custom instance in `src/services/api.js`)
- **Rich Text**: React Quill New

## Features
- **Room Management**:
  - listing with search and sorting.
  - Adding new rooms with dynamic category presets.
  - Multi-image upload with size validation.
- **Incentive Report**:
  - Comprehensive agent performance dashboard.
  - Advanced filtering by Agent, Property Type, Category, and Rating.
  - Detailed breakdown view for each agent's earnings.
  - One-click CSV Export.

## Setup Instructions
1. Navigate to the frontend directory:
   ```bash
   cd hotel-management-system-frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Backend URL:
   - Create a `.env` file from `.env.example` (or ensure `VITE_API_URL` points to your local backend):
   ```env
   VITE_API_URL=http://localhost:3000/api
   ```
4. Start the development server:
   ```bash
   npm run dev
   ```

## Design Principles
- **Aesthetics**: Modern dark-themed interface with translucent elements and smooth transitions.
- **Responsiveness**: Layout adapts to various screen sizes.
- **UX**: Immediate feedback for search, loading states, and form validations.
