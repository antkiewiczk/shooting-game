export const colors = {
  zinc: {
    50: '#fafafa',
    100: '#f4f4f5',
    200: '#e4e4e7',
    300: '#d4d4d8',
    400: '#a1a1aa',
    500: '#71717a',
    600: '#52525b',
    700: '#3f3f46',
    800: '#27272a',
    900: '#18181b',
    950: '#09090b',
  },
  emerald: {
    400: '#34d399',
    500: '#10b981',
  },
  cyan: {
    400: '#22d3ee',
    500: '#06b6d4',
  },
  blue: {
    400: '#60a5fa',
    500: '#3b82f6',
  },
  red: {
    400: '#f87171',
    500: '#ef4444',
  },
} as const;

export type ColorKey = keyof typeof colors;
