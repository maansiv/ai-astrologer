import { OpenAI } from "openai"

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateHoroscope(sign: string) {
  const currentDate = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  const prompt = `Generate a daily horoscope for ${sign} for ${currentDate}. The horoscope should be optimistic, encouraging, sophisticated yet approachable, warm, and personally invested. Include clever wordplay and contemporary references. Focus on career insights and relationship guidance. Use the following structure:

  1. Opening greeting with personality
  2. Career-focused insight with actionable advice
  3. Relationship/social guidance
  4. Uplifting closing statement

  Ensure the tone is similar to these examples:
  - "OMG Aries, today is perfect for that career glow-up you've been manifesting!"
  - "Trust me Gemini, like a perfectly planned court case, your networking strategy needs this power move."
  - "What, like it's hard? Cancer, your professional intuition is totally on point today!"

  Please format the response as a JSON object with the following structure:
  {
    "greeting": "...",
    "career": "...",
    "relationship": "...",
    "closing": "..."
  }`

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [{ role: "user", content: prompt }],
  })

  const horoscope = JSON.parse(response.choices[0].message.content || "{}")
  return horoscope
}

