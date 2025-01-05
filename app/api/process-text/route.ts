import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    const { text, operation } = await request.json();

    if (!text || !operation) {
      return NextResponse.json(
        { error: 'Text and operation are required' },
        { status: 400 }
      );
    }

    let prompt = '';
    switch (operation) {
      case 'summary':
        prompt = `Please provide a concise summary of the following meeting text in Traditional Chinese:\n\n${text}`;
        break;
      case 'key-points':
        prompt = `Please extract the key points and decisions from the following meeting text in Traditional Chinese:\n\n${text}`;
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid operation' },
          { status: 400 }
        );
    }

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "gpt-3.5-turbo",
    });

    return NextResponse.json({
      result: completion.choices[0].message.content
    });

  } catch (error) {
    console.error('Error processing text:', error);
    return NextResponse.json(
      { error: 'Failed to process text' },
      { status: 500 }
    );
  }
} 