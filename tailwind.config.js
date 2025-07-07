/** @type {import('tailwindcss').Config} */
module.exports = {
    darkMode: ["class"],
    content: [
        "./pages/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./app/**/*.{ts,tsx}",
        "./src/**/*.{ts,tsx}",
    ],
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
                lato: ["Lato", "sans-serif"],
                lazy: ["LazyDog", "sans-serif"],
            },
            colors: {
                primary: {
                    DEFAULT: "#004AAD", // cobalt-blue - couleur principale
                    50: "#E6F0FF",
                    100: "#CCE1FF",
                    200: "#99C3FF",
                    300: "#66A5FF",
                    400: "#3387FF",
                    500: "#004AAD",
                    600: "#003B8A",
                    700: "#002C68",
                    800: "#001D45",
                    900: "#000E23",
                },
                dark: {
                    DEFAULT: "#0D0221", // dark-purple
                    50: "#442288",
                    100: "#391D73",
                    200: "#2E185E",
                    300: "#231349",
                    400: "#180E34",
                    500: "#0D0221",
                    600: "#0A011A",
                    700: "#070113",
                    800: "#04000C",
                    900: "#010005",
                },
                federal: {
                    DEFAULT: "#0F084B", // federal-blue
                    50: "#4935FF",
                    100: "#341BFF",
                    200: "#1500F2",
                    300: "#1100BF",
                    400: "#0D0C8C",
                    500: "#0F084B",
                    600: "#0B0637",
                    700: "#070423",
                    800: "#03020F",
                    900: "#000000",
                },
                marian: {
                    DEFAULT: "#26408B", // marian-blue
                    50: "#8BA3E3",
                    100: "#7994DE",
                    200: "#5677D5",
                    300: "#335ACC",
                    400: "#2B4CAD",
                    500: "#26408B",
                    600: "#1C2F66",
                    700: "#131F42",
                    800: "#0A0F1D",
                    900: "#000000",
                },
                mint: {
                    DEFAULT: "#C2E7D9", // mint-green
                    50: "#FFFFFF",
                    100: "#FFFFFF",
                    200: "#FFFFFF",
                    300: "#FFFFFF",
                    400: "#E1F4ED",
                    500: "#C2E7D9",
                    600: "#9CD7C1",
                    700: "#76C7A9",
                    800: "#50B791",
                    900: "#3C9775",
                },
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-main': 'linear-gradient(135deg, #0D0221 0%, #0F084B 25%, #26408B 50%, #004AAD 75%, #C2E7D9 100%)',
                'gradient-dark': 'linear-gradient(135deg, #0D0221 0%, #0F084B 50%, #26408B 100%)',
                'gradient-light': 'linear-gradient(135deg, #26408B 0%, #004AAD 50%, #C2E7D9 100%)',
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
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
                tilt: {
                    "0%, 100%": { transform: "rotate(-1deg)" },
                    "50%": { transform: "rotate(1deg)" },
                },
                shine: {
                    "0%": { backgroundPosition: "200% 0" },
                    "100%": { backgroundPosition: "-200% 0" },
                },
                "shine-profile": {
                    "0%": { backgroundPosition: "200% 0", opacity: "0.5" },
                    "50%": { opacity: "1" },
                    "100%": { backgroundPosition: "-200% 0", opacity: "0.5" },
                },
            },
            animation: {
                "accordion-down": "accordion-down 0.2s ease-out",
                "accordion-up": "accordion-up 0.2s ease-out",
                tilt: "tilt 10s infinite linear",
                shine: "shine 8s linear infinite",
                "bounce-sequence": "bounce-sequence 5s infinite ease-in-out",
            },
        },
    },
    plugins: [require("tailwindcss-animate")],
};
