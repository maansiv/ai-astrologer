'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface BirthDetails {
  date: string;
  time: string;
  location: string;
}

interface AstrologicalProfile {
  moonSign: string | null;
  risingSign: string | null;
}

const zodiacSigns = [
  { name: 'Aries', dates: 'March 21 - April 19', symbol: '♈', emoji: '🐏' },
  { name: 'Taurus', dates: 'April 20 - May 20', symbol: '♉', emoji: '🐂' },
  { name: 'Gemini', dates: 'May 21 - June 20', symbol: '♊', emoji: '👥' },
  { name: 'Cancer', dates: 'June 21 - July 22', symbol: '♋', emoji: '🦀' },
  { name: 'Leo', dates: 'July 23 - August 22', symbol: '♌', emoji: '🦁' },
  { name: 'Virgo', dates: 'August 23 - September 22', symbol: '♍', emoji: '👩‍🌾' },
  { name: 'Libra', dates: 'September 23 - October 22', symbol: '♎', emoji: '⚖️' },
  { name: 'Scorpio', dates: 'October 23 - November 21', symbol: '♏', emoji: '🦂' },
  { name: 'Sagittarius', dates: 'November 22 - December 21', symbol: '♐', emoji: '🏹' },
  { name: 'Capricorn', dates: 'December 22 - January 19', symbol: '♑', emoji: '🐐' },
  { name: 'Aquarius', dates: 'January 20 - February 18', symbol: '♒', emoji: '🌊' },
  { name: 'Pisces', dates: 'February 19 - March 20', symbol: '♓', emoji: '🐟' },
];

