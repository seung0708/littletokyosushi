import type { Metadata, Viewport } from "next";
import "./globals.css";
import { poppins } from "./fonts/fonts";
import { AuthProvider } from "./context/authContext";
import { CartProvider } from "./context/cartContext";
import { GoogleAnalytics } from "@/components/providers/google-analytics";
import { ToastProvider } from "./context/toastContext";
import { Suspense } from "react";
import { Loading } from "@/components/ui/loading";

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: {
    default: "Little Tokyo Sushi | Authentic Japanese Cuisine in Los Angeles",
    template: "%s | Little Tokyo Sushi"
  },
  description: "Experience authentic Japanese cuisine at Little Tokyo Sushi. Fresh sushi, sashimi, and traditional dishes made with premium ingredients. Order online for pickup or delivery.",
  keywords: ["sushi", "japanese restaurant", "sashimi", "japanese cuisine", "sushi delivery", "sushi takeout"],
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: "Little Tokyo Sushi | Authentic Japanese Cuisine",
    description: "Experience authentic Japanese cuisine at Little Tokyo Sushi. Fresh sushi, sashimi, and traditional dishes made with premium ingredients.",
    type: "website",
    locale: "en_US",
    siteName: "Little Tokyo Sushi",
  },
  twitter: {
    card: "summary_large_image",
    title: "Little Tokyo Sushi | Authentic Japanese Cuisine",
    description: "Experience authentic Japanese cuisine at Little Tokyo Sushi. Fresh sushi, sashimi, and traditional dishes.",
  },
};

export default async function RootLayout({ children, }: { children: React.ReactNode; }) {
  return (
    <html lang="en">
      <body suppressHydrationWarning={true} className={poppins.className}>
          <AuthProvider>
            <CartProvider>
              <Suspense fallback={<Loading variant="store" />}>
                <GoogleAnalytics />
                {children}
              </Suspense>
            </CartProvider>
          </AuthProvider>
      </body>
    </html>
  );
}
