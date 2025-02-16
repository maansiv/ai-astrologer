import { NextResponse } from 'next/server';
import { generateHoroscope } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    console.log('API route received request:', body); // Debug log

    const { zodiacSign, birthDetails } = body;

    if (!zodiacSign) {
      return NextResponse.json(
        { error: 'Zodiac sign is required' },
        { status: 400 }
      );
    }

    console.log('Calling generateHoroscope with:', { zodiacSign, birthDetails }); // Debug log
    const horoscope = await generateHoroscope(zodiacSign, birthDetails);
    console.log('Generated horoscope length:', horoscope.length); // Debug log
    
    return NextResponse.json({ horoscope });
  } catch (error) {
    console.error('Error in API route:', error);
    return NextResponse.json(
      { error: 'Failed to generate horoscope' },
      { status: 500 }
    );
  }
} 