export default function ZodiacGrid() {
  const [selectedSign, setSelectedSign] = useState<string | null>(null);
  const [horoscope, setHoroscope] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [birthDetails, setBirthDetails] = useState<BirthDetails>({
    date: '',
    time: '',
    location: ''
  });
  const [showBirthForm, setShowBirthForm] = useState(false);
  const [hasSubmittedBirthDetails, setHasSubmittedBirthDetails] = useState(false);
  const [astroProfile, setAstroProfile] = useState<AstrologicalProfile>({
    moonSign: null,
    risingSign: null
  });

  const extractSignsFromHoroscope = (text: string) => {
    try {
      console.log('Attempting to extract signs from text:', text.substring(0, 500) + '...'); // Log first 500 chars

      // More flexible Moon Sign patterns
      const moonSignPatterns = [
        /Moon Sign \(Emotional Nature\):\s*([A-Za-z]+)/i,
        /Moon Sign.*?:\s*([A-Za-z]+)/i,
        /Your ([A-Za-z]+) moon sign/i
      ];

      // More flexible Rising Sign patterns
      const risingSignPatterns = [
        /Rising Sign \(External Self\):\s*([A-Za-z]+)/i,
        /Rising Sign.*?:\s*([A-Za-z]+)/i,
        /Your ([A-Za-z]+) rising sign/i
      ];

      let moonSign = null;
      let risingSign = null;

      // Try each pattern for Moon Sign
      for (const pattern of moonSignPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          moonSign = match[1].trim();
          console.log('Found Moon Sign with pattern:', pattern, '=>', moonSign);
          break;
        }
      }

      // Try each pattern for Rising Sign
      for (const pattern of risingSignPatterns) {
        const match = text.match(pattern);
        if (match && match[1]) {
          risingSign = match[1].trim();
          console.log('Found Rising Sign with pattern:', pattern, '=>', risingSign);
          break;
        }
      }

      // Filter out "Unknown" values
      moonSign = moonSign?.includes("Unknown") ? null : moonSign;
      risingSign = risingSign?.includes("Unknown") ? null : risingSign;

      console.log('Final extracted signs:', { moonSign, risingSign });
      
      return { moonSign, risingSign };
    } catch (error) {
      console.error('Error extracting signs:', error);
      return { moonSign: null, risingSign: null };
    }
  };

  const generateHoroscope = async (zodiacSign: string) => {
    setIsLoading(true);
    setSelectedSign(zodiacSign);
    setAstroProfile({ moonSign: null, risingSign: null }); // Reset profile

    try {
      const requestBody = {
        zodiacSign,
        birthDetails: hasSubmittedBirthDetails ? {
          date: birthDetails.date,
          time: birthDetails.time || '',
          location: birthDetails.location || ''
        } : null
      };

      console.log('Sending request with:', requestBody); // Debug log

      const response = await fetch('/api/horoscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        throw new Error('Failed to generate horoscope');
      }

      const data = await response.json();
      console.log('Received horoscope:', data.horoscope); // Debug log
      
      setHoroscope(data.horoscope);

      // Extract and set moon and rising signs if birth details were provided
      if (hasSubmittedBirthDetails) {
        const extractedSigns = extractSignsFromHoroscope(data.horoscope);
        console.log('Extracted signs:', extractedSigns); // Debug log
        setAstroProfile(extractedSigns);
      }
    } catch (error) {
      console.error('Error:', error);
      setHoroscope('Failed to generate horoscope. Please try again later.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBirthDetailsChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setBirthDetails(prev => ({
      ...prev,
      [name]: value
    }));
    setHasSubmittedBirthDetails(false); // Reset when details change
  };

  const handleBirthDetailsSubmit = () => {
    if (birthDetails.date) {
      setHasSubmittedBirthDetails(true);
      // Reset any existing profile when submitting new details
      setAstroProfile({ moonSign: null, risingSign: null });
    }
  };

  const getSignEmoji = (signName: string) => {
    return zodiacSigns.find(sign => sign.name === signName)?.emoji || '';
  };

  return (
    <div className="container mx-auto py-12 px-4">
      <h1 className="text-5xl font-bold text-center mb-4 text-transparent bg-clip-text bg-gradient-to-r from-pink-500 via-pink-400 to-pink-500">
        AI Astrologer ✨
      </h1>
      
      <div className="max-w-2xl mx-auto mb-12">
        <button
          onClick={() => {
            setShowBirthForm(!showBirthForm);
            if (!showBirthForm) {
              setHasSubmittedBirthDetails(false);
            }
          }}
          className="w-full text-center mb-4 text-purple-600 hover:text-purple-700 font-medium"
        >
          {showBirthForm ? '− Hide Birth Details' : '+ Add Birth Details for Moon & Rising Signs (Optional)'}
        </button>
        
        {showBirthForm && (
          <div className="bg-white/50 backdrop-blur-sm rounded-xl p-6 border border-pink-100 mb-8 transition-all duration-300">
            <p className="text-purple-700 mb-4 text-sm">
              Enter your birth details for a more personalized horoscope including your Moon and Rising signs 🌙 ⭐
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-1">
                  Birth Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={birthDetails.date}
                  onChange={handleBirthDetailsChange}
                  className="w-full px-3 py-2 rounded-md border border-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-purple-600 mb-1">
                  Birth Time
                </label>
                <input
                  type="time"
                  name="time"
                  value={birthDetails.time}
                  onChange={handleBirthDetailsChange}
                  className="w-full px-3 py-2 rounded-md border border-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-purple-600 mb-1">
                  Birth Location
                </label>
                <input
                  type="text"
                  name="location"
                  value={birthDetails.location}
                  onChange={handleBirthDetailsChange}
                  placeholder="City, Country"
                  className="w-full px-3 py-2 rounded-md border border-purple-200 focus:outline-none focus:ring-2 focus:ring-pink-400"
                />
              </div>
              <div className="md:col-span-2 mt-2">
                <button
                  onClick={handleBirthDetailsSubmit}
                  disabled={!birthDetails.date}
                  className={`w-full py-3 rounded-md text-white font-medium transition-all duration-300
                    ${hasSubmittedBirthDetails 
                      ? 'bg-green-500 hover:bg-green-600' 
                      : birthDetails.date 
                        ? 'bg-pink-500 hover:bg-pink-600' 
                        : 'bg-gray-300 cursor-not-allowed'}`}
                >
                  {hasSubmittedBirthDetails 
                    ? '✓ Details Saved - Choose Your Sign Below' 
                    : birthDetails.date 
                      ? 'Save Birth Details' 
                      : 'Enter Birth Date to Save'}
                </button>
              </div>
            </div>
            {hasSubmittedBirthDetails && (
              <p className="text-green-600 text-sm mt-4 text-center">
                ✨ Your birth details have been saved. Select your zodiac sign below for a detailed reading! ✨
              </p>
            )}
          </div>
        )}
      </div>

      <h2 className="text-2xl mb-12 text-center font-semibold bg-gradient-to-r from-purple-600 to-violet-500 text-transparent bg-clip-text">
        {hasSubmittedBirthDetails 
          ? 'Select Your Sign for a Detailed Reading 🌟' 
          : 'Select Your Zodiac Sign 🌟'}
      </h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 max-w-7xl mx-auto">
        {zodiacSigns.map((sign) => (
          <Card
            key={sign.name}
            className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 bg-white/50 backdrop-blur-sm border-pink-100"
            onClick={() => generateHoroscope(sign.name)}
          >
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex flex-col items-center gap-2">
                  <div className="text-5xl mb-1 text-pink-500">{sign.symbol}</div>
                  <div className="text-4xl mb-2">{sign.emoji}</div>
                </div>
                <h2 className="text-xl font-semibold mb-2 text-purple-700">{sign.name}</h2>
                <p className="text-sm text-purple-600/80">{sign.dates}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Dialog open={!!selectedSign} onOpenChange={() => setSelectedSign(null)}>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto bg-white/95 backdrop-blur-sm">
          <DialogHeader>
            <DialogTitle className="text-2xl text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center gap-2">
              <span>{getSignEmoji(selectedSign || '')}</span>
              {selectedSign} {hasSubmittedBirthDetails ? 'Complete' : 'Daily'} Horoscope
              <span>{getSignEmoji(selectedSign || '')}</span>
            </DialogTitle>
            {hasSubmittedBirthDetails && (
              <p className="text-center text-purple-600 mt-2 text-sm">
                Based on your Sun, Moon, and Rising Signs ✨
              </p>
            )}
          </DialogHeader>
          <div className="mt-4 px-6">
            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-pink-500 mx-auto"></div>
                <p className="mt-2 text-purple-600">
                  {hasSubmittedBirthDetails 
                    ? '✨ Calculating your complete astrological profile...' 
                    : '✨ Consulting the stars...'}
                </p>
              </div>
            ) : (
              <div className="prose max-w-none py-4">
                {hasSubmittedBirthDetails && (
                  <div className="bg-purple-50/50 rounded-lg p-4 mb-6 border border-purple-100">
                    <h3 className="text-lg font-semibold text-purple-700 mb-2 flex items-center gap-2">
                      <span>🎭</span> Your Astrological Profile
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-white/80 rounded-md p-3 border border-pink-100">
                        <p className="font-medium text-pink-600">Sun Sign</p>
                        <p className="text-purple-800">{selectedSign}</p>
                      </div>
                      <div className="bg-white/80 rounded-md p-3 border border-pink-100">
                        <p className="font-medium text-pink-600">Moon Sign</p>
                        <div className="text-purple-800">
                          {isLoading ? (
                            'Calculating...'
                          ) : !birthDetails.date ? (
                            <span className="text-sm text-purple-600">Requires birth date</span>
                          ) : astroProfile.moonSign ? (
                            astroProfile.moonSign
                          ) : (
                            <span className="text-sm text-purple-600">Not available</span>
                          )}
                        </div>
                      </div>
                      <div className="bg-white/80 rounded-md p-3 border border-pink-100">
                        <p className="font-medium text-pink-600">Rising Sign</p>
                        <div className="text-purple-800">
                          {isLoading ? (
                            'Calculating...'
                          ) : !birthDetails.time || !birthDetails.location ? (
                            <span className="text-sm text-purple-600">Requires birth time & location</span>
                          ) : astroProfile.risingSign ? (
                            astroProfile.risingSign
                          ) : (
                            <span className="text-sm text-purple-600">Not available</span>
                          )}
                        </div>
                      </div>
                    </div>
                    {hasSubmittedBirthDetails && (
                      <p className="text-sm text-purple-600 mt-2">
                        {!birthDetails.time || !birthDetails.location ? 
                          '💫 For a complete reading including your Rising Sign, please provide both birth time and location.' :
                          '✨ Your complete astrological profile is ready!'}
                      </p>
                    )}
                  </div>
                )}
                <div className="whitespace-pre-wrap text-purple-800 leading-relaxed text-lg">
                  {horoscope}
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
} 