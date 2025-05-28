import { type Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [typography],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            table: {
              width: "100%",
              tableLayout: "auto",
              borderCollapse: "collapse",
              marginTop: "1em",
              marginBottom: "1em",
            },
            thead: {
              backgroundColor: "#f3f4f6",
            },
            th: {
              border: "1px solid #d1d5db",
              padding: "0.5rem",
              fontWeight: "600",
              textAlign: "left",
            },
            td: {
              border: "1px solid #d1d5db",
              padding: "0.5rem",
            },
          },
        },
      },
    },
  },
};

export default config;
