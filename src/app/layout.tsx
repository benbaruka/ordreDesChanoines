"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Outfit } from "next/font/google";
import "./globals.css";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/autoplay";
import { SidebarProvider } from "@/context/SidebarContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AlertProvider } from "@/context/AlertProvider";
import { AuthProvider } from "@/context/AuthProvider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { CookiesProvider } from "react-cookie";

const outfit = Outfit({
  variable: "--font-outfit-sans",
  subsets: ["latin"],
});

const queryClient = new QueryClient();

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();

  // useEffect(() => {
  //   // Rediriger automatiquement vers la page de sign-up
  //   router.push("/signin");
  // }, []);

  return (
    <html lang="en">
      <body className={`${outfit.variable} dark:bg-gray-900`}>
        {/* <ThemeProvider> */}
        <CookiesProvider>
          <QueryClientProvider client={queryClient}>
            <AuthProvider>
              <AlertProvider>
                <SidebarProvider>{children}</SidebarProvider>
              </AlertProvider>
            </AuthProvider>
          </QueryClientProvider>
        </CookiesProvider>
        {/* </ThemeProvider> */}
      </body>
    </html>
  );
}
