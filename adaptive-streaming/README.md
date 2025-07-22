# Adaptix

Adaptix is a modern video streaming platform featuring **adaptive streaming**—it analyzes each user’s bandwidth in real time and automatically adjusts video quality for the best possible experience. Built with React, Vite, TailwindCSS, and Firebase, Adaptix also offers authentication, personalized dashboards, and secure video streaming.

## Features

- ⚡ **Adaptive Streaming:** Real-time bandwidth analysis and dynamic video quality adjustment for smooth, buffer-free playback.
- 🔒 Authentication (Sign up, Login, Protected Routes)
- 🎬 Video Dashboard and Player
- 🎨 Dark/Light Theme Support
- ☁️ Firebase backend integration
- 🧩 Modular component structure

## Getting Started

### Prerequisites

- Node.js (v18+ recommended)
- npm (v9+ recommended)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/krishaga/Adaptix.git
   cd adaptix
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure Firebase:**
   - Add your Firebase config to `.env` in the `adaptix` directory.
   - Update `firebase.json` and `.firebaserc` as needed.
4. **Start the development server:**
   ```bash
   npm run dev
   ```
5. **Open your browser:**
   Visit [http://localhost:5173](http://localhost:5173)

### Available Scripts

- `npm run dev` – Start development server
- `npm run build` – Build for production
- `npm run preview` – Preview production build
- `npm run lint` – Lint codebase

## Project Structure

```
adaptix/
├── public/                # Static assets
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context providers (Auth, Video, Theme)
│   ├── hooks/             # Custom React hooks
│   ├── pages/             # Main route pages (Home, Dashboard, Watch)
│   ├── services/          # API and Firebase services
│   ├── App.jsx            # App entry point with routing
│   └── main.jsx           # React root render
├── .env                   # Environment variables (Firebase config)
├── package.json           # Project metadata and dependencies
└── tailwind.config.js     # TailwindCSS configuration
```

## Environment Variables

Create a `.env` file in the `adaptix` folder with your Firebase credentials:

```
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_auth_domain
VITE_FIREBASE_PROJECT_ID=your_project_id
...
```

## License

MIT
