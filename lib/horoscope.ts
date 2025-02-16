import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

export async function generateHoroscope(zodiacSign: string, birthDetails?: { date: string; time: string; location: string } | null) {
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  let prompt = `Generate a witty and slightly sarcastic daily horoscope for ${zodiacSign}. Keep it fun and playful while still being insightful.
  Format the response in clear sections with emojis and a dash of snark:
  
  🌟 Today's Mood & Energy:
  [A snarky but accurate reading of your vibe today]
  
  💝 Love & Drama Department:
  [The relationship advice you need but didn't ask for]
  
  💼 Career Corner (or lack thereof):
  [Work-related insights that might actually help if you listen]
  
  🧘‍♀️ Self-Care Suggestions:
  [Because retail therapy isn't always the answer]
  
  🎯 Today's Cosmic Cheat Codes:
  - Lucky Color: [something you probably don't own]
  - Lucky Number: [completely arbitrary but you'll check your lottery tickets anyway]
  - Suggested Activity: [something you'll consider doing but let's be real...]
  
  Make it witty and sarcastic but still genuinely helpful. Balance the snark with actual insights. Use a tone that's like a brutally honest best friend who roasts you but clearly wants the best for you.`;

  if (birthDetails) {
    const { moonSign, risingSign } = calculateSigns(birthDetails);
    prompt = `Generate a witty and slightly sarcastic daily horoscope for ${zodiacSign}. Keep it fun and playful while still being insightful.
    Based on their birth details:
    - Date: ${birthDetails.date}
    - Time: ${birthDetails.time}
    - Location: ${birthDetails.location}
    Their calculated signs are:
    - Sun Sign: ${zodiacSign}
    - Moon Sign (Emotional Nature): ${moonSign}
    - Rising Sign (External Self): ${risingSign}
    Create a sassy but insightful personality analysis that playfully pokes fun at typical ${zodiacSign} traits while still being helpful.
    
    Format the response in clear sections with emojis and a dash of snark:
    
    🎭 Your Cosmic Identity Crisis:
    - Sun Sign (The Real You™): ${zodiacSign}
    [How you think you're special as a ${zodiacSign}]
    - Moon Sign (Your Emotional Baggage): ${moonSign}
    [What keeps your therapist employed]
    - Rising Sign (The Fake You): ${risingSign}
    [The personality you've crafted for your Instagram]
    
    ⚡ Triple Threat Analysis:
    [How these signs work together (or don't) to make you... interesting]
    [Embrace the chaos of being a ${zodiacSign} with ${moonSign} emotions pretending to be a ${risingSign}]
    
    🔮 The Truth Hurts (But So Does Your Wallet):
    - Obvious Traits: [3-4 stereotypical traits that you'll probably deny]
    - Hidden Talents: [2-3 abilities you brag about but rarely use]
    - Growth Areas: [2-3 things you should work on but probably won't]
    
    🌟 Today's Mood & Energy:
    [A snarky but accurate reading of your vibe today]
    
    💝 Love & Drama Department:
    [The relationship advice you need but didn't ask for]
    
    💼 Career Corner (or lack thereof):
    [Work-related insights that might actually help if you listen]
    
    🧘‍♀️ Self-Care Suggestions:
    [Because retail therapy isn't always the answer]
    
    🌙 Moon Sign Mood Swing:
    [How your ${moonSign} emotions are making things... interesting today]
    
    ⭐ Rising Sign Reality Check:
    [How your ${risingSign} facade is fooling exactly no one today]
    
    💫 Cosmic Chaos Corner:
    [How your signs are conspiring to make today... memorable]
    
    🎯 Today's Cosmic Cheat Codes:
    - Lucky Color: [something you probably don't own]
    - Lucky Number: [completely arbitrary but you'll check your lottery tickets anyway]
    - Suggested Activity: [something you'll consider doing but let's be real...]
    
    Make it witty and sarcastic but still genuinely helpful. Balance the snark with actual insights. Use a tone that's like a brutally honest best friend who roasts you but clearly wants the best for you. Weave in playful jabs about how their three signs interact, especially if they conflict or create amusing personality quirks.`;
  }

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();
  return text;
}

function calculateSigns(birthDetails: { date: string; time: string; location: string }) {
  // This is a simplified version. In a real app, you'd use proper astrological calculations
  const birthDate = new Date(birthDetails.date);
  const month = birthDate.getMonth() + 1;
  
  // Simplified moon sign calculation (just for demo)
  const moonSigns = ["Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo", "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"];
  const moonIndex = Math.floor((month + birthDate.getDate()) % 12);
  const moonSign = moonSigns[moonIndex];
  
  // Simplified rising sign calculation (just for demo)
  const hour = parseInt(birthDetails.time.split(":")[0]);
  const risingIndex = Math.floor((hour + birthDate.getDate()) % 12);
  const risingSign = moonSigns[risingIndex];
  
  return { moonSign, risingSign };
}

