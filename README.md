# SAP LeanIX Todo Application

**Version:** 0.0.1  
**Author:** halil ulusoy


## Overview

**SAP LeanIX Todo** is a full-stack TodoList application developed as a home assignment for SAP LeanIX. The application features an Angular-based frontend for an interactive user interface and a Node.js backend powered by Express, TypeORM, and PostgreSQL for robust data management. This project demonstrates modular design, RESTful API practices, and best practices in both frontend and backend development.

## Features

- **Todo Management:** Create, update, delete, and view todos.
- **RESTful API:** Well-structured API endpoints for seamless integration between frontend and backend.
- **Modular Architecture:** Clean separation of concerns with feature-based modules on both frontend and backend.
- **Docker Support:** Easily containerize and deploy the application.
- **AI-Powered Descriptions:** Generate task descriptions automatically using OpenAI integration.
- **Label Management:** Categorize and organize tasks with custom labels.
- **Drag and Drop Interface:** Intuitive UI for task organization and status updates.
- **Batch Order Updates:** Update the order of multiple todos at once.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js:** Version 18 or higher. [Download Node.js](https://nodejs.org/)
- **npm:** Comes bundled with Node.js.
- **Angular CLI:** Required for running the frontend. Install globally using:
  ```bash
  npm install -g @angular/cli
  ```
- **Docker:** For containerization (optional but recommended). [Get Docker](https://docs.docker.com/get-docker/)
- **PostgreSQL:** Version 12 or higher if running locally without Docker.
- **OpenAI API Key:** Required for the AI-powered description generation feature.

## Installation

Follow these steps to get the application up and running:

1. **Clone the repository:**
   ```bash
   git clone https://github.com/hiulusoy/sap-leanix-todo-app.git
   cd sap-leanix-todo-app
   ```

2. **Install server dependencies:**
   ```bash
   npm install
   ```

3. **Install client dependencies:**
   ```bash
   cd client
   npm install
   cd ..
   ```

## Running the Application

### Development Mode

1. **Build & Start the backend server:**
   ```bash
   npm run start
   ```

2. **Start the frontend development server (in a separate terminal):**
   ```bash
   cd client
   npm run start
   ```

3. Access the application at `http://localhost:4200/app/todo/list`

4. Access the backend at `http://localhost:3000/api`

## Docker Setup

The application can be easily containerized and run using Docker:

1. **Set up a PostgreSQL container:**
   ```bash
   docker run --name leanix-postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=leanix_todo -p 5432:5432 -d postgres:14
   ```

Make sure your `.env` file contains these database settings when using Docker:
```
DB_HOST=postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=leanix_todo
```

This setup provides a PostgreSQL database with three default labels (Work, Urgent, Personal) that users can immediately use for organizing their tasks.

## Database Configuration

### Using Docker (Recommended)

The application is configured to connect to a PostgreSQL database. When using Docker as outlined above, the connection is automatically configured.

### Manual Configuration

If you're running the application without Docker, you'll need to:

1. Create a PostgreSQL database
2. Configure connection details in the `.env` file:
   ```
   DB_HOST=localhost
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=your_password
   DB_DATABASE=leanix_todo
   ```

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=your_password
DB_DATABASE=leanix_todo

# Application Settings
PORT=3000
NODE_ENV=development

# OpenAI Configuration
OPENAI_API_KEY=your_openai_api_key
```

## Development Workflow

1. **Run tests:**
   ```bash
   # Run server tests
   npm test
   
   # Run client tests
   cd client
   npm test
   ```


## API Documentation

The application provides a RESTful API with the following endpoints:

### Todo Endpoints
- `GET /api/todos` - List all todos
- `GET /api/todos/:id` - Get a specific todo
- `POST /api/todos` - Create a new todo
- `PUT /api/todos/:id` - Update a todo
- `DELETE /api/todos/:id` - Delete a todo
- `PATCH /api/todos/:id/toggle` - Toggle todo completion status
- `PATCH /api/todos/:id/order` - Update the order of a specific todo
- `POST /api/todos/batch-update-orders` - Update orders of multiple todos in batch
- `POST /api/todos/generate-description` - Generate a description for a todo using AI

### Label Endpoints
- `GET /api/labels` - List all labels
- `POST /api/labels` - Create a new label
- `PUT /api/labels/:id` - Update a label
- `DELETE /api/labels/:id` - Delete a label

## Project Structure

```
sap-leanix-todo-app/
├── client/                    # Angular frontend
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/          # Core modules (auth, layout)
│   │   │   ├── features/      # Feature modules (todo)
│   │   │   ├── shared/        # Shared components
│   │   └── ...
├── server/                    # Node.js backend
│   ├── modules/               # Feature modules
│   │   ├── todo/              # Todo related files
│   │   │   ├── controllers/   # Controllers
│   │   │   ├── entity/        # Database entities
│   │   │   ├── services/      # Business logic
│   │   │   └── routes/        # Route definitions
│   ├── utils/                 # Utility functions
│   └── server.ts              # Server entry point
├── .github/                   # GitHub Actions workflows
├── Dockerfile                 # Docker build instructions
└── package.json               # Root package.json
```

## Testing

The application includes comprehensive tests:

- **Server Tests:** Jest-based unit and integration tests
  ```bash
  npm test
  ```

- **Client Tests:** Karma/Jasmine tests for Angular components
  ```bash
  cd client
  npm test
  ```

## Deployment

The application is configured for deployment to AWS ECS:

1. **Build the Docker image:**
   ```bash
   docker build -t leanix-todo-app .
   ```

2. **Tag and push to ECR:**
   ```bash
   aws ecr get-login-password --region eu-central-1 | docker login --username AWS --password-stdin your-account-id.dkr.ecr.eu-central-1.amazonaws.com
   docker tag leanix-todo-app:latest your-account-id.dkr.ecr.eu-central-1.amazonaws.com/general-container-repo:latest
   docker push your-account-id.dkr.ecr.eu-central-1.amazonaws.com/general-container-repo:latest
   ```

3. The GitHub Actions workflow in `.github/workflows/aws.yml` handles continuous deployment to ECS.

## Troubleshooting

- **Database connection issues:** Ensure PostgreSQL is running and the connection details in `.env` are correct.
- **OpenAI API errors:** Verify your API key is valid and properly set in the environment variables.
- **Docker build failures:** Make sure Docker is installed and running, and you have sufficient permissions.
- **Angular build errors:** Check Node.js version compatibility and ensure all dependencies are installed.

For additional support, please open an issue in the repository.
