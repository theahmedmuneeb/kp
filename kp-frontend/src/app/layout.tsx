import { ThemeProvider } from "@/components/providers/theme-provider";
import { Inter, Montserrat } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import { Toaster } from "@/components/ui/sonner";
import NextAuthSessionProvider from "@/components/providers/session-provider";

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  display: "swap",
  variable: "--font-inter",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
  variable: "--font-montserrat",
});

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
        {/* Global SEO */}
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
