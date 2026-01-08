import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        // Casino palette
        bg: 'hsl(var(--bg))',
        surface: 'hsl(var(--surface))',
        'surface-elevated': 'hsl(var(--surface-elevated))',

        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: 'hsl(var(--primary-hover))',
          muted: 'hsl(var(--primary-muted))',
        },

        accent: {
          DEFAULT: 'hsl(var(--accent))',
          muted: 'hsl(var(--accent-muted))',
        },

        text: 'hsl(var(--text))',
        'text-muted': 'hsl(var(--text-muted))',
        'text-dim': 'hsl(var(--text-dim))',

        border: 'hsl(var(--border))',
        'border-strong': 'hsl(var(--border-strong))',

        // Shadcn compatibility
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        secondary: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text))",
        },
        destructive: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--text))",
        },
        muted: {
          DEFAULT: "hsl(var(--surface-elevated))",
          foreground: "hsl(var(--text-muted))",
        },
        popover: {
          DEFAULT: "hsl(var(--surface-elevated))",
          foreground: "hsl(var(--text))",
        },
        card: {
          DEFAULT: "hsl(var(--surface))",
          foreground: "hsl(var(--text))",
        },
        input: "hsl(var(--border))",
        ring: "hsl(var(--primary))",
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.6)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        danger: '0 0 0 1px hsl(var(--primary) / 0.4)',
      },
      backdropBlur: {
        glass: '24px',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "14px",
        "2xl": "18px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
