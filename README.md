# Windows XP in Svelte (Pure JS!)

A Windows XP simulator in browser. With authentication, register, login and create a folder and a notepad archive in documents window. 

![image](https://github.com/user-attachments/assets/a12c90c4-502b-4dec-a0b8-dd087483debe)


## 🚀 Quick Start

- Prerequisites
  - Node.js (version 14 or higher)
  - NPM or Yarn
  - Services Grid
  - Git

## 🛠️ Installation

- Clone the repository

````
  git clone https://github.com/willianctti/windows-xp-svelte
````
  ## 🛠️ Backend Setup

  ````
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Start the server
node server.js
  ````

 ## 🛠️ Frontend Setup

  ````
# In a new terminal, navigate to frontend directory
cd web-desktop

# Install dependencies
npm install

# Start development server
npm run dev
  ````

## 🌟 Features

1. 🔐 User Authentication System
2. 🖥️ Draggable Window Management
3. 📁 File Management System
4. 🌐 Integrated Web Browser
5. ⚙️ System Settings
6. 🪟 Multi-window Support

## 🛠️ Tech Stack

- **Front-end**
  - Svelte
  - Vite
  - Svelte Routing

- **Back-end**
  - Node.js
  - Express
  - SQLite3
  - JWT Authentication
  - BCrypt
  - Cookie-Parser

## 📱 API EndPoints

````
POST /api/auth/login
POST /api/auth/register
GET /api/auth/check
POST /api/auth/logout

POST /api/folders
GET /api/folders
````

## 💻 Development

````
# Backend
cd backend
node server.js

# Frontend (in a separate terminal)
cd web-desktop
npm run dev
````

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Willian - [GitHub](https://github.com/willianctti)

Project Link: [https://github.com/willianctti/windows-xp-svelte]
