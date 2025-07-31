
# 🎥 YouTube Clone - MERN Stack Full Project

This is a full-featured YouTube Clone built using the **MERN Stack (MongoDB, Express.js, React.js, Node.js)**. It allows users to create channels, upload videos, like/dislike, comment, and manage their content, replicating major functionalities of YouTube.

## 🚀 Features

- User Authentication with JWT (Login/Register)
- Create and Manage Channels (Avatar, Banner, Description)
- Upload, Edit, and Delete Videos with Thumbnails
- Like, Dislike, and Comment on Videos
- Watch Page with Recommended Videos
- Channel Page with all uploaded videos and details
- Category-based Video Filtering and Search
- Responsive UI (React, CSS)
- Protected Routes and Role-based Access

## 🛠️ Tech Stack

**Frontend:**
- React.js (Vite)
- Redux Toolkit for State Management
- React Router DOM
- CSS Modules

**Backend:**
- Node.js
- Express.js
- MongoDB + Mongoose
- Multer for Image/Video Uploads
- JWT Authentication

## 📁 Project Structure

```
YT-Clone/
├── Backend/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
├── Frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── index.html
└── README.md
```

## 📦 Installation

### Backend Setup

```bash
cd Backend
npm install
npm run dev
```

### Frontend Setup

```bash
cd Frontend
npm install
npm run dev
```

## 🧪 API Endpoints

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/channel/` - Create channel (with image upload)
- `PUT /api/channel/:id` - Edit channel
- `DELETE /api/channel/:id` - Delete channel
- `POST /api/video/` - Upload video
- `PUT /api/video/:id` - Edit video
- `DELETE /api/video/:id` - Delete video
- `GET /api/video/:id` - Get video details
- `GET /api/video/channel/:channelId` - Get all videos by channel
- `GET /api/video/search?q=term` - Search videos by title
- `POST /api/comment/` - Add comment
- `GET /api/comment/video/:videoId` - Get comments for a video

## 🖼️ Screenshots

| Home Page | Watch Page | Channel Page |
|-----------|------------|---------------|
| ![Home](screenshots/home.png) | ![Watch](screenshots/watch.png) | ![Channel](screenshots/channel.png) |

## 🧑‍💻 Author

**Rishabh Arora**  
GitHub: [WebDev-Rishabh](https://github.com/WebDev-Rishabh)

---

> 
