Mini Design Canvas

A full-stack visual design editor: create rectangles, circles, and text on a
canvas, move/resize/rotate them, edit their properties, and save/load the
whole composition to MongoDB.


Frontend: Next.js (App Router) + React + React Konva
Backend: Node.js + Express + MongoDB (Mongoose)


Prerequisites

Node.js 18+
A MongoDB instance (local mongod, Docker, or a free MongoDB Atlas cluster)


1. Backend setup

bash
cd backend
cp .env.example .env     
npm install
npm run dev 


2. Frontend setup

bash
cd frontend
cp .env.local.example .env.local   
npm install
npm run dev


Features implemented

Add rectangles, circles, and text to the canvas
Select, drag, resize, and rotate elements (Konva Transformer)
Edit position, size/radius, rotation, fill color, and text content in a
properties panel
Delete the selected element
Layer ordering: bring forward / send backward (Bonus 1)
Undo / redo (Bonus 2)
Autosave toggle — saves automatically 2s after the last change (Bonus 3)
Save (create or update), open a saved canvas, delete a saved canvas
Export the canvas as a PNG (Bonus 5)
