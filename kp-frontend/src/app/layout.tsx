import { ThemeProvider } from "@/components/providers/theme-provider";
import {
  Inter,
  Montserrat,
  Special_Gothic_Expanded_One,
} from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import NextAuthSessionProvider from "@/components/providers/session-provider";
import type { Metadata } from "next";
import { useGlobals } from "@/lib/fetch";

const inter = Special_Gothic_Expanded_One({
  subsets: ["latin"],
  weight: ["400"],
  // weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
  fallback: ["system-ui", "sans-serif"],
});

const montserrat = Special_Gothic_Expanded_One({
  subsets: ["latin"],
  weight: ["400"],
  // weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
  fallback: ["system-ui", "sans-serif"],
});

export async function generateMetadata(): Promise<Metadata> {
  const globals = await useGlobals();

  return {
    title: {
      default: globals.data.title,
      template: `%s | ${globals.data.title}`,
    },
  };
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`text-secondary bg-background ${inter.variable} ${montserrat.variable} font-inter`}
      >
        <NextTopLoader
          showSpinner={false}
          color="#6A341A"
          height={3}
          shadow="0"
        />
        <ThemeProvider>
          <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
          <Toaster
            closeButton
            richColors
            visibleToasts={1}
            theme="light"
            className="!bg-background"
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
