## Design System: Retain AI

### Pattern
- **Name:** Real-Time / Operations Landing
- **Conversion Focus:** For ops/security/iot products. Demo or sandbox link. Trust signals.
- **CTA Placement:** Primary CTA in nav + After metrics
- **Color Strategy:** Dark or neutral. Status colors (green/amber/red). Data-dense but scannable.
- **Sections:** 1. Hero (product + live preview or status), 2. Key metrics/indicators, 3. How it works, 4. CTA (Start trial / Contact)

### Style
- **Name:** Data-Dense Dashboard
- **Mode Support:** Light ✓ Full | Dark ✓ Full
- **Keywords:** Multiple charts/widgets, data tables, KPI cards, minimal padding, grid layout, space-efficient, maximum data visibility
- **Best For:** Business intelligence dashboards, financial analytics, enterprise reporting, operational dashboards, data warehousing
- **Performance:** ⚡ Excellent | **Accessibility:** ✓ WCAG AA

### Colors
| Role | Hex | CSS Variable |
|------|-----|--------------|
| Primary | `#1E40AF` | `--color-primary` |
| On Primary | `#FFFFFF` | `--color-on-primary` |
| Secondary | `#3B82F6` | `--color-secondary` |
| Accent/CTA | `#D97706` | `--color-accent` |
| Background | `#F8FAFC` | `--color-background` |
| Foreground | `#1E3A8A` | `--color-foreground` |
| Muted | `#E9EEF6` | `--color-muted` |
| Border | `#DBEAFE` | `--color-border` |
| Destructive | `#DC2626` | `--color-destructive` |
| Ring | `#1E40AF` | `--color-ring` |

*Notes: Blue data + amber highlights [Accent adjusted from #F59E0B for WCAG 3:1]*

### Typography
- **Heading:** Fira Code
- **Body:** Fira Sans
- **Mood:** dashboard, data, analytics, code, technical, precise
- **Best For:** Dashboards, analytics, data visualization, admin panels
- **Google Fonts:** https://fonts.google.com/share?selection.family=Fira+Code:wght@400;500;600;700|Fira+Sans:wght@300;400;500;600;700
- **CSS Import:**
```css
@import url('https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap');
```

### Key Effects
Hover tooltips, chart zoom on click, row highlighting on hover, smooth filter animations, data loading spinners

### Avoid (Anti-patterns)
- Ornate design
- No filtering

### Pre-Delivery Checklist
- [ ] No emojis as icons (use SVG: Heroicons/Lucide)
- [ ] cursor-pointer on all clickable elements
- [ ] Hover states with smooth transitions (150-300ms)
- [ ] Light mode: text contrast 4.5:1 minimum
- [ ] Focus states visible for keyboard nav
- [ ] prefers-reduced-motion respected

---

## Current Implementation (v1.1.0)

### UI Component Library

**shadcn/ui Components** (Radix UI based):
- ✅ **Alert** - User notifications and warnings
- ✅ **Alert Dialog** - Confirmation dialogs with actions
- ✅ **Badge** - Status indicators (High/Medium/Low severity)
- ✅ **Button** - Primary, secondary, outline, ghost variants
- ✅ **Card** - Content containers with header/footer
- ✅ **Progress** - Loading and progress indicators
- ✅ **Table** - Data tables with sorting
- ✅ **Tabs** - Tabbed navigation for insights dashboard

**Custom Components**:
- ✅ **Nav** - Navigation bar with theme toggle
- ✅ **ThemeProvider** - next-themes integration
- ✅ **ThemeToggle** - Dark/light mode switcher
- ✅ **InsightCard** - Individual insight display
- ✅ **InsightsDashboard** - Main analytics dashboard
- ✅ **AnalyticsCharts** - Recharts visualizations
- ✅ **DatasetCapabilityPanel** - Telemetry capability display
- ✅ **LiveOpsEventCard** - Event recommendation cards
- ✅ **LiveOpsRecommendations** - LiveOps panel

### Icon Library
**Lucide React** - Consistent, accessible SVG icons throughout the application

### Animation Library
**Framer Motion** - Smooth transitions and animations for enhanced UX

### Current Theme Implementation

**Dark Mode (Primary)**:
- Background: `hsl(222.2 84% 4.9%)` - Deep blue-black
- Foreground: `hsl(210 40% 98%)` - Near white
- Card: `hsl(222.2 84% 4.9%)` - Matches background
- Primary: `hsl(210 40% 98%)` - Light text
- Accent: `hsl(217.2 91.2% 59.8%)` - Bright blue

**Light Mode (Secondary)**:
- Background: `hsl(0 0% 100%)` - Pure white
- Foreground: `hsl(222.2 84% 4.9%)` - Dark text
- Card: `hsl(0 0% 100%)` - White cards
- Primary: `hsl(222.2 47.4% 11.2%)` - Dark blue
- Accent: `hsl(217.2 91.2% 59.8%)` - Bright blue

### Typography Stack
- **System Font Stack**: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif
- **Monospace**: ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, monospace

### Responsive Breakpoints
- **Mobile**: 375px - 640px
- **Tablet**: 640px - 1024px
- **Desktop**: 1024px - 1440px
- **Wide**: 1440px+

### Accessibility Features
- ✅ WCAG AA compliant color contrast
- ✅ Keyboard navigation support
- ✅ Focus states on all interactive elements
- ✅ Screen reader friendly labels
- ✅ Reduced motion support via `prefers-reduced-motion`
- ✅ Semantic HTML structure

### Performance Optimizations
- ✅ Next.js 16 with React 19
- ✅ Tailwind CSS v4 for minimal CSS bundle
- ✅ Code splitting and lazy loading
- ✅ Optimized images and assets
- ✅ Edge-ready deployment

### Design Patterns Used
1. **Dashboard Pattern** - Data-dense, scannable layout
2. **Card-Based Layout** - Modular, reusable content blocks
3. **Tab Navigation** - Organized insight categories
4. **Progressive Disclosure** - Show details on demand
5. **Status Indicators** - Clear visual hierarchy with badges
6. **Loading States** - Smooth transitions and feedback
7. **Empty States** - Helpful guidance when no data

### Component Status

| Component | Status | Notes |
|-----------|--------|-------|
| Alert | ✅ Complete | Radix UI based |
| Alert Dialog | ✅ Complete | Confirmation dialogs |
| Badge | ✅ Complete | Severity indicators |
| Button | ✅ Complete | Multiple variants |
| Card | ✅ Complete | Content containers |
| Progress | ✅ Complete | Loading indicators |
| Table | ✅ Complete | Data display |
| Tabs | ✅ Complete | Navigation |
| Nav | ✅ Complete | App navigation |
| Theme Toggle | ✅ Complete | Dark/light mode |
| Insights Dashboard | ✅ Complete | Main analytics view |
| Analytics Charts | ✅ Complete | Recharts integration |
| Capability Panel | ✅ Complete | Dataset quality |
| LiveOps Cards | ✅ Complete | Event recommendations |

---

**Last Updated:** 2026-05-17  
**Design System Version:** 1.1.0
- [ ] Responsive: 375px, 768px, 1024px, 1440px