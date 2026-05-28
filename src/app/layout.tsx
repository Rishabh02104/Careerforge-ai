import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { CursorProvider } from "@/context/CursorContext";
import { TransitionProvider } from "@/context/TransitionContext";
import { AuthProvider } from "@/context/AuthContext";
import CustomCursor from "@/components/ui/CustomCursor";
import TransitionOverlay from "@/components/ui/TransitionOverlay";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "CareerForge AI",
  description: "AI-Powered Career Platform",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${geist.className} cursor-none`}>
        <AuthProvider>
          <CursorProvider>
            <TransitionProvider>
              <CustomCursor />
              <TransitionOverlay />
              {children}
            </TransitionProvider>
          </CursorProvider>
        </AuthProvider>
      </body>
    </html>
  );
}