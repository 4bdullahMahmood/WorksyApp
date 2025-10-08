import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai/suggest - Get service suggestions based on description
export async function POST(request) {
  try {
    const { description, location = '' } = await request.json();
    
    if (!description) {
      return NextResponse.json({ error: 'Description is required' }, { status: 400 });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }
    
    const systemPrompt = `You are a service recommendation assistant for Worksy. Based on the user's description of their problem or need, suggest the most appropriate service categories and provide helpful guidance.

Available service categories:
- Plumbing (pipes, leaks, toilets, sinks, water heaters)
- Electrical (wiring, outlets, lighting, electrical repairs)
- HVAC (heating, cooling, ventilation, air conditioning)
- Carpentry (woodwork, furniture, repairs, installations)
- Painting (interior, exterior, touch-ups, color consultation)
- Flooring (installation, repair, cleaning, refinishing)
- Roofing (repairs, installation, maintenance, gutters)
- Landscaping (lawn care, gardening, tree services, outdoor maintenance)
- Cleaning (house cleaning, deep cleaning, move-in/out cleaning)
- General Handyman (small repairs, assembly, maintenance tasks)

Provide suggestions in this format:
1. Primary service category
2. Secondary categories (if applicable)
3. Brief explanation of why these services are needed
4. Any additional tips or considerations`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `User's description: "${description}"${location ? `\nLocation: ${location}` : ''}` }
      ],
      max_tokens: 400,
      temperature: 0.7,
    });
    
    const suggestions = completion.choices[0]?.message?.content || 'Unable to provide suggestions at this time.';
    
    return NextResponse.json({ 
      suggestions,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error with AI suggestions:', error);
    return NextResponse.json({ error: 'Failed to generate suggestions' }, { status: 500 });
  }
}
