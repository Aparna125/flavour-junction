# Flavour Junction

**Restaurant Smart Feedback Collection and Analysis System**

Flavour Junction is a full-stack web application that lets customers submit structured feedback for a restaurant and gives the admin a dashboard to review it. Each comment is analysed automatically with VADER sentiment analysis and classified as Positive, Negative or Neutral, and the results are shown as charts and statistics.

## Features

**Customer side**
- Responsive public pages: Home, About, Feedback form and a success confirmation page
- Feedback form with five star-rating categories: food quality, service, cleanliness, staff behaviour and overall satisfaction
- Free-text comment, with optional name and email
- Validation on the form and the API

**Admin side**
- Secure admin login (JWT-based authentication)
- Dashboard with summary statistics
- Feedback hub to browse all submitted feedback with its sentiment label
- Analytics page with Chart.js charts (rating averages and sentiment distribution)

**Sentiment analysis**
- A separate Python service uses VADER to score every comment
- Each feedback entry stores a sentiment label (Positive, Negative, Neutral) and the VADER compound score

## Tech stack

| Layer | Technology |
|---|---|
| Frontend | React (Vite), Chart.js |
| Backend | Node.js, Express.js, REST APIs |
| Sentiment service | Python, VADER |
| Database | MySQL |
| Tools | VS Code, Git and GitHub, Postman |
| UI design | Stitch AI |

## Pages

| Route | Description |
|---|---|
| `/` | Home |
| `/about` | About the restaurant |
| `/feedback` | Feedback form |
| `/feedback/success` | Submission confirmation |
| `/admin/login` | Admin login |
| `/admin/dashboard` | Admin dashboard |
| `/admin/feedback` | All feedback |
| `/admin/analytics` | Charts and analytics |

## Architecture

```
React frontend  -->  Express API  -->  MySQL
                         |
                         +--> Python VADER service (/analyze)
```

1. The customer submits the feedback form from the React frontend.
2. The Express backend validates the data and sends the comment to the Python service.
3. The Python service returns a sentiment label and compound score.
4. The backend saves the feedback and its sentiment in MySQL.
5. The admin pages read the stored data through authenticated API calls and display it.

## Database

A single `feedback` table stores all submissions.

| Column | Description |
|---|---|
| `id` | Primary key, auto-increment |
| `name` | Customer name (optional) |
| `email` | Customer email (optional) |
| `food_quality` | Rating, 1 to 5 |
| `service` | Rating, 1 to 5 |
| `cleanliness` | Rating, 1 to 5 |
| `staff_behaviour` | Rating, 1 to 5 |
| `overall_satisfaction` | Rating, 1 to 5 |
| `comment` | Customer comment |
| `sentiment_label` | Positive, Negative or Neutral |
| `sentiment_score` | VADER compound score |
| `created_at` | Submission timestamp |

## Project structure

```
Flavour Junction/
├── backend/             Express API
│   ├── server.js
│   └── .env             (not committed)
├── frontend/            React + Vite app
└── sentiment-service/   Python VADER service
```

Adjust the folder names above to match your repository.

## Getting started

### Prerequisites

- Node.js 18 or later
- Python 3.9 or later
- MySQL 8 or later

### 1. Clone the repository

```bash
git clone https://github.com/Aparna125/flavour-junction.git
cd flavour-junction
```

### 2. Set up the database

Create a database named `flavour_junction` and a `feedback` table with the columns listed above.

### 3. Start the sentiment service

```bash
cd sentiment-service
pip install -r requirements.txt
python app.py
```

It runs on `http://localhost:5001` and exposes `POST /analyze`.

### 4. Start the backend

```bash
cd backend
npm install
npm run dev
```

Create a `.env` file in the `backend` folder (see below). The API runs on `http://localhost:5000`.

### 5. Start the frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:5173`.

## Environment variables

Create `backend/.env`:

```dotenv
PORT=5000
CLIENT_URL=http://localhost:5173

ADMIN_EMAIL=your_admin_email
ADMIN_PASSWORD=your_admin_password
JWT_SECRET=your_long_random_secret

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_mysql_password
DB_NAME=flavour_junction

SENTIMENT_URL=http://localhost:5001/analyze
```

Never commit your `.env` file. Make sure it is listed in `.gitignore`.

If you deploy the frontend (for example on Vercel), add a single variable there:

```dotenv
VITE_API_URL=https://your-backend-url
```

## Future enhancements

- Store admin accounts in the database with hashed passwords
- Email notifications for negative feedback
- Export feedback and analytics reports to PDF or CSV
- Date-range filters and trend analysis
- Multi-branch support

## Author

**Aparna R**
B.Tech Computer Science and Engineering, Government College of Engineering Kannur
