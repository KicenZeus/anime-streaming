import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import Navbar from "@/components/common/Navbar";
import BottomNav from "@/components/common/BottomNav";
import Footer from "@/components/common/Footer";
import SessionWrapper from "@/components/common/SessionWrapper";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
});

export const metadata = {
  title: {
    default: "ANIMEX — Stream Anime in Cinematic Quality",
    template: "%s | ANIMEX",
  },
  description: "Stream anime in stunning quality.",
  keywords: ["anime", "streaming", "watch anime"],
};

export const viewport = {
  themeColor: "#000000",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className={`${inter.className} antialiased`}>
        {/* SessionWrapper wrap semua supaya useSession bisa dipakai di mana saja */}
        <SessionWrapper>
          <Navbar />
          {children}
          <Footer />
          <BottomNav />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: "#2e1a18",
                color: "#ffdad5",
                border: "1px solid rgba(255,255,255,0.1)",
                borderRadius: "12px",
                fontSize: "14px",
              },
              success: {
                iconTheme: { primary: "#e50914", secondary: "#fff7f6" },
              },
              error: {
                iconTheme: { primary: "#ff4444", secondary: "#fff" },
              },
              duration: 3000,
            }}
          />
        </SessionWrapper>
      </body>
    </html>
  );
}