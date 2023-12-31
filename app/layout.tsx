import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Toaster } from "@/components/ui/toaster"
// @ts-ignore
import browserEnv from 'browser-env';

browserEnv(['navigator'])

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Oreweb',
  description: 'Share Files Anonymously, Effortlessly.',
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
