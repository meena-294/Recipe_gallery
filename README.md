✨ Enchanted Recipe Gallery

A full-stack recipe browsing application that allows users to explore, search, and view detailed nutrition information for recipes with dynamic image handling powered by Spoonacular API.

🌟 Features

🍽 Browse recipes with pagination

🔍 Advanced search (title, cuisine, rating, calories, total time)

🖼 Automatic image fetching using Spoonacular API

📊 Detailed nutrition information (calories, carbs, cholesterol, etc.)

🎬 Smooth drawer-style recipe detail view

🎨 Modern UI with gradient styling

⚡ Dynamic results per page selection

🛠 Tech Stack
Frontend

React (Vite)

Axios

CSS (Custom styling)

Backend

Flask (Python)

REST API

Pagination & Filtering

External API

Spoonacular API (for recipe images)

📂 Project Structure
recipe-gallery/
│
├── frontend/
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
│
├── backend/
│   ├── app.py
│   ├── routes/
│   └── models/
│
└── README.md
🚀 How It Works

Frontend fetches paginated recipes from Flask backend.

If a recipe does not have an image:

It searches Spoonacular using the recipe title.

If no match is found, it fetches a random Spoonacular recipe image.

Clicking a recipe opens a drawer showing:

Cuisine

Rating

Total time

Description

Nutrition facts

⚙ Installation Guide
🔹 1. Clone Repository
git clone https://github.com/your-username/enchanted-recipe-gallery.git
cd enchanted-recipe-gallery
🔹 2. Backend Setup (Flask)
cd backend
pip install -r requirements.txt
python app.py

Backend runs at:

http://127.0.0.1:5000
🔹 3. Frontend Setup (React + Vite)
cd frontend
npm install
npm run dev

Frontend runs at:

http://localhost:5173
🔐 Environment Variables

⚠ Never expose API keys in frontend for production.

Create a .env file (backend recommended):

SPOONACULAR_API_KEY=your_api_key_here
📊 API Endpoints
Get Recipes (Paginated)
GET /api/recipes?page=1&limit=20
Search Recipes
GET /api/recipes/search?title=cake&rating=4.5
🎯 UI Preview

Card-based grid layout

Drawer detail panel

Gradient theme

Responsive design

🧠 Learning Outcomes

This project demonstrates:

Full-stack integration (React + Flask)

API consumption & dynamic data rendering

Conditional image fetching logic

Pagination implementation

Advanced filtering

State management using React hooks

Asynchronous API handling

⚠ API Rate Limit Notice

Spoonacular free tier has limited requests per day.

For production use:

Move API logic to backend

Cache images in database

Avoid frontend API exposure

📌 Future Improvements

🔄 Backend image caching

❤️ Favorites system

🔑 User authentication

🌍 Deployment (Render / Vercel)

📱 Mobile optimization

🎥 Add recipe instructions section

👩‍💻 Author

Meenakshi D
Full Stack Developer | React | Flask | API Integration

⭐ If You Like This Project

Give it a star ⭐ on GitHub!
