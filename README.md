# 🍅 Pomodoro Focus

A beautiful, minimalist Pomodoro timer built with Next.js and TypeScript. Designed to help you stay focused and productive.

## Features

- **Timer Modes**: Focus sessions, short breaks, and long breaks
- **Customizable Settings**: Adjust timer durations, session counts, and break intervals
- **Task Management**: Add, complete, and track tasks with pomodoro counts
- **Statistics Dashboard**: Track daily, weekly, and all-time productivity stats
- **Streak Tracking**: Build and maintain focus streaks
- **Audio Notifications**: Multiple sound options with volume control
- **Keyboard Shortcuts**: Quick controls for power users
- **Fullscreen Mode**: Distraction-free focus
- **Dark Theme**: Easy on the eyes for long sessions
- **Responsive Design**: Works on desktop, tablet, and mobile
- **PWA Ready**: Install as a standalone app
- **Local Storage**: All data persists locally

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Start/Pause timer |
| `R` | Reset timer |
| `S` | Toggle settings |
| `T` | Toggle tasks |
| `Esc` | Close panels |

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Animations**: Framer Motion
- **Icons**: Lucide React

## Project Structure

```
src/
├── app/              # Next.js app router pages
├── components/       # React components
├── hooks/            # Custom React hooks
├── lib/              # Utility functions
├── store/            # Zustand store
└── types/            # TypeScript types
```

## License

MIT
