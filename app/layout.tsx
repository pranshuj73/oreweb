import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
// @ts-ignore
import browserEnv from 'browser-env';

browserEnv(['navigator'])

const inter = Inter({ subsets: ['latin'] })

export const viewport: Viewport = {
  themeColor: 'white',
  colorScheme: 'light',
} 

export const metadata: Metadata = {
  applicationName: 'Oreweb',
  title: 'Oreweb',
  description: 'Share Files Anonymously, Effortlessly.',
  manifest: "/manifest.json",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  )
}
