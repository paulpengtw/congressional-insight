import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { success: false, error: 'OpenAI API key is not configured' },
      { status: 500 }
    );
  }

  try {
    const { content, operation } = await request.json();

    if (!content) {
      return NextResponse.json(
        { success: false, error: 'Content is required' },
        { status: 400 }
      );
    }

    const promptMap = {
      summarize: 'Please provide a concise summary of the following content:',
      analyze: 'Please analyze the key points and insights from the following content:',
      extract: 'Please extract the main facts and data points from the following content:',
    };

    const selectedPrompt = promptMap[operation as keyof typeof promptMap] || promptMap.summarize;
    const finalPrompt = `${selectedPrompt}\n\n${content}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: finalPrompt }],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
    });

    return NextResponse.json({
      success: true,
      result: completion.choices[0].message.content
    });
  } catch (error) {
    console.error('Error processing content with OpenAI:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to process content' },
      { status: 500 }
    );
  }
} 