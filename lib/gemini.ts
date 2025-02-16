import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!);

interface BirthDetails {
  date: string;
  time: string;
  location: string;
}

// Function to determine Moon Sign based on date
function calculateMoonSign(date: string): string {
  // Convert date to Moon's position in zodiac
  const birthDate = new Date(date);
  // Simplified calculation - in reality, this would need ephemeris data
  const moonCycle = Math.floor((birthDate.getTime() / (29.5 * 24 * 60 * 60 * 1000)) % 12);
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  return zodiacSigns[moonCycle];
}

// Function to determine Rising Sign based on birth time and location
function calculateRisingSign(date: string, time: string, location: string): string {
  if (!time || !location) return "Unknown (requires birth time and location)";
  
  // Convert birth time to local sidereal time
  const birthDateTime = new Date(`${date}T${time}`);
  const hour = birthDateTime.getHours() + birthDateTime.getMinutes() / 60;
  
  // Simplified calculation - in reality, would need precise location coordinates
  const ascendantHouse = Math.floor(((hour + 12) % 24) / 2);
  const zodiacSigns = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
  ];
  return zodiacSigns[ascendantHouse];
}

export async function generateHoroscope(zodiacSign: string, birthDetails?: BirthDetails | null) {
  console.log('Gemini generateHoroscope called with:', { zodiacSign, birthDetails }); // Debug log
  
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  let moonSign = "";
  let risingSign = "";

  if (birthDetails?.date) {
    moonSign = calculateMoonSign(birthDetails.date);
    risingSign = calculateRisingSign(birthDetails.date, birthDetails.time, birthDetails.location);
    console.log('Calculated signs:', { moonSign, risingSign }); // Debug log
  }

  let prompt = `Generate a witty and slightly sarcastic daily horoscope for ${zodiacSign}. Keep it fun and playful while still being insightful.`;

  if (birthDetails?.date) {
    prompt += `\nBased on their birth details:
    - Date: ${birthDetails.date}
    - Time: ${birthDetails.time || 'Unknown (probably sleeping)'}
    - Location: ${birthDetails.location || 'Unknown (somewhere on Earth, presumably)'}
    
    Their calculated signs are:
    - Sun Sign: ${zodiacSign}
    - Moon Sign (Emotional Nature): ${moonSign}
    - Rising Sign (External Self): ${risingSign}
    
    Create a sassy but insightful personality analysis that playfully pokes fun at typical ${zodiacSign} traits while still being helpful.
    `;
  }

  prompt += `
  Format the response in clear sections with emojis and a dash of snark:

  ${birthDetails?.date ? `🎭 Your Cosmic Identity Crisis:
  - Sun Sign (The Real You™): ${zodiacSign}
  [How you think you're special as a ${zodiacSign}]
  
  - Moon Sign (Your Emotional Baggage): ${moonSign}
  [What keeps your therapist employed]
  
  - Rising Sign (The Fake You): ${risingSign}
  [The personality you've crafted for your Instagram]

  ⚡ Triple Threat Analysis:
  [How these signs work together (or don't) to make you... interesting]
  [Embrace the chaos of being a ${zodiacSign}${moonSign !== zodiacSign ? ` with ${moonSign} emotions` : ''}${risingSign !== zodiacSign ? ` pretending to be a ${risingSign}` : ''}]

  🔮 The Truth Hurts (But So Does Your Wallet):
  - Obvious Traits: [3-4 stereotypical traits that you'll probably deny]
  - Hidden Talents: [2-3 abilities you brag about but rarely use]
  - Growth Areas: [2-3 things you should work on but probably won't]

  ` : ''}
  
  🌟 Today's Mood & Energy:
  [A snarky but accurate reading of your vibe today]

  💝 Love & Drama Department:
  [The relationship advice you need but didn't ask for]

  💼 Career Corner (or lack thereof):
  [Work-related insights that might actually help if you listen]

  🧘‍♀️ Self-Care Suggestions:
  [Because retail therapy isn't always the answer]

  ${birthDetails?.date ? `
  🌙 Moon Sign Mood Swing:
  [How your ${moonSign} emotions are making things... interesting today]

  ⭐ Rising Sign Reality Check:
  [How your ${risingSign} facade is fooling exactly no one today]

  💫 Cosmic Chaos Corner:
  [How your signs are conspiring to make today... memorable]
  ` : ''}

  🎯 Today's Cosmic Cheat Codes:
  - Lucky Color: [something you probably don't own]
  - Lucky Number: [completely arbitrary but you'll check your lottery tickets anyway]
  - Suggested Activity: [something you'll consider doing but let's be real...]

  Make it witty and sarcastic but still genuinely helpful. Balance the snark with actual insights. Use a tone that's like a brutally honest best friend who roasts you but clearly wants the best for you.${birthDetails?.date ? ' Weave in playful jabs about how their three signs interact, especially if they conflict or create amusing personality quirks.' : ''}`;

  console.log('Generated prompt:', prompt); // Debug log

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    console.log('Gemini response received:', text); // Debug log
    return text;
  } catch (error) {
    console.error('Error generating horoscope:', error);
    throw new Error('Failed to generate horoscope');
  }
} 