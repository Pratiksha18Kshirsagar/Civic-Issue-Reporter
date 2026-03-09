# 🏙️ Civic Issues Reporter

A robust web application that empowers citizens to report, track, and resolve civic issues in their neighborhoods. It uses geolocation mapping, photo evidence, and an upvote system to bring critical infrastructure problems (like potholes, broken streetlights, or waste dumping) to the attention of local authorities.

To prevent spam, the system implements a nominal payment gateway flow, and encourages civic engagement through a gamified badge system and real-time email alerts.

---

## ✨ Features

### 👤 Citizen App
- **Interactive Map & Geolocation:** Automatically detects user location and displays nearby issues on a Leaflet map. Pinpoint exact issue locations when reporting.
- **Reels-Style Feed:** Scroll through local issues in a modern, mobile-friendly vertical feed.
- **Photo Evidence:** Upload photos of the issue.
- **Spam Prevention:** Integrates Razorpay to charge a nominal ₹1 verification fee before submitting a report.
- **Upvoting System:** Upvote issues to increase their visibility.
- **Gamification:** Users earn badges ("Newbie", "Active Citizen", "Civic Hero") based on the number of issues they help get resolved.
- **Email Alerts:** Automatically notifies nearby citizens via email (using Brevo) when a new issue is reported.

### 🛡️ Admin Dashboard
- **Centralized Map View:** Admins can view all reported issues across the city on an interactive map.
- **Issue Management:** View reporter details, issue impact, and photo evidence.
- **Resolution Proof:** Admins can mark issues as "Resolved" by uploading an "after" image to prove the work was completed.
- **Before/After Showcase:** Resolved issues display a split-screen view of the before and after images to the public.

---

## 🛠️ Tech Stack

**Frontend:**
- HTML5, CSS3, Vanilla JavaScript
- [Leaflet.js](https://leafletjs.com/) (Interactive Maps)
- Axios (API requests)
- Razorpay Checkout SDK

**Backend:**
- Node.js & Express.js
- MongoDB & Mongoose (with `2dsphere` geospatial indexing)
- JWT (JSON Web Tokens) for Authentication

**Integrations & Services:**
- **AWS S3:** Image storage (managed via `multer-s3` and `@aws-sdk/client-s3`)
- **Razorpay:** Payment gateway for spam prevention
- **Brevo (Sendinblue):** SMTP email notification service

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- MongoDB instance running
- AWS S3 Bucket (with access keys configured)
- Razorpay API Keys
- Brevo API Key

### Installation

1. **Clone the repository:**
   \`\`\`bash
   git clone <repository_url>
   cd "Civic Issues Reporter"
   \`\`\`

2. **Backend Setup:**
   Navigate into the backend directory and install dependencies:
   \`\`\`bash
   cd backend
   npm install
   \`\`\`

3. **Environment Variables:**
   Create a \`.env\` file inside the \`backend\` directory and add the following keys:
   \`\`\`env
   PORT=4000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret

   # AWS S3 Configuration
   AWS_ACCESS_KEY_ID=your_aws_access_key
   AWS_SECRET_ACCESS_KEY=your_aws_secret_key
   AWS_REGION=your_aws_region
   AWS_BUCKET_NAME=your_s3_bucket_name

   # Razorpay Configuration
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret

   # Brevo SDK / Email Configuration
   BREVO_API_KEY=your_brevo_api_key
   \`\`\`

4. **Run the Backend Server:**
   \`\`\`bash
   npm start
   \`\`\`
   The backend runs on \`http://localhost:4000\`. On startup, it automatically seeds an initial admin account if one doesn't exist.

5. **Frontend Setup:**
   Simply open the HTML files in the \`frontend/views\` directory (e.g., using Live Server or double-clicking the file).
   - Public View: \`frontend/views/index.html\`
   - Admin Login: \`frontend/views/admin-login.html\`
   - Auth pages: \`login.html\` and \`signup.html\`

---

## 📂 Project Structure

\`\`\`text
Civic Issues Reporter/
├── backend/
│   ├── controllers/      # Route controllers (issues, users, payments)
│   ├── middleware/       # JWT Auth & Admin authorization middlewares
│   ├── models/           # Mongoose schemas (User, Issue)
│   ├── routes/           # Express API routes
│   ├── services/         # Third-party integrations (S3 uploads, Brevo email)
│   ├── utils/            # DB connection, admin seeder
│   ├── app.js            # Main backend entry point
│   └── package.json
└── frontend/
    ├── script/           # Vanilla JS files handling frontend logic
    └── views/            # HTML structure & Embedded CSS
\`\`\`

---

## 🤝 Contributing
Contributions, issues, and feature requests are welcome!

## 📜 License
This project is licensed under the ISC License.
