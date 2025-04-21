# QA Forum

A web-based discussion forum where users can post questions, reply to discussions, and like answers.

## Features

- Post and view questions
- Add answers to questions
- Like answers
- Search and filter questions
- Tag-based organization

## Tech Stack

- Frontend: Angular 16 with Angular Material
- Backend: Node.js with Express and TypeScript
- Database: MySQL

## Prerequisites

- Node.js (v14 or higher)
- MySQL Server
- Angular CLI

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd qa-forum-backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file with the following variables:
    you need to create a new user for this db, instead of using root directly;

    After logging into your sql server, you can do that using below commands,
    
    ```
    CREATE USER 'qauser'@'localhost' IDENTIFIED BY 'password';
    GRANT ALL PRIVILEGES ON database.* TO 'qauser'@'localhost';
    FLUSH PRIVILEGES;
    SHOW GRANTS FOR 'qauser'@'localhost';
    ```

   ```
   PORT=3000
   DB_HOST=localhost
   DB_USER=your_mysql_username
   DB_PASSWORD=your_mysql_password
   DB_NAME=qa_forum
   ```

4. Create the database and tables:
   ```bash
   mysql -u your_mysql_username -p < src/config/schema.sql
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd qa-forum-frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:4200`

## API Endpoints

### Questions
- GET /api/questions - Get all questions
- POST /api/questions - Create a new question
- GET /api/questions/:id - Get a specific question

### Answers
- GET /api/answers/question/:questionId - Get all answers for a question
- POST /api/answers - Post an answer
- PUT /api/answers/:id/like - Like an answer
- DELETE /api/answers/:id - Delete an answer

## Contributing

1. Fork the repository or create PR and document it;