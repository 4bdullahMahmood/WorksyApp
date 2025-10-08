import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /api/ai - Chat with AI assistant
export async function POST(request) {
  try {
    const { message, context = 'general' } = await request.json();
    
    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }
    
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: 'OpenAI API key not configured' }, { status: 500 });
    }
    
    // Create system prompt based on context
    let systemPrompt = `You are a helpful assistant for Worksy, a platform that connects customers with tradesmen, contractors, and handymen. 
    Help users find the right services for their needs. Be friendly, professional, and provide helpful suggestions.`;
    
    if (context === 'service_search') {
      systemPrompt += ` Focus on helping users describe their home improvement or repair needs and suggest appropriate service categories.`;
    } else if (context === 'booking_help') {
      systemPrompt += ` Help users with booking questions, scheduling, and service-related inquiries.`;
    }
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      max_tokens: 500,
      temperature: 0.7,
    });
    
    const aiResponse = completion.choices[0]?.message?.content || 'Sorry, I could not process your request.';
    
    return NextResponse.json({ 
      response: aiResponse,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error with AI chat:', error);
    return NextResponse.json({ error: 'Failed to process AI request' }, { status: 500 });
  }
}
