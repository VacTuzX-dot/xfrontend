import { Prompt } from "next/font/google";
import "./globals.css";
import Navbar from "./components/nav";
import Footer from "./components/footer";
import { ReactLenis } from "lenis/react";

const prompt = Prompt({
  variable: "--font-prompt",
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
});

export const metadata = {
  title: "013 Frontend",
  description: "Frontend from abyss",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.0/font/bootstrap-icons.css"
        />
      </head>
      <body className={`${prompt.variable} antialiased`} data-bs-theme="dark">
        <Navbar />
        <ReactLenis root>{children}</ReactLenis>
        <Footer />
      </body>
    </html>
  );
}
