# Youth Competency Intelligence Graph 🚀

![Project Status](https://img.shields.io/badge/status-active-success.svg)
![Tech Stack](https://img.shields.io/badge/stack-MERN-blueviolet.svg)

## 📖 Overview

**Youth Competency Intelligence Graph** is an advanced career development platform designed to bridge the gap between education and employability.By leveraging a directed acyclic graph (DAG) structure for skill dependencies, the application provides users with personalized learning paths, role readiness assessments, and AI-driven resource recommendations.

This project goes beyond simple to-do lists by intelligently mapping skills to target roles, visualizing progress through interactive graphs, and assessing cognitive aptitude via an integrated psychometric test suite.

## ✨ Key Features

- **🧠 Intelligent Skill Mapping:** Visualizes skill dependencies using a directed graph (DAG) to generate topologically sorted learning paths.
- **🎯 Role Readiness Tracker:** Real-time percentage tracking of readiness for target roles based on acquired skills.
- **📊 Interactive Dashboard:** robust analytics dashboard displaying aptitude scores, skill progress, and career insights.
- **🔐 Secure Authentication:** Full authentication system with JWT, bcrypt hashing, and Email OTP verification.
- **🧩 Psychometric Assessment:** Integrated cognitive testing module (Numerical, Verbal, Abstract, etc.) with immediate graphical feedback.
- **🤖 Smart Recommendations:** Algorithmic suggestions for learning resources based on individual skill gaps.
- **⚡ Modern State Management:** Scalable frontend architecture using **Redux Toolkit** for global state management.

## 🛠️ Tech Stack

### Frontend
- **Framework:** [React.js](https://reactjs.org/) (Vite)
- **State Management:** [Redux Toolkit](https://redux-toolkit.js.org/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Visualization:** [React Flow](https://reactflow.dev/) & [Dagre.js](https://github.com/dagrejs/dagre) (for auto-layout graphs)
- **Icons:** [Lucide React](https://lucide.dev/)
- **HTTP Client:** Axios

### Backend
- **Runtime:** [Node.js](https://nodejs.org/) & [Express.js](https://expressjs.com/)
- **Database:** [MongoDB](https://www.mongodb.com/) (Mongoose ODM)
- **Authentication:** JWT (JSON Web Tokens) & NodeMailer (OTP)
- **Security:** Bcrypt.js, CORS, Dotenv

## 📂 Project Structure

```bash
├── client/                 # Frontend React Application
│   ├── src/
│   │   ├── components/     # Reusable UI components (Sidebar, Navbar, Layout)
│   │   ├── context/        # (Legacy) Context API implementations
│   │   ├── pages/          # Application Pages (Dashboard, Skills, Learning Path)
│   │   ├── redux/          # Redux Slices (authSlice, dataSlice) & Store
│   │   └── services/       # API integration service
│   └── ...
├── server/                 # Backend Node.js API
│   ├── src/
│   │   ├── controllers/    # Route controllers (Auth, Skills, Recommendations)
│   │   ├── models/         # Mongoose Schemas (User, Skill, OTP, Role)
│   │   ├── routes/         # Express Routes
│   │   └── utils/          # Helpers (EmailSender, OTPGenerator, GraphAlgorithms)
│   └── ...
└── README.md
```

## 🚀 Getting Started

Follow these steps to set up the project locally.

### Prerequisites
- Node.js (v18+ recommended)
- MongoDB (Local or Atlas URI)

### Installation

1.  **Clone the Repository**
    ```bash
    git clone https://github.com/geeky-rish/Youth-Competency-Graph.git
    cd Youth-Competency-Graph
    ```

2.  **Setup Backend**
    ```bash
    cd server
    npm install
    ```
    - Create a `.env` file in the `server` directory:
      ```env
      PORT=3000
      MONGO_URI=your_mongodb_connection_string
      JWT_SECRET=your_jwt_secret_key
      EMAIL_USER=your_email_address
      EMAIL_PASS=your_email_app_password
      ```
    - Seed the database (optional but recommended):
      ```bash
      node seed.js
      ```
    - Start the server:
      ```bash
      npm run dev
      ```

3.  **Setup Frontend**
    ```bash
    cd ../client
    npm install
    ```
    - Start the development server:
      ```bash
      npm run dev
      ```

4.  **Access the Application**
    - Open your browser and navigate to `http://localhost:5173`.

## 🤝 Contributing

Contributions are welcome!! Please fork the repository and submit a pull request for any enhancements!.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request
