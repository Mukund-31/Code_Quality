# Code Quality Website

A modern, animated marketing website built with React and GSAP, inspired by CodeRabbit.ai with enhanced animations.

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build tool and dev server
- **GSAP 3** - Advanced animations
- **TailwindCSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons
- **Supabase** - Backend & Authentication

## Getting Started

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── layout/          # Header, Footer, Navigation
│   ├── sections/        # Page sections (Hero, Features, etc.)
│   ├── animations/      # Reusable animation components
│   └── ui/              # UI components (Button, Card, etc.)
├── hooks/               # Custom React hooks
├── utils/               # Utility functions and animation helpers
├── styles/              # Global styles
├── App.jsx              # Main app component
└── main.jsx             # Entry point
```

## Features

- ✨ Advanced GSAP animations with ScrollTrigger
- 🎨 Modern, responsive design with TailwindCSS
- 🚀 Fast development with Vite HMR
- 📱 Mobile-first approach
- 🎭 Smooth page transitions
- 🌙 Dark mode ready
- ♿ Accessibility focused
- 🔐 Full authentication system with Supabase
- 💾 Real-time database integration
- 🔄 Real-time subscriptions

## Animation Patterns

- Scroll-triggered reveals
- Parallax effects
- Staggered animations
- Magnetic hover effects
- Gradient text animations
- 3D card transforms
- Smooth scrolling

## Backend Integration

This project is integrated with **Supabase** for backend functionality:

- **Authentication**: Email/password and OAuth (Google, GitHub)
- **Database**: PostgreSQL with Row Level Security
- **Real-time**: Live data subscriptions
- **Storage**: File uploads (avatars, documents)

### Quick Setup

1. Create a Supabase project at [supabase.com](https://supabase.com)
2. Copy `.env.example` to `.env` and add your credentials
3. Run database migrations from `SUPABASE_SETUP.md`
4. Start developing!

📚 **Full Documentation**: See [SUPABASE_SETUP.md](./SUPABASE_SETUP.md) for complete setup instructions.

## Documentation

- **[SETUP.md](./SETUP.md)** - Project setup and configuration
- **[SUPABASE_SETUP.md](./SUPABASE_SETUP.md)** - Backend integration guide
- **[ANIMATIONS_GUIDE.md](./ANIMATIONS_GUIDE.md)** - GSAP animation reference
- **[COMPONENT_INDEX.md](./COMPONENT_INDEX.md)** - Component documentation
- **[INTEGRATION_SUMMARY.md](./INTEGRATION_SUMMARY.md)** - Quick integration overview

## License

MIT
