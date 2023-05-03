 # T.ND:R 4 N:TFL.X

This project is a full-stack web application built using Node.js with Express.js for the backend and React with Vite for the frontend. Getting Started Prerequisites

Make sure you have Node.js installed on your machine. You can download it from the official website: https://nodejs.org/ 

 ## Installation

Clone the repository to your local machine using Git:

    git clone https://github.com/czffrktln/YourTherapy

Navigate to the project directory:

    cd your-project-name

Navigate to the project backend directory:
    cd server

Install the backend dependencies:
    npm install

Navigate to the frontend directory:

    cd client

Install the frontend dependencies:

    npm install

Create a .env file in the backend directory of the project and add any necessary environment variables.

// example .env file 

    PORT = 8000 
    MONGOURL = mongodb://localhost:27017/my-database 
    JWT_SECRET_KEY = mysupersecretkey 
    CLIENT_ID = a client ID for the OAuth2 application from the Google Developer Console. 
    CLIENT_SECRET = a secret key for the OAuth2 application from the Google Developer Console.
    REDIRECT_URI = http://localhost:5173/callback
    TEST_TOKEN = create a token for testing using the JWT_SECRET_KEY


 ## Usage

Start the backend server:

    npm run build
    npm start

Start the frontend development server:

     npm run dev

Access the frontend by navigating to http://localhost:5173/ in your browser.
