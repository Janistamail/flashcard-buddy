import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Navbar from "@/app/components/Navbar";
import { ThemeProvider } from "@/app/components/ThemeProvider";
import { Toaster } from "@/components/ui/sonner";
import { auth } from "@/app/lib/auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Lunla Flashcard",
  description: "Lunla Flashcard",
  icons: {
    icon: "/lunla_head.png",
    apple: "/lunla_head.png",
  },
  openGraph: {
    title: "Lunla Flashcard",
    description: "Lunla Flashcard",
    images: ["/lunla_head.png"],
  },
  twitter: {
    card: "summary",
    title: "Lunla Flashcard",
    description: "Lunla Flashcard",
    images: ["/lunla_head.png"],
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <Navbar session={session} />
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
