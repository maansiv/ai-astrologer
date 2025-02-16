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

  let prompt = `Generate a personalized daily horoscope for ${zodiacSign}.`;

  if (birthDetails?.date) {
    prompt += `\nBased on their birth details:
    - Date: ${birthDetails.date}
    - Time: ${birthDetails.time || 'Unknown'}
    - Location: ${birthDetails.location || 'Unknown'}
    
    Their calculated signs are:
    - Sun Sign: ${zodiacSign}
    - Moon Sign (Emotional Nature): ${moonSign}
    - Rising Sign (External Self): ${risingSign}
    
    Provide a comprehensive personality analysis and horoscope that takes into account these three signs.
    `;
  }

  prompt += `
  Format the response in clear sections with emojis and line breaks:

  ${birthDetails?.date ? `🎭 Your Astrological Profile:
  - Sun Sign (Core Identity): ${zodiacSign}
  [Your ${zodiacSign} sun sign represents your core essence and basic personality]
  
  - Moon Sign (Emotional Nature): ${moonSign}
  [Your ${moonSign} moon sign shapes your emotional landscape and inner world]
  
  - Rising Sign (External Self): ${risingSign}
  [Your ${risingSign} rising sign influences how others perceive you and your approach to the world]

  ⚡ Unique Combination Analysis:
  [Analyze how ${zodiacSign} (Sun), ${moonSign} (Moon), and ${risingSign} (Rising) work together]
  [Include specific strengths and potential challenges of this combination]

  🔮 Personality Keywords:
  - Core Traits: [List 3-4 key personality traits based on the sign combination]
  - Hidden Talents: [List 2-3 special abilities this combination brings]
  - Growth Areas: [List 2-3 areas for personal development]

  ` : ''}
  
  🌟 Overall Mood and Energy:
  [2-3 sentences about their general mood, energy levels, and daily outlook]

  💝 Love and Relationships:
  [2-3 sentences about their romantic life, friendships, and social connections]

  💼 Career and Goals:
  [2-3 sentences about work, ambitions, and opportunities]

  🧘‍♀️ Health and Wellness:
  [2-3 sentences about physical and mental well-being, self-care advice]

  ${birthDetails?.date ? `
  🌙 Moon Sign Influence Today:
  [How their moon sign affects their emotions and intuition today]

  ⭐ Rising Sign Impact Today:
  [How their rising sign influences their approach and appearance today]

  💫 Sign Harmony:
  [How their three signs are working together today and what to focus on]
  ` : ''}

  🎯 Lucky Elements:
  - Color: [lucky color]
  - Number: [lucky number]
  - Activity: [recommended activity]

  Make it engaging, optimistic, and personal. Use a friendly, encouraging tone. ${birthDetails?.date ? 'Integrate insights from all three signs throughout the reading and explain how they complement or challenge each other.' : ''}`;

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