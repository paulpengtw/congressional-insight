import { NextResponse } from 'next/server';
import OpenAI from 'openai';

export const dynamic = 'force-dynamic';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  console.log('API route handler called');

  // Add CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Handle preflight request
  if (request.method === 'OPTIONS') {
    return new NextResponse(null, { headers });
  }

  if (!process.env.OPENAI_API_KEY) {
    console.error('OpenAI API key not configured');
    return NextResponse.json(
      { success: false, error: 'OpenAI API key is not configured' },
      { status: 500, headers }
    );
  }

  try {
    const { content, operation, context } = await request.json();
    console.log('Received request with operation:', operation);

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400, headers }
      );
    }

    const promptMap = {
      summarize: 'Please provide a concise summary of the following content in zh-tw:',
      analyze: 'Please analyze the key points and insights from the following content:',
      extract: 'Please extract the main facts and data points from the following content:',
    };

    const selectedPrompt = promptMap[operation as keyof typeof promptMap] || promptMap.summarize;
    const contextInfo = context ? `\n\nContext: ${context}` : '';
    const finalPrompt = `${selectedPrompt}${contextInfo}\n\n${content}`;

    try {
      console.log('Calling OpenAI API...');
      const completion = await openai.chat.completions.create({
        messages: [{ role: "user", content: finalPrompt }],
        model: "gpt-4o-mini",
        temperature: 0.7,
        max_tokens: 500,
      });

      return NextResponse.json({
        success: true,
        result: completion.choices[0].message.content
      }, { headers });
    } catch (openaiError: any) {
      console.error('OpenAI API Error:', openaiError);
      return NextResponse.json(
        { 
          success: false, 
          error: `OpenAI API Error: ${openaiError.message || 'Unknown error'}`,
          details: openaiError.response?.data || {}
        },
        { status: 500, headers }
      );
    }
  } catch (error: any) {
    console.error('Error processing content:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: `Failed to process content: ${error.message || 'Unknown error'}`
      },
      { status: 500, headers }
    );
  }
} 