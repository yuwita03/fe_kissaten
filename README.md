# NEKO KISSATEN Frontend

## Project Summary

This frontend is built for a premium coffee shop brand called NEKO KISSATEN, combining e-commerce functionality with a warm, modern café aesthetic inspired by Japanese kissaten culture. The product experience focuses on coffee storytelling, product browsing, cart flow, and admin operations for managing inventory and orders.

## What I Built

- Premium landing page with strong brand narrative and visual hierarchy
- Product catalog with search, category filtering, and pagination
- Responsive product cards and menu experience
- Cart drawer with add, remove, and quantity update flow
- Auth and admin access handling
- Order history page
- Admin dashboard for product management and order review

## Tech Stack

- React 19
- TypeScript
- Vite
- Zustand
- React Router
- Axios
- Tailwind CSS
- Lucide React

## Main Features

### Customer Experience
- Browse featured coffee products and collection highlights
- Search products by name or notes
- Filter by category
- View product details through a curated storefront experience
- Add items to cart and manage quantity dynamically

### Store Management
- Product list fetching from backend
- Error handling and loading states
- Pagination support for catalog data
- Cart persistence using local storage

### Admin Panel
- Product creation, update, and deletion
- Inventory and product form management
- Order overview and status review
- Role-based admin restriction

## Architecture Notes

The frontend is structured to separate concerns clearly:

- Pages for user-facing views
- Stores for global client state
- Services for API communication
- Shared layout components for consistent branding
- Axios interceptor for authentication and unauthorized handling

This keeps the application maintainable and scalable as the business grows.

## Challenges Solved

- Managing complex product and cart state without a heavy framework
- Synchronizing filters, search, and pagination with server requests
- Handling API errors and user feedback in a clean way
- Creating a polished UI that still feels lightweight and fast
- Protecting admin-only functionality with role checks

## Interview Message

This project demonstrates my ability to build a complete frontend experience for a real-world e-commerce business, not just a simple landing page. I focused on UX, state management, API integration, and production-ready structure. The result is a storefront that feels premium, provides clear business value, and is scalable for further product and operational growth.

## Run Locally

1. Install dependencies:
   `npm install`
2. Create a `.env` file if needed and configure the backend URL:
   `VITE_API_URL=http://localhost:3000`
3. Start the app:
   `npm run dev`

## Notes

This project reflects a strong understanding of frontend commerce flows, component design, and user-centered product building that is relevant for real business use cases and technical interviews.
