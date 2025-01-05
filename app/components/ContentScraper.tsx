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

interface ContentScraperProps {
  onContentProcessed?: (content: string) => void;
}

export function ContentScraper({ onContentProcessed }: ContentScraperProps) {
  const [url, setUrl] = useState('');
  const [selector, setSelector] = useState('');
  const [processingType, setProcessingType] = useState('summarize');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [reprocessing, setReprocessing] = useState(false);

  const handleScrape = async () => {
    if (!url) {
      setError('Please enter a URL');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const params = new URLSearchParams({
        url,
        ...(selector && { selector }),
        processingType,
      });

      const response = await fetch(`/api/enhanced-scrape?${params}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to scrape content');
      }

      setResult(data.content);
      onContentProcessed?.(data.content);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleReprocess = async () => {
    if (!result) return;

    setReprocessing(true);
    setError(null);

    try {
      const response = await fetch('/api/process-content', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          content: result,
          operation: processingType,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process content');
      }

      setResult(data.result);
      onContentProcessed?.(data.result);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setReprocessing(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-card">
      <div className="space-y-2">
        <Input
          type="url"
          placeholder="Enter URL to scrape"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="w-full"
        />
        <Input
          type="text"
          placeholder="CSS Selector (optional, e.g., 'article.content')"
          value={selector}
          onChange={(e) => setSelector(e.target.value)}
          className="w-full"
        />
        <Select
          value={processingType}
          onValueChange={setProcessingType}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select processing type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="summarize">Summarize</SelectItem>
            <SelectItem value="analyze">Analyze</SelectItem>
            <SelectItem value="extract">Extract Facts</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <Button 
        onClick={handleScrape} 
        disabled={loading || reprocessing}
        className="w-full"
      >
        {loading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processing...
          </>
        ) : (
          'Scrape & Process'
        )}
      </Button>

      {error && (
        <div className="p-4 text-sm text-red-500 bg-red-50 rounded">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">Processed Content:</h3>
            <Button
              variant="outline"
              size="sm"
              onClick={handleReprocess}
              disabled={reprocessing}
            >
              {reprocessing ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Reprocess
                </>
              )}
            </Button>
          </div>
          <div className="p-4 text-sm bg-muted rounded">
            <p className="whitespace-pre-wrap">{result}</p>
          </div>
        </div>
      )}
    </div>
  );
} 