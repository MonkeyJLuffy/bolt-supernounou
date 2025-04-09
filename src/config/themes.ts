import { ThemeConfig } from './theme.config';

export const themes: Record<string, ThemeConfig> = {
  default: {
    colors: {
      primary: {
        main: '#7ECBC3', // Teal
        light: '#B5E5E0', // Light Teal
        dark: '#6BA59E', // Dark Teal
      },
      secondary: {
        main: '#F7EDE2', // Beige
        light: '#F9F5F0', // Light Beige
        dark: '#E5D5C5', // Dark Beige
      },
      background: {
        default: '#F9FAFB', // gray-50
        paper: '#FFFFFF',   // white
      },
      text: {
        primary: '#374151',   // gray-700
        secondary: '#6B7280', // gray-500
        disabled: '#9CA3AF',  // gray-400
      },
      error: {
        main: '#E76F51', // Coral
        light: '#F4A261', // Light Coral
        dark: '#D45D3F',  // Dark Coral
      },
      success: {
        main: '#84A98C', // Sage Green
        light: '#A7C4BC', // Light Sage
        dark: '#6B8C7D',  // Dark Sage
      },
      warning: {
        main: '#FFD166', // Yellow
        light: '#F4A261', // Light Yellow
        dark: '#E9C46A',  // Dark Yellow
      },
    },
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
    spacing: {
      xs: '0.25rem',    // 4px
      sm: '0.5rem',     // 8px
      md: '1rem',       // 16px
      lg: '1.5rem',     // 24px
      xl: '2rem',       // 32px
      '2xl': '3rem',    // 48px
      '3xl': '4rem',    // 64px
    },
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
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
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
    zIndex: {
      dropdown: 1000,
      modal: 2000,
      tooltip: 3000,
      notification: 4000,
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
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
  },
  dark: {
    colors: {
      primary: {
        main: '#6366F1', // indigo-500
        light: '#818CF8', // indigo-400
        dark: '#4F46E5',  // indigo-600
      },
      secondary: {
        main: '#8B5CF6', // violet-500
        light: '#A78BFA', // violet-400
        dark: '#7C3AED',  // violet-600
      },
      background: {
        default: '#1F2937', // gray-800
        paper: '#111827',   // gray-900
      },
      text: {
        primary: '#F9FAFB',   // gray-50
        secondary: '#D1D5DB', // gray-300
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
    spacing: {
      xs: '0.25rem',    // 4px
      sm: '0.5rem',     // 8px
      md: '1rem',       // 16px
      lg: '1.5rem',     // 24px
      xl: '2rem',       // 32px
      '2xl': '3rem',    // 48px
      '3xl': '4rem',    // 64px
    },
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
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
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
    zIndex: {
      dropdown: 1000,
      modal: 2000,
      tooltip: 3000,
      notification: 4000,
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
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
  },
  pastel: {
    colors: {
      primary: {
        main: '#93C5FD', // blue-300
        light: '#BFDBFE', // blue-200
        dark: '#60A5FA',  // blue-400
      },
      secondary: {
        main: '#A7F3D0', // emerald-200
        light: '#D1FAE5', // emerald-100
        dark: '#6EE7B7',  // emerald-300
      },
      background: {
        default: '#F3F4F6', // gray-100
        paper: '#FFFFFF',   // white
      },
      text: {
        primary: '#374151',   // gray-700
        secondary: '#6B7280', // gray-500
        disabled: '#9CA3AF',  // gray-400
      },
      error: {
        main: '#FCA5A5', // red-300
        light: '#FECACA', // red-200
        dark: '#F87171',  // red-400
      },
      success: {
        main: '#A7F3D0', // emerald-200
        light: '#D1FAE5', // emerald-100
        dark: '#6EE7B7',  // emerald-300
      },
      warning: {
        main: '#FCD34D', // amber-300
        light: '#FDE68A', // amber-200
        dark: '#FBBF24',  // amber-400
      },
    },
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
    spacing: {
      xs: '0.25rem',    // 4px
      sm: '0.5rem',     // 8px
      md: '1rem',       // 16px
      lg: '1.5rem',     // 24px
      xl: '2rem',       // 32px
      '2xl': '3rem',    // 48px
      '3xl': '4rem',    // 64px
    },
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
    shadows: {
      sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
      md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
      lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    },
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
    zIndex: {
      dropdown: 1000,
      modal: 2000,
      tooltip: 3000,
      notification: 4000,
    },
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
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
  }
}; 