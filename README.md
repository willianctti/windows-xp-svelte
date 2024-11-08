# Windows XP with Svelte and JS

A Windows XP simulator in browser. With authentication, register, login, create a folder, create a notepad, RPG Game, Draw in Paint, Code editor with preview and a incredible MSN that works with chat gpt. 
## Usage
![image](https://github.com/user-attachments/assets/81c785c2-802b-4a80-8792-2deb85be17ff)

## RPG Game
![image](https://github.com/user-attachments/assets/fcd0004e-fb72-4087-8b18-1c40dfd915b9)

## Paint
![image](https://github.com/user-attachments/assets/cd581bde-d4d6-4d3d-b51a-598ed239f350)

## Code editor with preview
![image](https://github.com/user-attachments/assets/db6ed0cf-1b1f-4f4c-bc79-48a42e63b07e)


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
7. MSN With ChatGPT

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
