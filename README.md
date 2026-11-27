🎬 Cineplex — Online Movie Ticket Booking System

A full-stack MERN web application for browsing live movies, selecting seats, booking tickets, and managing cinema listings for Cineplex (Airia Mall, Sector 68, Gurugram).

🌐 Live Deployment Links

Frontend (Vercel): https://frontend-rho-nine-78.vercel.app

Backend API (Render): https://cineplex-backend-ohfi.onrender.com



✨ Key Features

Movie Catalog: Browse 20+ live movies with search and genre filtering.

Interactive Seat Booking: Visual seat selection with real-time price calculation and booking history.

Role-Based Access (USER & ADMIN): Separate customer booking flow and protected admin panel.

Admin Dashboard: Add new movies, delete outdated screenings, and manage user roles directly in MongoDB Atlas.

🛠️ Tech Stack

Frontend: React.js (Vite), Tailwind CSS

Backend: Node.js, Express.js

Database: MongoDB Atlas (Mongoose ODM)

Hosting: Vercel (Frontend) & Render (Backend)

🗄️ Database Collections (MongoDB)

users — _id, name, email (Unique), password, role (USER / ADMIN)

movies — _id, title, genre, duration, showTime, posterPath

bookings — _id, userId (Ref), movieId (Ref), seats, showTime, totalAmount

⚙️ Local Setup

# 1. Clone the repository
git clone https://github.com/deependerdagar/Cineplex.git
cd Cineplex

# 2. Setup Backend
cd backend
npm install
# Create a .env file with MONGO_URI and PORT=5000
npm start

# 3. Setup Frontend (in a new terminal)
cd frontend
npm install
npm run dev


👨‍💻 Author

Deepender Dagar

B.Tech CSE (AI & ML) — K.R. Mangalam University