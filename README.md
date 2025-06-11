# CineMatch: A Smart Movie Recommendation App

This is a full-stack web application built with a React frontend and a Django/PostgreSQL backend. It uses machine learning embeddings (via pgvector) to provide semantic search and recommendations for movies.

## Features

- User signup (username, email, password) and JWT-based authentication
- Semantic search for movies based on plot, mood, or themes
- Title-based search
- View movie details, cast, and ratings
- "Like" movies to build a personal list

## Setup and Installation

### Prerequisites

- Python 3.8+
- Node.js and npm
- PostgreSQL with the [pgvector](https://github.com/pgvector/pgvector) extension enabled

### Backend Setup

1.  **Clone the repository:**

2.  **Create a virtual environment and install Python dependencies:**
    ```bash
    python -m venv venv
    source venv/bin/activate  # On Windows, use `venv\Scripts\activate`
    pip install -r backend/requirements.txt
    ```

3.  **Create a `.env` file in the root directory and add your environment variables:**
    ```
    SECRET_KEY='your-django-secret-key'
    DATABASE_URL='postgres://USER:PASSWORD@HOST:PORT/DATABASE_NAME'
    TMDB_API_KEY='your-the-movie-db-api-key'
    ```

4.  **Apply database migrations:**
    ```bash
    cd backend
    python manage.py migrate
    ```

5.  **Run the Django development server:**
    ```bash
    python manage.py runserver
    ```

### Frontend Setup

1.  **Navigate to the frontend directory and install npm packages:**
    ```bash
    cd ../frontend
    npm install
    ```

2.  **Run the React development server:**
    ```bash
    npm start
    ```
