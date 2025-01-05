'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, RefreshCw } from 'lucide-react';

interface AIProcessingPanelProps {
  agendaLcidcId: string;
}

const DEFAULT_CHUNK_SIZE = 4000;  // Default chunk size in characters

export default function AIProcessingPanel({ agendaLcidcId }: AIProcessingPanelProps) {
  const [content, setContent] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [url, setUrl] = useState<string>('');
  const [processingType, setProcessingType] = useState('summarize');
  const [reprocessing, setReprocessing] = useState(false);
  const [chunkSize, setChunkSize] = useState(DEFAULT_CHUNK_SIZE);

  // Split content into chunks of roughly equal size
  const splitContentIntoChunks = (text: string, size: number): string[] => {
    const chunks: string[] = [];
    let currentChunk = '';
    const sentences = text.split(/(?<=[.!?])\s+/);

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > size && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }
    
    if (currentChunk) {
      chunks.push(currentChunk.trim());
    }
    
    return chunks;
  };

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

  const handleReprocess = async () => {
    if (!content) return;

    setReprocessing(true);
    setError(null);

    try {
      const contentChunks = splitContentIntoChunks(content, chunkSize);
      let processedResults: string[] = [];

      for (let i = 0; i < contentChunks.length; i++) {
        const chunk = contentChunks[i];
        const chunkNumber = i + 1;
        const totalChunks = contentChunks.length;
        
        const response = await fetch('/api/process-content', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            content: chunk,
            operation: processingType,
            context: `This is part ${chunkNumber} of ${totalChunks} of the document.`,
          }),
        });

        if (!response.ok) {
          const errorData = await response.text();
          console.error('Error response:', errorData);
          throw new Error(errorData || 'Failed to process content');
        }

        const data = await response.json();
        processedResults.push(data.result);
      }

      // Combine all results
      const combinedResult = processedResults.join('\n\n---\n\n');
      setContent(combinedResult);
    } catch (err) {
      console.error('Processing error:', err);
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setReprocessing(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Button onClick={loadContent} disabled={isLoading || reprocessing}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Loading...
            </>
          ) : (
            'Show Original Content'
          )}
        </Button>
        <div className="flex-1 flex gap-2">
          <Input
            type="url"
            placeholder="Enter URL to scrape"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="flex-1"
          />
          <Button onClick={scrapeContent} disabled={isLoading || reprocessing}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Scraping...
              </>
            ) : (
              'Scrape Content'
            )}
          </Button>
        </div>
      </div>

      <div className="flex gap-2">
        <Select
          value={processingType}
          onValueChange={setProcessingType}
        >
          <SelectTrigger className="w-[200px]">
            <SelectValue placeholder="Select processing type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summarize">Summarize</SelectItem>
            <SelectItem value="analyze">Analyze</SelectItem>
            <SelectItem value="extract">Extract Facts</SelectItem>
          </SelectContent>
        </Select>

        <Input
          type="number"
          placeholder="Chunk size (characters)"
          value={chunkSize}
          onChange={(e) => setChunkSize(Math.max(100, parseInt(e.target.value) || DEFAULT_CHUNK_SIZE))}
          className="w-[200px]"
        />

        {content && (
          <Button
            variant="outline"
            size="default"
            onClick={handleReprocess}
            disabled={reprocessing}
          >
            {reprocessing ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <RefreshCw className="h-4 w-4 mr-2" />
                Reprocess Content
              </>
            )}
          </Button>
        )}
      </div>
      
      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}
      
      {content && (
        <div className="whitespace-pre-wrap border rounded p-4 bg-gray-50">
          {content}
        </div>
      )}
    </div>
  );
} 