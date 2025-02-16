import { Card, CardContent } from "@/components/ui/card"

interface HoroscopeProps {
  content: {
    greeting: string
    career: string
    relationship: string
    closing: string
  }
}

export function Horoscope({ content }: HoroscopeProps) {
  return (
    <Card className="max-w-2xl w-full">
      <CardContent className="p-6">
        <p className="text-lg font-semibold mb-4">{content.greeting}</p>
        <p className="mb-4">{content.career}</p>
        <p className="mb-4">{content.relationship}</p>
        <p className="text-lg font-semibold">{content.closing}</p>
      </CardContent>
    </Card>
  )
}

