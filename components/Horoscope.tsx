import { Card, CardContent } from "@/components/ui/card"

interface HoroscopeProps {
  content: string
}

export function Horoscope({ content }: HoroscopeProps) {
  return (
    <Card className="max-w-4xl w-full bg-white/80 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="prose prose-lg max-w-none">
          {content.split('\n').map((line, index) => {
            // Skip empty lines
            if (!line.trim()) return null;
            
            // Check if line starts with an emoji
            const isSection = /^[🎭⚡🔮🌟💝💼🧘‍♀️🌙⭐💫🎯]/.test(line);
            
            // Check if line is a subsection (starts with -)
            const isSubsection = line.trim().startsWith('-');
            
            if (isSection) {
              return (
                <h3 key={index} className="text-xl font-semibold text-purple-700 mt-6 mb-3 flex items-center gap-2">
                  {line}
                </h3>
              );
            } else if (isSubsection) {
              return (
                <p key={index} className="text-purple-800 font-medium ml-4 mb-2">
                  {line}
                </p>
              );
            } else {
              return (
                <p key={index} className="text-purple-600 mb-2">
                  {line}
                </p>
              );
            }
          })}
        </div>
      </CardContent>
    </Card>
  )
}

