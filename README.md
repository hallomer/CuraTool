![CuraTool Banner](Banner.png)

# CuraTool

![Node.js](https://img.shields.io/badge/Node.js-v18-green)
![Express](https://img.shields.io/badge/Express-v4.18.2-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-v6-green)
![Axios](https://img.shields.io/badge/Axios-v1.4-yellow)
![Firebase](https://img.shields.io/badge/Firebase-v9-orange)
![Cohere AI](https://img.shields.io/badge/Cohere_AI-v3.0-blue)
![React](https://img.shields.io/badge/React-v18-blue)
![CSS](https://img.shields.io/badge/CSS-3-blue)


**CuraTool** is a platform empowering healthcare providers and aid organizations to create essential medical equipment from locally available materials when resources are limited, with step-by-step guides, AI-driven support and a collaborative community.


**Deployed Website**: [CuraTool](https://cura-tool.vercel.app/)
  
**Demo Video**: [Watch on YouTube](https://youtu.be/KytSsBOuRl0)

---

## 👩🏾‍💻 Author

**Hiba Eltayeb** 🇸🇩  
[Email](mailto:hebaaltayeb2@icloud.com) | [LinkedIn](https://www.linkedin.com/in/hibaeltayeb/) | [𝕏](https://x.com/Hibathepro)

---

## 🌟 Key Features

- **Step-by-Step DIY Guides**: Organized and easy-to-follow instructions for creating medical equipment, complete with safety tips and downloadable PDFs for offline access.
- **CuraBot - Your AI Assistant**: An AI chatbot powered by Cohere AI that offers real-time support and guidance to users, ensuring they have assistance at every step.
- **Community Support**: A collaborative space where users can share solutions, rate contributions, and connect with others in the community. Google and email login make joining easy and secure.

---

## 🛠️ Technologies Used

**Frontend**: React, CSS, Axios  
**Backend**: Node.js, Express.js, Firebase Authentication, Cohere AI  
**Database**: MongoDB  
**File Handling**: Multer, Cloudinary  
**Deployment**: Vercel (Frontend), Render (Backend)  

---

## 📸 Screenshots

![Screenshot 1](Screenshot0.png)![Screenshot 2](Screenshot1.png)![Screenshot 3](Screenshot2.png)![Screenshot 4](Screenshot3.png)

---

## 🤝 Contributing

Contributions are welcome! To contribute:
1. **Report Issues**: Open an issue on GitHub for any bug reports or feature requests.
2. **Submit Pull Requests**: Fork the repository, make your changes, and submit a pull request. All contributions are appreciated!

---

## 🔧 Setup and Installation

### Prerequisites

Make sure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.

### Cloning the Repository

```bash
git clone https://github.com/hallomer/CuraTool.git
cd CuraTool
```

---

### Backend Setup

1. **Navigate to the Backend Folder**:
   ```bash
   cd backend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Configuration**: Create a `.env` file in the `backend` directory with the following variables:

   ```plaintext
   MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.mongodb.net/<database_name>?retryWrites=true&w=majority
   PORT=5000
   COHERE_API_BASE_URL=https://api.cohere.ai/generate
   COHERE_API_KEY_1=YOUR_COHERE_API_KEY_1
   COHERE_API_KEY_2=YOUR_COHERE_API_KEY_2
   COHERE_API_KEY_3=YOUR_COHERE_API_KEY_3
   FIREBASE_PROJECT_ID=your-firebase-project-id
   FIREBASE_PRIVATE_KEY_ID=your-firebase-private-key-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_PRIVATE_KEY\n-----END PRIVATE KEY-----"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk@your-firebase-project-id.iam.gserviceaccount.com
   FIREBASE_CLIENT_ID=your-firebase-client-id
   FIREBASE_AUTH_URI=https://accounts.google.com/o/oauth2/auth
   FIREBASE_TOKEN_URI=https://oauth2.googleapis.com/token
   FIREBASE_AUTH_PROVIDER_X509_CERT_URL=https://www.googleapis.com/oauth2/v1/certs
   FIREBASE_CLIENT_X509_CERT_URL=https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk@your-firebase-project-id.iam.gserviceaccount.com
   FIREBASE_UNIVERSE_DOMAIN=googleapis.com
   CLOUDINARY_URL=cloudinary://<api_key>:<api_secret>@<cloud_name>
   ```

   **How to get these values:**
   - **MongoDB URI**: Set up a MongoDB database on [MongoDB Atlas](https://www.mongodb.com/atlas/database) and generate a connection string.
   - **Cohere API Keys**: Sign up for a Cohere API account at [cohere.ai](https://cohere.ai/). Once registered, you’ll be able to access your API keys from your dashboard.
   - **Firebase**: Go to [Firebase Console](https://console.firebase.google.com/), create a new project, and generate a service account. Download the private key, and extract `project_id`, `private_key_id`, `private_key`, `client_email`, `client_id`, and other necessary fields.
   - **Cloudinary URL**: Create a Cloudinary account at [cloudinary.com](https://cloudinary.com/) to get your `api_key`, `api_secret`, and `cloud_name`.

4. **Start the Backend Server**:
   ```bash
   node server.js
   ```
   The backend server should now be running on `http://localhost:5000`.

---

### Frontend Setup

1. **Navigate to the Frontend Folder**:
   ```bash
   cd ../frontend
   ```
2. **Install Dependencies**:
   ```bash
   npm install
   ```
3. **Environment Configuration**: Create a `.env` file in the `frontend` directory with the following variables:

   ```plaintext
   REACT_APP_FIREBASE_API_KEY=your-firebase-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=your-firebase-auth-domain
   REACT_APP_FIREBASE_PROJECT_ID=your-firebase-project-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=your-firebase-storage-bucket
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your-firebase-messaging-sender-id
   REACT_APP_FIREBASE_APP_ID=your-firebase-app-id
   REACT_APP_FIREBASE_MEASUREMENT_ID=your-firebase-measurement-id
   REACT_APP_BACKEND_BASE_URL=https://your-backend-url/api/
   REACT_APP_SYMBOL_BASE_URL=https://your-backend-url
   REACT_APP_UPLOADS_BASE_URL=https://your-backend-url/
   ```

   **How to get these values:**
   - **Firebase Configuration**: Go to your Firebase project, navigate to Project Settings, and find the Firebase SDK setup and configuration. Copy the values for `apiKey`, `authDomain`, `projectId`, `storageBucket`, `messagingSenderId`, `appId`, and `measurementId`.
   - **Backend Base URL**: This should be the base URL of your deployed backend. If testing locally, use `http://localhost:5000/api/`.

4. **Start the Frontend Server**:
   ```bash
   npm start
   ```
   The frontend will be running on `http://localhost:3000`.

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).

---
