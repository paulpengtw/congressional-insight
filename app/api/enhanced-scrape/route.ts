import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Simple in-memory cache (consider using Redis or similar in production)
const cache = new Map<string, { content: string; timestamp: number }>();
const CACHE_DURATION = 1000 * 60 * 60; // 1 hour

export const runtime = 'edge';

async function scrapeContent(url: string, selector: string = 'body'): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CongressionalInsight/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      }
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const contentType = response.headers.get('Content-Type') || '';
    const html = await response.text();

    if (contentType.includes('text/html')) {
      const $ = cheerio.load(html);
      // Remove script tags, style tags, and comments
      $('script').remove();
      $('style').remove();
      $('comment').remove();
      
      return $(selector).text().trim();
    }
    
    return html.trim();
  } catch (error) {
    console.error('Scraping error:', error);
    throw error;
  }
}

async function processWithAI(content: string, processingType: string = 'summarize'): Promise<string> {
  const promptMap = {
    summarize: 'Please provide a concise summary of the following content in zh-tw:',
    analyze: 'Please analyze the key points and insights from the following content in zh-tw:',
    extract: 'Please list the perspective of each member (focus on 委員 only) in the following content in zh-tw:',
    // extract: 'Please extract the main facts and data points from the following content:',
    列出每個委員的發言: 'Please list the perspective of each member (focus on 委員 only) in the following content:',
  };

  const prompt = `${promptMap[processingType as keyof typeof promptMap] || promptMap.summarize}\n\n${content}`;

  const completion = await openai.chat.completions.create({
    messages: [{ role: "user", content: prompt }],
    model: "gpt-4o-mini",
    temperature: 0.7,
    max_tokens: 2000,
  });

  return completion.choices[0].message.content || '';
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    const selector = url.searchParams.get('selector') || 'body';
    const processingType = url.searchParams.get('processingType') || 'summarize';
    const skipCache = url.searchParams.get('skipCache') === 'true';

    if (!targetUrl) {
      return new NextResponse('URL parameter is required', { status: 400 });
    }

    // Check cache first
    const cacheKey = `${targetUrl}-${selector}-${processingType}`;
    const cachedData = cache.get(cacheKey);
    
    if (!skipCache && cachedData && (Date.now() - cachedData.timestamp) < CACHE_DURATION) {
      return new NextResponse(JSON.stringify({ 
        content: cachedData.content,
        fromCache: true 
      }), {
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    const scrapedContent = await scrapeContent(targetUrl, selector);
    const processedContent = await processWithAI(scrapedContent, processingType);

    // Update cache
    cache.set(cacheKey, {
      content: processedContent,
      timestamp: Date.now()
    });

    return new NextResponse(JSON.stringify({
      content: processedContent,
      fromCache: false
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Error:', error);
    return new NextResponse(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'An error occurred' 
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
} 