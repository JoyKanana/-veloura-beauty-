# Veloura Beauty

Veloura Beauty is a beginner-friendly React e-commerce administration dashboard for managing beauty and skincare products. It is designed as an internal admin tool (not a customer-facing shop) where an administrator can view, search, add, edit, and delete products using a mock REST API powered by JSON Server.

## Project Description and Purpose

This project demonstrates core React concepts in a practical admin dashboard:
- Component-based UI structure
- Client-side routing with React Router
- Shared state with React Context and a custom hook
- CRUD operations using the Fetch API
- Form handling and validation
- Automated testing with Vitest and React Testing Library

The interface follows a clean, minimal beauty-brand style with a white background, blush pink accents, charcoal text, and responsive layouts.

## Features and Functionality

- **Dashboard (`/`)**
  - Welcome message
  - Total products, in-stock products, and out-of-stock products (derived from live data)
  - Recently added products (latest 4)
  - Quick navigation to Products and Add Product
- **Products (`/products`)**
  - Product list with image, name, category, price, and stock quantity
  - Search products by name (dynamic)
  - Filter by category and stock status (All / In Stock / Out of Stock)
  - Clear filters option
  - View details and edit actions for each product
  - Loading, error, empty, and no-results states
- **Add Product (`/products/new`)**
  - Reusable product form (name, description, category, price, stock quantity, image URL)
  - Validation with helpful error messages (required fields, price > 0, stock >= 0)
  - Creates products via API and redirects to the product list on success
- **Product Details (`/products/:id`)**
  - Displays full product information
  - Edit and delete actions (delete requires confirmation)
  - Loading, not-found, and error handling
- **Edit Product (`/products/:id/edit`)**
  - Pre-filled reusable form for updating all fields
  - Saves updates via API and redirects to product details on success
- **Navigation & UX**
  - Responsive layout with navbar and sidebar
  - 404 Not Found fallback route

## Technologies Used

- **React** (with Vite)
- **JavaScript (JSX)**
- **React Router DOM** (routing)
- **CSS** (custom styling)
- **JSON Server** (mock REST API)
- **Fetch API** (HTTP requests)
- **Vitest** and **React Testing Library** (with `jest-dom` and `user-event`) for testing
- **ESLint** for linting

## Project Folder Structure

```text
.
├── db.json
├── index.html
├── package.json
├── vite.config.js
├── eslint.config.js
├── public/
└── src/
    ├── App.jsx
    ├── main.jsx
    ├── setupTests.js
    ├── assets/
    ├── components/
    │   ├── Layout.jsx
    │   ├── Navbar.jsx
    │   ├── Sidebar.jsx
    │   ├── ProductCard.jsx
    │   ├── ProductForm.jsx
    │   └── SearchBar.jsx
    ├── pages/
    │   ├── Dashboard.jsx
    │   ├── Products.jsx
    │   ├── AddProduct.jsx
    │   ├── ProductDetails.jsx
    │   ├── EditProduct.jsx
    │   └── NotFound.jsx
    ├── context/
    │   └── ProductContext.jsx
    ├── hooks/
    │   └── useProducts.js
    ├── styles/
    │   └── global.css
    └── __tests__/
        ├── ProductForm.test.jsx
        ├── Dashboard.test.jsx
        ├── Products.test.jsx
        ├── AddProduct.test.jsx
        ├── ProductDetails.test.jsx
        └── EditProduct.test.jsx
```

## Installation Instructions

1. **Prerequisites:** Node.js and npm installed.
2. **Install dependencies:**

   ```bash
   npm install
   ```

## Running the Application

This app requires both the React dev server and JSON Server to be running.

### 1. Start JSON Server (separate terminal)

```bash
npm run server
```

- Starts JSON Server at `http://localhost:3001`
- Watches `db.json` for changes
- Products endpoint: `http://localhost:3001/products`

### 2. Start the React development server (separate terminal)

```bash
npm run dev
```

- Starts Vite dev server (URL shown in terminal, typically `http://localhost:5173`)
- Keep JSON Server running so the app can load and manage products

## Running Automated Tests

```bash
npm test -- --run
```

- Runs the Vitest test suite once (non-watch mode)
- Component/page tests mock API responses and do not require JSON Server

## Building for Production

```bash
npm run build
```

- Creates an optimized production build in the `dist/` folder

To preview the production build locally:

```bash
npm run preview
```

## API Endpoints Supported

The application uses JSON Server with the base URL `http://localhost:3001`.

| Method | Endpoint          | Description              |
|--------|-------------------|--------------------------|
| GET    | `/products`       | Fetch all products       |
| GET    | `/products/:id`   | Fetch a single product   |
| POST   | `/products`       | Create a new product     |
| PATCH  | `/products/:id`   | Update an existing product |
| DELETE | `/products/:id`   | Delete a product         |

## Contributors

- Add contributor names here (if applicable)
