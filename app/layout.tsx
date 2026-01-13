import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'EmpowerHer - Empowering Women and Girls',
  description: 'A role-based platform that empowers women and girls with education, business tools, and social impact',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={inter.className}>
        <Navbar />
        <main className="min-h-screen" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}


