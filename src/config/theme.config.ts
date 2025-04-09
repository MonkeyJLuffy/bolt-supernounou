export const themeConfig = {
  // Couleurs principales
  colors: {
    primary: {
      main: '#3B82F6', // blue-500
      light: '#60A5FA', // blue-400
      dark: '#2563EB',  // blue-600
    },
    secondary: {
      main: '#10B981', // emerald-500
      light: '#34D399', // emerald-400
      dark: '#059669',  // emerald-600
    },
    background: {
      default: '#F9FAFB', // gray-50
      paper: '#FFFFFF',   // white
    },
    text: {
      primary: '#111827',   // gray-900
      secondary: '#6B7280', // gray-500
      disabled: '#9CA3AF',  // gray-400
    },
    error: {
      main: '#EF4444', // red-500
      light: '#F87171', // red-400
      dark: '#DC2626',  // red-600
    },
    success: {
      main: '#10B981', // emerald-500
      light: '#34D399', // emerald-400
      dark: '#059669',  // emerald-600
    },
    warning: {
      main: '#F59E0B', // amber-500
      light: '#FBBF24', // amber-400
      dark: '#D97706',  // amber-600
    },
  },

  // Typographie
  typography: {
    fontFamily: {
      primary: 'Inter, sans-serif',
      secondary: 'Roboto, sans-serif',
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
    },
    fontWeight: {
      light: 300,
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
    },
  },

  // Espacements
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Bordures
  borders: {
    radius: {
      sm: '0.125rem',  // 2px
      md: '0.25rem',   // 4px
      lg: '0.5rem',    // 8px
      xl: '1rem',      // 16px
      full: '9999px',
    },
    width: {
      thin: '1px',
      medium: '2px',
      thick: '3px',
    },
  },

  // Ombres
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
  },

  // Transitions
  transitions: {
    duration: {
      fast: '150ms',
      normal: '300ms',
      slow: '500ms',
    },
    timing: {
      ease: 'ease',
      'ease-in': 'ease-in',
      'ease-out': 'ease-out',
      'ease-in-out': 'ease-in-out',
    },
  },

  // Z-index
  zIndex: {
    dropdown: 1000,
    modal: 2000,
    tooltip: 3000,
    notification: 4000,
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Composants spécifiques
  components: {
    button: {
      padding: {
        sm: '0.5rem 1rem',
        md: '0.75rem 1.5rem',
        lg: '1rem 2rem',
      },
    },
    input: {
      height: {
        sm: '2rem',
        md: '2.5rem',
        lg: '3rem',
      },
    },
    card: {
      padding: {
        sm: '1rem',
        md: '1.5rem',
        lg: '2rem',
      },
    },
  },
};

// Types pour le thème
export type ThemeConfig = typeof themeConfig;
export type ThemeColors = typeof themeConfig.colors;
export type ThemeTypography = typeof themeConfig.typography;
export type ThemeSpacing = typeof themeConfig.spacing;
export type ThemeBorders = typeof themeConfig.borders;
export type ThemeShadows = typeof themeConfig.shadows;
export type ThemeTransitions = typeof themeConfig.transitions;
export type ThemeZIndex = typeof themeConfig.zIndex;
export type ThemeBreakpoints = typeof themeConfig.breakpoints;
export type ThemeComponents = typeof themeConfig.components; 