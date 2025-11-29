import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getMaintenanceConfig } from "@/lib/maintenance";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Dawar Azhar - Engineering Blog",
  description: "Notes on engineering, web development, and experiments",
};

// Force dynamic rendering to check maintenance mode on each request
export const dynamic = 'force-dynamic'

// Paths that should not be redirected
const ALLOWED_PATHS = [
  '/admin',
  '/coming-soon',
  '/api',
]

function isAllowedPath(pathname: string): boolean {
  return ALLOWED_PATHS.some(path => pathname.startsWith(path))
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Get the current path from headers
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || '/'

  // Check maintenance mode
  const maintenanceConfig = getMaintenanceConfig()

  // Redirect to coming-soon if maintenance is enabled and path is not allowed
  if (maintenanceConfig.enabled && !isAllowedPath(pathname)) {
    redirect('/coming-soon')
  }

  // Check if we're on the coming-soon page (hide header/footer)
  const isComingSoon = pathname === '/coming-soon'
  // Check if we're on admin pages (admin has its own layout)
  const isAdminPage = pathname.startsWith('/admin')

  // Hide header/footer on coming-soon page and admin pages
  const showHeaderFooter = !isComingSoon && !isAdminPage

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        {showHeaderFooter ? (
          <div className="relative flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        ) : (
          <>{children}</>
        )}
      </body>
    </html>
  );
}
