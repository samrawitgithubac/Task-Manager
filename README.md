📝 Task Management System – Laravel + React

A full-stack Task Management System built with Laravel (API backend) and React + Vite (frontend).
This project is developed as part of an Internship Hiring Test, demonstrating backend API development, authentication, React frontend integration, and application architecture.

🚀 Features
✅ Backend – Laravel API

User Registration & Login (JWT Authentication)

CRUD for Tasks (Create, Read, Update, Delete)

Only authenticated users can manage tasks

Owner-only permission for update & delete

Input validation using Laravel Form Requests

Eloquent ORM for database queries

Unit tests for key endpoints

🖥 Frontend – React

React + Vite application

JWT-based authentication (localStorage)

React Router navigation

Context API / Redux for state management

Login / Register pages

Task List with filtering

Create / Edit Task Form

API communication with Axios

404 Not Found page

Proper validation error handling

🎯 Bonus Features (Optional / If Implemented)

RBAC: Admin sees all tasks; user sees only their tasks

Frontend filtering & sorting by status or due date

Email notifications for task creation/updates

Deployment (Backend: Forge/Heroku; Frontend: Vercel/Netlify)

📁 Project Structure
root/
 ├── task-manager-api/       # Laravel API
 ├── task-manager-frontend/      # React + Vite application
 ├── README.md

⚙️ Backend Setup (Laravel 10+)
1️⃣ Move into backend folder
cd task-manager-api

2️⃣ Install dependencies
composer install

3️⃣ Copy environment file
cp .env.example .env

4️⃣ Set database credentials in .env

Example:

DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=task_manager
DB_USERNAME=root
DB_PASSWORD=

5️⃣ Generate app key
php artisan key:generate

6️⃣ Run migrations
php artisan migrate

7️⃣ Install JWT Auth
composer require tymon/jwt-auth
php artisan vendor:publish --provider="Tymon\JWTAuth\Providers\LaravelServiceProvider"
php artisan jwt:secret

8️⃣ Start the backend server
php artisan serve


Backend runs at:

http://127.0.0.1:8000

🔌 API Endpoints
🔐 Authentication
Method	Endpoint	Description
POST	/api/register	Register new user
POST	/api/login	Login, returns JWT token
📌 Tasks
Method	Endpoint	Description
GET	/api/tasks	List tasks (only authenticated)
POST	/api/tasks	Create task
PUT	/api/tasks/{id}	Update task (owner only)
DELETE	/api/tasks/{id}	Delete task (owner only)
🧪 Running Unit Tests
php artisan test

🌐 Frontend Setup (React + Vite)
1️⃣ Move into frontend folder
cd task-manager-frontend

2️⃣ Install dependencies
npm install

3️⃣ Create .env file
VITE_API_URL=http://127.0.0.1:8000/api

4️⃣ Start frontend dev server
npm run dev


Frontend runs at:

http://localhost:5173

🔒 Authentication Flow

User logs in → backend returns JWT token

Token is stored in localStorage

Axios sends token in Authorization: Bearer <token>

Protected routes require auth

Logout clears token

🖼 Frontend Pages
Page	Description
/login	User login
/register	User registration
/tasks	List all user tasks
/tasks/create	Create a new task
/tasks/:id/edit	Edit existing task
 