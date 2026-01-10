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
        // PARADOX Brand Tokens
        'brand-red-base': 'hsl(0 85% 60%)',
        'brand-red-deep': 'hsl(0 85% 50%)',
        'brand-red-glow': 'hsl(0 100% 65%)',
        'brand-obsidian-base': 'hsl(220 20% 8%)',
        'brand-obsidian-glass': 'hsl(220 20% 12%)',
        'brand-obsidian-border': 'hsl(220 20% 18%)',
        'brand-gold-accent': 'hsl(42 90% 60%)',
        'text-primary': 'hsl(0 0% 100%)',
        'text-secondary': 'hsl(220 20% 70%)',

        // Legacy compatibility (mapped to brand tokens)
        bg: 'hsl(220 20% 8%)',
        surface: 'hsl(220 20% 12%)',
        'surface-elevated': 'hsl(220 20% 18%)',

        primary: {
          DEFAULT: 'hsl(0 85% 60%)',
          hover: 'hsl(0 85% 50%)',
          muted: 'hsl(0 85% 40%)',
        },

        accent: {
          DEFAULT: 'hsl(42 90% 60%)',
          muted: 'hsl(42 90% 40%)',
        },

        text: 'hsl(0 0% 100%)',
        'text-muted': 'hsl(220 20% 70%)',
        'text-dim': 'hsl(220 20% 50%)',

        border: 'hsl(220 20% 18%)',
        'border-strong': 'hsl(220 20% 25%)',

        // Shadcn compatibility
        background: "hsl(220 20% 8%)",
        foreground: "hsl(0 0% 100%)",
        secondary: {
          DEFAULT: "hsl(220 20% 12%)",
          foreground: "hsl(0 0% 100%)",
        },
        destructive: {
          DEFAULT: "hsl(0 85% 60%)",
          foreground: "hsl(0 0% 100%)",
        },
        muted: {
          DEFAULT: "hsl(220 20% 18%)",
          foreground: "hsl(220 20% 70%)",
        },
        popover: {
          DEFAULT: "hsl(220 20% 18%)",
          foreground: "hsl(0 0% 100%)",
        },
        card: {
          DEFAULT: "hsl(220 20% 12%)",
          foreground: "hsl(0 0% 100%)",
        },
        input: "hsl(220 20% 18%)",
        ring: "hsl(0 85% 60%)",
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0,0,0,0.6)',
        inset: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        'red-glow': '0 0 20px rgba(239, 68, 68, 0.4)',
        'gold-glow': '0 0 20px rgba(250, 204, 21, 0.3)',
      },
      backdropBlur: {
        glass: '16px',
        'glass-heavy': '24px',
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
