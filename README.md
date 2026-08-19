# Mini Design Canvas

A full-stack visual design editor where users can create and manage simple designs using shapes and text. The project uses Next.js and React Konva for the editor and Node.js, Express, and MongoDB for storing canvases.

 1. Project Overview

Mini Design Canvas allows users to:

* Add rectangles, circles, and text
* Move, resize, and rotate elements
* Edit element properties
* Delete and reorder elements
* Undo and redo changes
* Save, load, update, and delete canvases
* Autosave changes
* Export the canvas as a PNG

The project is divided into two parts:

```text
frontend/   → Next.js + React Konva
backend/    → Node.js + Express + MongoDB
```

 2. Technologies Used

### Frontend

* Next.js
* React
* React Konva / Konva
* CSS Modules
* UUID

### Backend

* Node.js
* Express.js
* MongoDB
* Mongoose
* CORS
* dotenv
* Nodemon

 3. Prerequisites

Before running the project, make sure you have:

* Node.js 18+
* npm
* MongoDB (local, Docker, or MongoDB Atlas)
* Two available ports: `3000` and `4000`

## 4. How to Install Dependencies

Install the backend dependencies:

```bash
cd backend
npm install
```

Install the frontend dependencies:

```bash
cd ../frontend
npm install
```

 5. Environment Variables

Create a `.env` file inside `backend/`:

```env
PORT=4000
NODE_ENV=development
MONGODB_URI=your_mongodb_connection_string
CLIENT_ORIGIN=http://localhost:3000
```

Create a `.env.local` file inside `frontend/`:

```env
NEXT_PUBLIC_API_URL=http://localhost:4000/api
```

Do not commit these files to GitHub.

Example environment files are included in the project.

 6. How to Run the Frontend

```bash
cd frontend
npm run dev
```

The frontend will run at:

```text
http://localhost:3000
```

For a production build:

```bash
npm run build
npm start
```

 7. How to Run the Backend

```bash
cd backend
npm run dev
```

The backend will run at:

```text
http://localhost:4000
```

A health check is available at:

```text
http://localhost:4000/api/health
```

For production:

```bash
npm start
```

 8. MongoDB Setup

The project supports both local MongoDB and MongoDB Atlas.

### Local MongoDB

Use:

```env
MONGODB_URI=mongodb://127.0.0.1:27017/mini-design-canvas
```

### MongoDB Atlas

Create a free cluster, create a database user, and use the connection string provided by Atlas:

```env
MONGODB_URI=mongodb+srv://<username>:<password>@<cluster>.mongodb.net/mini-design-canvas
```

No manual collection setup is required. Mongoose creates the collection when data is first saved.

 9. API Endpoints

Base URL:

```text
http://localhost:4000/api
```

| Method | Endpoint        | Description           |
| ------ | --------------- | --------------------- |
| GET    | `/health`       | Check API status      |
| GET    | `/canvases`     | Get all canvases      |
| POST   | `/canvases`     | Create a canvas       |
| GET    | `/canvases/:id` | Get a specific canvas |
| PUT    | `/canvases/:id` | Update a canvas       |
| DELETE | `/canvases/:id` | Delete a canvas       |

 10. Design / Architecture Decisions

The backend follows a simple layered structure:

```text
Routes → Controllers → Services → Models
```

* **Routes** handle API endpoints.
* **Controllers** handle requests and responses.
* **Services** contain database operations.
* **Models** define the MongoDB schema.

On the frontend, `EditorShell` manages the main editor state, while components such as the toolbar, canvas, properties panel, and canvas list handle their respective UI responsibilities.

React Konva is loaded on the client side because Konva depends on browser APIs that are not available during server-side rendering.

 11. Known Limitations

* No authentication or user accounts
* Fixed canvas size
* No automated test suite
* No pagination for saved canvases
* Last save wins if multiple users edit the same canvas simultaneously
* Undo history is limited to 50 steps

These could be improved in a production version.

 12. Bonus Features Implemented

| Feature          | Status |
| ---------------- | ------ |
| Layer management | ✅      |
| Undo / Redo      | ✅      |
| Autosave         | ✅      |
| Export as PNG    | ✅      |
| Authentication   | ❌      |

Conclusion

This project was built to demonstrate a complete full-stack workflow, including interactive canvas editing, REST API development, MongoDB persistence, and frontend-backend integration.
