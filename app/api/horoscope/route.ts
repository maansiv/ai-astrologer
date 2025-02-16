import { NextResponse } from 'next/server';
import { generateHoroscope } from '@/lib/gemini';

export async function POST(req: Request) {
  try {
    if (!process.env.GOOGLE_AI_API_KEY) {
      return NextResponse.json(
        { error: 'GOOGLE_AI_API_KEY is not configured. Please check environment variables.' },
        { status: 500 }
      );
    }

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
      { 
        error: error instanceof Error ? error.message : 'Failed to generate horoscope',
        details: process.env.NODE_ENV === 'development' ? error : undefined
      },
      { status: 500 }
    );
  }
} 