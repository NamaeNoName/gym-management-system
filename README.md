GYMFIT - Full-Stack Management System
1. PROJECT DESCRIPTION (15 pts)

GYMFIT is a comprehensive gym management tool. It allows administrators to manage pricing plans, trainers to track their clients, and users to enroll in memberships.
API Endpoints:

    POST /api/gym/users/login - User authentication

    POST /api/gym/users - New account registration

    GET /api/gym/memberships - View all available plans

    POST /api/gym/memberships - Create new plan (Admin only)

    PATCH /api/gym/users/role - Change user permissions (Admin only)

    GET /api/gym/trainers - List of active trainers

2. BACKEND & AUTHORIZATION (25 pts)

    Architecture: Controller -> Service -> Model structure for clean code.

    Auth: Role-based access control (RBAC).

    Roles:

        Admin: Full system management.

        Trainer: Access to student lists and assigned plans.

        User: Plan browsing and enrollment.

3. FRONTEND & UI/UX (25 pts)

    Structure: Modular React components and organized page routing.

    UI/UX: Interactive forms, real-time data updates, and mobile-friendly navigation.

4. DATABASE & CRUD (15 pts)

The system uses MongoDB Atlas with 3 main collections:

    Users: Account info and role references.

    Memberships: Plan details and pricing.

    Assignments: Relations between users and trainers.

5. INSTALLATION GUIDE
Backend Setup:

    cd backend

    npm install

    Create .env with: MONGO_URI=your_link

    node server.js

Frontend Setup:

    cd frontend

    npm install

    npm run dev

6. TEAM MEMBERS & ROLES (20 pts)

    Samat (NamaeNoName): Frontend.

    Muhammad (okm47): Backend.