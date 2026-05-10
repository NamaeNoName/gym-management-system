GYMFIT — Management System

A full-stack web application for gym management, featuring role-based access for Admins, Trainers, and Users. Built with the MERN stack (MongoDB, Express, React, Node.js).
Features

    Admin Panel: Create/edit membership plans and manage user roles.

    Trainer Dashboard: View assigned students and their active plans.

    User Interface: Browse and enroll in membership plans with a preferred trainer.

    Authentication: Secure login and registration system.

Installation & Setup
1. Clone the Repository
Bash

git clone https://github.com/NamaeNoName/gym-management-system.git
cd gym-management-system

2. Backend Configuration

    Navigate to the backend folder: cd backend

    Install dependencies: npm install

    Create a .env file in the backend directory and add your MongoDB URI:
    Фрагмент кода

    MONGO_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/gymDB?retryWrites=true&w=majority

    Start the server: node server.js (or npm run dev if nodemon is installed).

3. Frontend Configuration

    Open a new terminal and navigate to the frontend folder: cd frontend

    Install dependencies: npm install

    Start the development server: npm run dev

    Open your browser at http://localhost:5173

MongoDB Setup (Atlas)

This project uses MongoDB Atlas for cloud data storage.

    Create a Cluster: Sign up at mongodb.com and create a free Shared Cluster.

    Database Access: Create a database user with a username and password.

    Network Access: Add IP address 0.0.0.0/0 to allow connection from anywhere.

    Connection String: Click "Connect" -> "Drivers" and copy the connection string into your .env file.

Initial Setup (Adding Users)

Since the database is empty on the first run:

    Register an Admin: Go to the "Create Account" section in the app and register your first user.

    Change Role: By default, new users are assigned the User role. To make yourself an Admin, you can manually change the role field in your MongoDB Atlas collection to Admin.

    Add Trainers: Once you are an Admin, you can change other registered users' roles to Trainer via the Admin Dashboard to test the trainer-student assignment logic.