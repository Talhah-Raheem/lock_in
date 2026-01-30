# Lock-In

A focused task management app to help you stay on track and get things done.

## Features

- **Add Tasks** - Quick task creation with due dates
- **Quick Dates** - One-click buttons for Tomorrow and Sunday
- **Edit & Delete** - Inline editing with keyboard shortcuts
- **Undo Delete** - 5-second window to restore deleted tasks
- **Smart Sorting** - Tasks sorted by due date (urgent first)
- **Overdue Alerts** - Visual indicator for past-due tasks
- **Tab Filtering** - Switch between Pending and Completed views
- **Bulk Clear** - Remove all completed tasks at once

## Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS 4](https://tailwindcss.com/) - Styling

## Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to use the app.

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Enter` | Save task while editing |
| `Escape` | Cancel editing |

## Data Storage

Tasks are stored in your browser's localStorage. Data persists across sessions but is local to your browser/device.

## License

MIT
