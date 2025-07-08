# Deduksi Fiksi

A simple library management app for books and authors, built with a Node.js/Express backend and a React frontend.

## Features

- Add, edit, and delete books
- Manage authors
- Mark books as favorite
- Track reading status (plan to read, currently reading, finished)
- Upload book cover images (via URL)

## Folder Structure

```
deduksi-fiksi/
│
├── backend/   # Express + MongoDB API
│   ├── controllers/
│   ├── lib/
│   ├── models/
│   ├── routes/
│   ├── .env
│   ├── index.js
│   └── package.json
│
└── client/    # React frontend (place your React app here)
```

## Getting Started

### Backend

1. **Install dependencies:**
   ```sh
   cd backend
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env` and fill in your MongoDB connection string and client URL.

3. **Run the backend:**
   ```sh
   node index.js
   ```
   The server runs on [http://localhost:3000](http://localhost:3000).

### Frontend

1. **Go to the client folder:**
   ```sh
   cd client
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Create a `.env` file and set `VITE_API_URL` to your backend URL (e.g., `http://localhost:3000`).

4. **Run the frontend:**
   ```sh
   npm run dev
   ```
   The app runs on [http://localhost:5173](http://localhost:5173) by default.

## API Endpoints

### Books

- `GET /book` — Get all books
- `GET /book/:slug` — Get a book by slug
- `POST /book` — Add a new book
- `PUT /book/:id` — Update a book
- `DELETE /book/:id` — Delete a book

### Authors

- `GET /author` — Get all authors
- `GET /author/:id` — Get an author by ID
- `POST /author` — Add a new author
- `DELETE /author/:id` — Delete an author

## Tech Stack

- **Backend:** Node.js, Express, MongoDB, Mongoose
- **Frontend:** React, React Query, Axios, Tailwind CSS

## License

MIT

---
Happy
