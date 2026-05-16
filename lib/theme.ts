/**
 * Retain AI Design System - Centralized Theme Tokens
 * 
 * Official design system for premium AI-powered analytics platform.
 * Inspired by Linear, Vercel, Amplitude, and DataDog.
 */

export const colors = {
  // Background
  background: '#000000',
  
  // Card & Surface
  card: '#121826',
  
  // Borders & Dividers
  border: '#1f2937',
  
  // Primary Accent (use sparingly)
  primary: '#59c378',
  primaryHover: '#6dd389',
  primaryMuted: 'rgba(89, 195, 120, 0.1)',
  primaryGlow: 'rgba(89, 195, 120, 0.2)',
  
  // Text
  text: '#f8fafc',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  
  // Status Colors
  danger: '#ef4444',
  dangerMuted: 'rgba(239, 68, 68, 0.1)',
  warning: '#f59e0b',
  warningMuted: 'rgba(245, 158, 11, 0.1)',
  info: '#3b82f6',
  infoMuted: 'rgba(59, 130, 246, 0.1)',
  success: '#59c378',
  successMuted: 'rgba(89, 195, 120, 0.1)',
  
  // Chart Colors
  chart: {
    primary: '#59c378',
    secondary: '#3b82f6',
    tertiary: '#f59e0b',
    quaternary: '#8b5cf6',
    danger: '#ef4444',
  }
} as const;

export const spacing = {
  xs: '0.25rem',    // 4px
  sm: '0.5rem',     // 8px
  md: '1rem',       // 16px
  lg: '1.5rem',     // 24px
  xl: '2rem',       // 32px
  '2xl': '3rem',    // 48px
  '3xl': '4rem',    // 64px
} as const;

export const radius = {
  sm: '0.375rem',   // 6px
  md: '0.5rem',     // 8px
  lg: '0.75rem',    // 12px
  xl: '1rem',       // 16px
  full: '9999px',
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  glow: '0 0 20px rgba(89, 195, 120, 0.15)',
  glowStrong: '0 0 30px rgba(89, 195, 120, 0.25)',
} as const;

export const typography = {
  // Font Families
  fontSans: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
  fontMono: "'Fira Code', 'SF Mono', 'Monaco', 'Cascadia Code', monospace",
  
  // Font Sizes
  xs: '0.75rem',      // 12px
  sm: '0.875rem',     // 14px
  base: '1rem',       // 16px
  lg: '1.125rem',     // 18px
  xl: '1.25rem',      // 20px
  '2xl': '1.5rem',    // 24px
  '3xl': '1.875rem',  // 30px
  '4xl': '2.25rem',   // 36px
  '5xl': '3rem',      // 48px
  
  // Font Weights
  weight: {
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  
  // Line Heights
  lineHeight: {
    tight: 1.25,
    normal: 1.5,
    relaxed: 1.75,
  },
} as const;

export const transitions = {
  fast: '150ms cubic-bezier(0.4, 0, 0.2, 1)',
  base: '200ms cubic-bezier(0.4, 0, 0.2, 1)',
  slow: '300ms cubic-bezier(0.4, 0, 0.2, 1)',
  smooth: '400ms cubic-bezier(0.4, 0, 0.2, 1)',
} as const;

export const zIndex = {
  base: 0,
  dropdown: 1000,
  sticky: 1100,
  fixed: 1200,
  modalBackdrop: 1300,
  modal: 1400,
  popover: 1500,
  tooltip: 1600,
} as const;

// Gradient Presets
export const gradients = {
  primary: 'linear-gradient(135deg, rgba(89, 195, 120, 0.1) 0%, rgba(89, 195, 120, 0.05) 100%)',
  card: 'linear-gradient(135deg, rgba(18, 24, 38, 0.8) 0%, rgba(18, 24, 38, 0.95) 100%)',
  subtle: 'linear-gradient(180deg, rgba(89, 195, 120, 0.03) 0%, transparent 100%)',
  danger: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
  info: 'linear-gradient(135deg, rgba(59, 130, 246, 0.1) 0%, rgba(59, 130, 246, 0.05) 100%)',
} as const;

// Chart Theme Configuration
export const chartTheme = {
  grid: {
    stroke: colors.border,
    strokeDasharray: '3 3',
    opacity: 0.3,
  },
  axis: {
    stroke: colors.textMuted,
    fontSize: typography.xs,
  },
  tooltip: {
    backgroundColor: colors.card,
    border: `1px solid ${colors.border}`,
    borderRadius: radius.md,
    padding: spacing.md,
    boxShadow: shadows.lg,
  },
  legend: {
    fontSize: typography.sm,
    color: colors.textSecondary,
  },
} as const;

// Export theme object for easy access
export const theme = {
  colors,
  spacing,
  radius,
  shadows,
  typography,
  transitions,
  zIndex,
  gradients,
  chartTheme,
} as const;

export default theme;

// Made with Bob
