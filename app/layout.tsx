import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Quicksand } from "next/font/google"

const quicksand = Quicksand({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "AI Astrologer",
  description: "Horoscopes That Work As Hard As Your Manifesting Journal",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${quicksand.className} bg-gray-100`}>{children}</body>
    </html>
  )
}

