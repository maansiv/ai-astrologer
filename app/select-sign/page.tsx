import { ZodiacSignSelector } from "@/components/ZodiacSignSelector"

export default function SelectSign() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8 text-pink-500 fun-shadow">Choose Your Zodiac Sign</h1>
      <ZodiacSignSelector />
    </div>
  )
}

