# MockMate – Mentor-Based Mock Interview Platform

MockMate is a web application that connects students with experienced mentors for affordable mock interviews. It helps students build interview confidence, practice technical skills, and receive personalized feedback before attending real job interviews.

## Problem Statement

Many students struggle with interview anxiety and lack access to experienced professionals who can guide them through realistic interview experiences. Professional interview preparation can also be expensive.

MockMate aims to make interview preparation more accessible by connecting students with mentors at affordable prices.

## Key Features

### For Students
- **User Authentication:** Register and log in as a student.
- **Mentor Discovery:** Browse available mentors and view their professional profiles, skills, and session fees.
- **Interview Booking:** Request interview sessions by selecting a date and time.
- **Booking Management:** View booking status and manage interview sessions.
- **Mock Interviews:** Join interview sessions through the platform.
- **Personalized Feedback:** Receive ratings, strengths, areas for improvement, and suggestions from mentors.

### For Mentors
- **Mentor Dashboard:** View an overview of sessions and earnings-related session fees.
- **Profile Management:** Update professional title, company, skills, and session price.
- **Booking Management:** Accept or cancel pending interview requests.
- **Interview Feedback:** Submit ratings and detailed feedback after interviews.
- **Credentials and Resources:** Upload certificates, professional credentials, and interview preparation documents.

## Technology Stack

**Frontend**
- React.js
- JavaScript
- HTML and CSS
- Axios
- React Router

**Backend**
- Node.js
- Express.js
- REST APIs

**Database**
- MongoDB
- Mongoose

**Additional Technologies**
- Socket.IO and WebRTC for real-time communication
- Cloudinary for document uploads
- Render for deployment

## Application Workflow

1. Students and mentors register or log in.
2. Students browse mentor profiles and choose a suitable mentor.
3. Students request an interview session.
4. Mentors accept or cancel booking requests.
5. Students and mentors join confirmed interview sessions.
6. Mentors submit feedback after the interview.
7. Students can use the feedback to improve their interview performance.

## Getting Started

### Prerequisites
- Node.js and npm
- MongoDB database
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Aaryan-2426/VideoCall.git
cd VideoCall
```

### 2. Set Up the Backend

```bash
cd backend
npm install
```

Create a `.env` file inside the `backend` directory and configure the required environment variables:

```env
PORT=8000
MONGO_URI=your_mongodb_connection_string
GROQ_API_KEY=your_groq_api_key
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret
```

Replace the example values with your own credentials. Never commit your `.env` file or expose secret keys publicly.

Start the backend using the appropriate script defined in `backend/package.json`.

### 3. Set Up the Frontend

Open another terminal:

```bash
cd frontend
npm install
```

Start the frontend using the appropriate script defined in `frontend/package.json`.

### 4. Open the Application

Open the local URL printed by the frontend development server in your browser.

## Project Structure

```text
VideoCall/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── app.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── pages/
│   │   ├── utils/
│   │   └── App.css
│   └── package.json
│
└── README.md
```

## Future Enhancements

- Integrated online payments
- Mentor availability calendar and automated scheduling
- Student feedback history and performance tracking
- Verified mentor credentials
- Improved interview analytics and progress reports

## Deployment

The application is deployed using Render.

- **Frontend:** https://tricity-frontend.onrender.com
- **Backend:** https://tricity-backend.onrender.com

## Contributors

Developed as a team project to make interview preparation more affordable, accessible, and practical for students.

## License

This project is intended for educational and demonstration purposes.
