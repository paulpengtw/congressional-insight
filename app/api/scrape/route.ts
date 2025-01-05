import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export const runtime = 'edge';

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const targetUrl = url.searchParams.get('url');
    const selector = url.searchParams.get('selector') || 'body';

    if (!targetUrl) {
      return new NextResponse('URL parameter is required', {
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; CongressionalInsight/1.0)',
        'Accept': '*/*',
      }
    });

    if (!response.ok) {
      return new NextResponse(`Failed to fetch content: ${response.statusText}`, {
        status: response.status,
        headers: {
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    const contentType = response.headers.get('Content-Type') || '';
    let content = '';

    const rawText = await response.text();
    
    if (contentType.includes('text/html')) {
      const $ = cheerio.load(rawText);
      content = $(selector).text().trim();
    } else {
      // For non-HTML content (like .doc files), just return the raw text
      content = rawText.trim();
    }

    if (!content) {
      return new NextResponse(JSON.stringify({ error: 'No content found' }), {
        status: 404,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        }
      });
    }

    return new NextResponse(JSON.stringify({ content }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });

  } catch (error) {
    console.error('Scraping error:', error);
    return new NextResponse(JSON.stringify({ error: 'Failed to scrape content' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      }
    });
  }
} 