# Project Title

Brief project description goes here.

---

## Table of Contents

1. [Overview](#overview)
2. [Features](#features)
3. [Installation](#installation)
4. [Usage](#usage)
5. [Screenshots](#screenshots)
6. [Technologies Used](#technologies-used)


---
## Overview


The project comprises backend API and frontend UI components. On the backend, it offers authentication services via endpoints for registration and login, using JWT for security. Users manage events by adding, retrieving, updating, and deleting them, with details like name and location. Interactivity is emphasized, allowing users to like or dislike events, stored in the database. The frontend UI facilitates user authentication, event management, and interaction, with personalized views for accessing profiles and event data.

---

## Features

- **Authentication:** Provides endpoints for user registration and login, using JWT for secure authentication.
- **Event Management:** Users can add, retrieve, update, and delete events with details like name, description, and location.
- **Interaction:** Users can like or dislike events, with interactions stored in the database.
- **User-specific Views:** Access own profile and view personalized event data.
---

## Installation

### Prerequisites

- Node.js and npm installed on your local machine for frontend setup.
- Python and pip installed on your local machine for backend setup.
- Django and Django Rest Framework installed globally or in a virtual environment for backend.

### Frontend Setup

1. Clone the repository: `git clone -b frontend <repository-url>`
2. Navigate to the frontend directory: `cd home`
3. Install dependencies: `npm install`
4. Start the development server: `npm start`

### Backend Setup

1. Clone the repository: `git clone -b backend <repository-url>`
2. Navigate to the backend directory: `cd api`
3. Create and activate a virtual environment (optional but recommended): 
    ```
    python -m venv venv
    source venv/bin/activate
    ```
4. Install dependencies: `pip install -r requirements.txt`
5. Apply migrations: `python manage.py migrate`
6. Start the Django development server: `python manage.py runserver`

### Configuration

- Configure frontend to communicate with the backend API by setting the appropriate API base URL.
- Configure backend database settings in `settings.py` according to your database setup.


---

## Usage
The provided project is a full-stack application with features for event management and user interaction. Users can register and log in securely, add, view, update, and delete events, and interact with events by liking or disliking them. Additionally, users have access to personalized views of their own profiles and event data. The project is versatile and can be used as a foundation for various web applications requiring user authentication, event management, and interaction functionalities.

---

## Screenshots

Include screenshots of the application to showcase its appearance and functionality. Leave space for the actual screenshots to be inserted later.

1. [Screenshot 1 - Homepage](#)
   ![Screenshot 1](#)
   
2. [Screenshot 2 - Dashboard](#)
   ![Screenshot 2](#)

---

## Technologies Used

List the main technologies and frameworks used in the project, both on the frontend and backend. Include versions if applicable.

- Frontend:
  - React.js
  - React Router
  - CSS
  - etc.

- Backend:
  - Django
  - Django REST Framework
  - Django Simple JWT
  - MySql
  - etc.

---




