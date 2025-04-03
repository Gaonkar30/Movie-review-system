# Movie Review Application

A full-stack application for managing movies and reviews, built with Spring Boot and React.

## Features

- **Movie Management**
  - View all movies
  - Add new movies (Admin only)
  - Delete movies (Admin only)
  - View movie trailers
  - Movie details with posters and descriptions

- **Review System**
  - View movie reviews
  - Add reviews (Authenticated users)
  - Delete own reviews
  - Public review visibility

- **User Authentication**
  - User registration
  - User login with JWT
  - Role-based access control (Admin/User)
  - Protected routes

## Tech Stack

### Backend
- Java 21
- Spring Boot
- Spring Security with JWT
- MongoDB
- Maven

### Frontend
- React
- React Router
- Axios
- Bootstrap
- Context API for state management

## Architecture

The application follows a layered architecture:

1. **Presentation Layer (Frontend)**
   - React components
   - Context-based state management
   - Protected routes

2. **API Layer (Backend Controllers)**
   - RESTful endpoints
   - Request/Response handling
   - CORS configuration

3. **Service Layer**
   - Business logic
   - Data processing
   - Security implementation

4. **Repository Layer**
   - MongoDB integration
   - Data access
   - CRUD operations

5. **Domain Layer**
   - Entity models
   - Data validation
   - Business rules

## Getting Started

### Prerequisites
- Java 21
- Node.js
- MongoDB
- Maven

### Backend Setup
1. Clone the repository
2. Navigate to the backend directory:
   ```bash
   cd movieapi
   ```
3. Run the application:
   ```bash
   mvn spring-boot:run
   ```

### Frontend Setup
1. Navigate to the frontend directory:
   ```bash
   cd movie_client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## API Endpoints

### Movies
- `GET /api/v1/movies` - Get all movies
- `GET /api/v1/movies/{imdbId}` - Get movie by ID
- `POST /api/v1/movies` - Create new movie (Admin)
- `DELETE /api/v1/movies/{imdbId}` - Delete movie (Admin)

### Reviews
- `GET /api/v1/reviews/movie/{imdbId}` - Get reviews for a movie
- `POST /api/v1/reviews` - Create new review (Authenticated)
- `DELETE /api/v1/reviews/{reviewId}` - Delete review (Owner)

### Users
- `POST /api/v1/users/register` - Register new user
- `POST /api/v1/users/login` - User login
- `POST /api/v1/users/register/admin` - Register admin (Admin only)

## Security Features

- JWT-based authentication
- Password encryption
- Role-based access control
- Protected API endpoints
- CORS configuration
- Secure password storage