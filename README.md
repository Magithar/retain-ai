# Retain AI - Analytics Dashboard

AI-powered product management copilot for live games that transforms gameplay telemetry into actionable retention, monetization, and LiveOps insights.

## 🚀 Tech Stack

- **Framework:** [Next.js 15](https://nextjs.org/) with App Router
- **Language:** [TypeScript](https://www.typescriptlang.org/)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **UI Components:** [shadcn/ui](https://ui.shadcn.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **Theme:** [next-themes](https://github.com/pacocoursey/next-themes)
- **Code Quality:** ESLint + Prettier

## ✨ Features

- ✅ Modern Next.js 15 with App Router and Server Components
- ✅ Full TypeScript support with strict type checking
- ✅ Tailwind CSS v4 with custom theme for analytics dashboards
- ✅ shadcn/ui component library (Button, Card components included)
- ✅ Dark mode support with system preference detection
- ✅ Responsive navigation with active state indicators
- ✅ Sample dashboard with KPI cards and placeholder charts
- ✅ Clean project structure for scalability
- ✅ ESLint and Prettier configured for code quality

## 📁 Project Structure

```
retain-ai/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout with theme provider
│   ├── page.tsx             # Dashboard home page
│   └── globals.css          # Global styles with CSS variables
├── components/              # React components
│   ├── ui/                  # shadcn/ui components
│   │   ├── button.tsx
│   │   └── card.tsx
│   ├── nav.tsx              # Navigation component
│   ├── theme-provider.tsx   # Theme context provider
│   └── theme-toggle.tsx     # Dark mode toggle button
├── lib/                     # Utility functions
│   └── utils.ts             # cn() utility for class merging
├── hooks/                   # Custom React hooks
├── public/                  # Static assets
├── components.json          # shadcn/ui configuration
├── tsconfig.json           # TypeScript configuration
└── tailwind.config.ts      # Tailwind CSS configuration
```

## 🎨 Design System

The dashboard uses a carefully crafted color system optimized for analytics:

### Light Mode
- Background: Clean white (#ffffff)
- Foreground: Dark gray for text
- Primary: Dark for emphasis
- Muted: Light gray for secondary elements

### Dark Mode
- Background: Deep dark (#0a0a0a)
- Foreground: Light gray for text
- Primary: Light for emphasis
- Muted: Medium gray for secondary elements

### Chart Colors
Five distinct colors for data visualization:
- Chart 1: Blue (#3b82f6)
- Chart 2: Green (#10b981)
- Chart 3: Yellow (#f59e0b)
- Chart 4: Purple (#a855f7)
- Chart 5: Red (#ef4444)

## 🛠️ Getting Started

### Prerequisites

- Node.js 18.17 or later
- npm, yarn, or pnpm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/retain-ai.git
cd retain-ai
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check code formatting

## 🎯 Adding New Components

### Using shadcn/ui CLI

Add new components from the shadcn/ui library:

```bash
npx shadcn@latest add [component-name]
```

Example:
```bash
npx shadcn@latest add dialog
npx shadcn@latest add dropdown-menu
npx shadcn@latest add table
```

### Available Components

Popular components for dashboards:
- `badge` - Status indicators
- `dialog` - Modal dialogs
- `dropdown-menu` - Dropdown menus
- `input` - Form inputs
- `label` - Form labels
- `select` - Select dropdowns
- `table` - Data tables
- `tabs` - Tab navigation
- `toast` - Notifications
- `tooltip` - Tooltips

## 🎨 Customization

### Theme Colors

Edit `app/globals.css` to customize the color scheme:

```css
@theme inline {
  --color-primary: 240 5.9% 10%;
  --color-secondary: 240 4.8% 95.9%;
  /* Add more custom colors */
}
```

### Navigation

Edit `components/nav.tsx` to add or modify navigation items:

```typescript
const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Analytics", href: "/analytics", icon: BarChart3 },
  // Add more items
]
```

## 📊 Dashboard Features

The sample dashboard includes:

- **KPI Cards**: Display key metrics with trend indicators
- **Overview Chart**: Placeholder for time-series data visualization
- **Recent Activity**: List of recent user interactions
- **Quick Actions**: Common operations and tasks

## 🔧 Configuration Files

- `components.json` - shadcn/ui configuration
- `tsconfig.json` - TypeScript compiler options
- `eslint.config.mjs` - ESLint rules
- `.prettierrc` - Prettier formatting rules
- `next.config.ts` - Next.js configuration

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Vercel will automatically detect Next.js and configure the build

### Other Platforms

Build the application:
```bash
npm run build
```

The output will be in the `.next` folder. Follow your hosting provider's instructions for deploying Next.js applications.

## 📚 Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [shadcn/ui Documentation](https://ui.shadcn.com)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) - The React Framework
- [shadcn/ui](https://ui.shadcn.com) - Beautiful UI components
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Lucide](https://lucide.dev/) - Beautiful icons
