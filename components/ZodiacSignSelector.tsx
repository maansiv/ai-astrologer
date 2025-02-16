"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

const zodiacSigns = [
  "Aries",
  "Taurus",
  "Gemini",
  "Cancer",
  "Leo",
  "Virgo",
  "Libra",
  "Scorpio",
  "Sagittarius",
  "Capricorn",
  "Aquarius",
  "Pisces",
]

export function ZodiacSignSelector() {
  const [selectedSign, setSelectedSign] = useState("")
  const router = useRouter()

  const handleSignSelect = (sign: string) => {
    setSelectedSign(sign)
  }

  const handleSubmit = async () => {
    if (selectedSign) {
      // Save the selected sign (you'll need to implement this API route)
      await fetch("/api/save-sign", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sign: selectedSign }),
      })
      router.push(`/horoscope/${selectedSign.toLowerCase()}`)
    }
  }

  return (
    <div className="grid grid-cols-3 gap-4 mb-8">
      {zodiacSigns.map((sign) => (
        <Button
          key={sign}
          onClick={() => handleSignSelect(sign)}
          className={`${
            selectedSign === sign ? "bg-pink-500 text-white" : "bg-gray-200 text-gray-800"
          } hover:bg-pink-600 hover:text-white`}
        >
          {sign}
        </Button>
      ))}
      <div className="col-span-3 mt-4">
        <Button
          onClick={handleSubmit}
          disabled={!selectedSign}
          className="w-full bg-pink-500 hover:bg-pink-600 text-white"
        >
          Get My Horoscope
        </Button>
      </div>
    </div>
  )
}

