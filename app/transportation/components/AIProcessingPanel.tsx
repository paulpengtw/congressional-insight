'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

interface AIProcessingPanelProps {
  agendaLcidcId: string;
}

export default function AIProcessingPanel({ agendaLcidcId }: AIProcessingPanelProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('');

  const loadContent = async () => {
    try {
      setIsLoading(true);
      setError(null);
      // For .doc files, we'll use the proxy endpoint
      const targetUrl = `https://r.jina.ai/lydata.ronny-s3.click/agenda-txt/LCIDC01_${agendaLcidcId}.doc`;
      console.log('Fetching:', targetUrl);
      
      // First try direct fetch
      let response = await fetch(targetUrl);
      
      if (!response.ok) {
        // If direct fetch fails, try the text version
        const textUrl = targetUrl.replace('.doc', '.txt');
        console.log('Trying text version:', textUrl);
        response = await fetch(textUrl);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch content: ${response.statusText}`);
        }
      }
      
      const text = await response.text();
      if (!text.trim()) {
        throw new Error('Received empty content');
      }
      setContent(text);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to load content');
    } finally {
      setIsLoading(false);
    }
  };

  const scrapeContent = async () => {
    if (!url) {
      setError('Please enter a URL to scrape');
      return;
    }

    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch(`/api/scrape?url=${encodeURIComponent(url)}`);
      
      if (!response.ok) {
        throw new Error(`Failed to scrape content: ${response.statusText}`);
      }
      
      const data = await response.json();
      setContent(data.content);
    } catch (error) {
      console.error('Error:', error);
      setError(error instanceof Error ? error.message : 'Failed to scrape content');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button onClick={loadContent} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Show Original Content'}
        </Button>
        <div className="flex-1 flex gap-2">
          <Input
            type="url"
            placeholder="Enter URL to scrape"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={scrapeContent} disabled={isLoading}>
            {isLoading ? 'Scraping...' : 'Scrape Content'}
          </Button>
        </div>
      </div>
      
      {error && (
        <div className="text-red-500">{error}</div>
      )}
      
      {content && (
        <div className="whitespace-pre-wrap border rounded p-4 bg-gray-50">
          {content}
        </div>
      )}
    </div>
  );
} 