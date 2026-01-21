import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

import MobileNav from '@/components/MobileNav'

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
        <main className="min-h-screen pb-20 md:pb-0" role="main">
          {children}
        </main>
        <MobileNav />
        <div className="hidden md:block">
          <Footer />
        </div>
        <div className="md:hidden pb-20">
          {/* Mobile footer spacer or simplified footer if needed, for now hiding main footer on mobile to keep "App" feel or keeping it with padding */}
          <Footer />
        </div>
      </body>
    </html>
  )
}


