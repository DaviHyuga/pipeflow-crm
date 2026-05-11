import type { Metadata } from "next"
import { Plus_Jakarta_Sans, Geist_Mono } from "next/font/google"
import Script from "next/script"
import { TooltipProvider } from "@/components/ui/tooltip"
import { ThemeProvider } from "@/components/theme-provider"
import "./globals.css"

const jakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  display: "swap",
})

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
})

// Inline script prevents flash of unstyled content (FOUC) on theme change.
// Runs synchronously before React hydrates, reading localStorage.
const themeScript = `(function(){try{var t=localStorage.getItem('pipeflow-theme')||'dark';document.documentElement.classList.toggle('dark',t==='dark');}catch(e){document.documentElement.classList.add('dark');}})()`

export const metadata: Metadata = {
  title: "PipeFlow CRM",
  description: "Gestão de leads e pipeline de vendas",
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="pt-BR" className={`${jakartaSans.variable} ${geistMono.variable}`}>
      <head>
        <Script id="theme-script" strategy="beforeInteractive" dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
