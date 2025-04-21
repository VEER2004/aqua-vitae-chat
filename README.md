
# Aqua Vitae Chat Application

A modern, medical-aesthetic responsive chat application built with React, Tailwind CSS, and a beautiful custom UI.

## Project Structure

```
chat-application/
│
├── index.html                  # Main HTML file (structure of the app)
├── assets/
│   ├── images/                 # Folder for any images/icons you may use
│   └── styles/                 # Folder for CSS files
│       └── main.css            # Main stylesheet for the app
├── js/
│   ├── app.js                  # Main JavaScript logic (client-side WebSocket handling)
│   ├── websocket.js            # WebSocket connection and message handling
│   └── utils.js                # Utility functions like input validation or message formatting
├── server/
│   ├── server.js               # Node.js WebSocket server setup (using 'ws' or 'socket.io')
│   └── routes/                 # Folder for any REST API routes (if applicable)
├── package.json                # Node.js dependencies and scripts
├── README.md                   # Instructions for setup and running the application
└── .gitignore                  # Git ignore file to exclude node_modules, etc.
```

> Note: In this React-based starter, much of the structure is within `src/` but files like `/js/app.js` and `/server/server.js` can be added if/when WebSocket logic is implemented.

---

## Tech Stack

- React + Vite
- TypeScript
- Tailwind CSS (plus custom styles for chat bubbles/cards)
- shadcn-ui & lucide-react icons

---

## Getting Started

1. Install dependencies:  
   `npm install`
2. Run the development server:  
   `npm run dev`
3. App is served at `http://localhost:8080`

---

## To Add WebSocket/Backend functionality

- You can create the `js/` and `server/` folders at project root as per the above structure, using Node.js and your preferred WebSocket library (`ws`/`socket.io`).
