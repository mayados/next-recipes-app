import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import {
  ClerkProvider,
} from '@clerk/nextjs';
import { UserProvider } from '@/components/UserProvider';
import { ThemeProvider } from 'next-themes';

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "MyRecipes - Latest Recipes",
  description: "Latest recipes published on MyRecipes.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="bg-gray-100">
        <ClerkProvider>
          <UserProvider>
          <ThemeProvider attribute="class" defaultTheme="dark">
            <Nav logo="MyRecipes" />
            <main className="w-screen p-5 max-w-full dark:bg-darkBackground">
              {children}
            </main>
          </ThemeProvider>
            <Footer />
          </UserProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
