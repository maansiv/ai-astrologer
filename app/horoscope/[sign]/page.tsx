import { notFound } from "next/navigation"
import { Horoscope } from "@/components/Horoscope"
import { generateHoroscope } from "@/lib/horoscope"

export default async function HoroscopePage({ params }: { params: { sign: string } }) {
  const sign = params.sign.toLowerCase()
  const validSigns = [
    "aries",
    "taurus",
    "gemini",
    "cancer",
    "leo",
    "virgo",
    "libra",
    "scorpio",
    "sagittarius",
    "capricorn",
    "aquarius",
    "pisces",
  ]

  if (!validSigns.includes(sign)) {
    notFound()
  }

  const horoscope = await generateHoroscope(sign)

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-pink-500 fun-shadow capitalize">{sign} Horoscope</h1>
      <Horoscope content={horoscope} />
    </div>
  )
}

