'use client';

import { useState, useEffect } from 'react';
import { Building2, ArrowLeft, ExternalLink, FileText } from 'lucide-react';
import Link from 'next/link';
import { Meeting, ApiResponse } from '../types';
import { MEETING } from '@/app/constants/zh';
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface MeetingDetailProps {
  meetingId: string;
}

export function MeetingDetail({ meetingId }: MeetingDetailProps) {
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingText, setProcessingText] = useState(false);
  const [aiResult, setAiResult] = useState<string | null>(null);
  const [operation, setOperation] = useState<'summary' | 'key-points'>('summary');

  useEffect(() => {
    const fetchMeeting = async () => {
      try {
        const meetingResponse = await fetch('https://v2.ly.govapi.tw/committee/23/meets');
        if (!meetingResponse.ok) {
          throw new Error('Failed to fetch meeting details');
        }
        
        const data: ApiResponse = await meetingResponse.json();
        const meetingDetail = data.meets.find(m => m[MEETING.MEETING_CODE] === decodeURIComponent(meetingId));
        
        if (!meetingDetail) {
          throw new Error('Meeting not found');
        }
        
        setMeeting(meetingDetail);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMeeting();
  }, [meetingId]);

  const transcriptUrl = meeting?.['公報發言紀錄']?.[0]?.agenda_lcidc_ids?.[0]
    ? `https://ly.govapi.tw/gazette_agenda/${meeting['公報發言紀錄'][0].agenda_lcidc_ids[0]}/html`
    : null;

  const handleProcessText = async () => {
    if (!meeting?.['公報發言紀錄']?.[0]?.agenda_lcidc_ids?.[0]) return;
    
    setProcessingText(true);
    setAiResult(null);
    setError(null);
    
    try {
      // First fetch the text content
      const agendaId = meeting['公報發言紀錄'][0].agenda_lcidc_ids[0];
      const textResponse = await fetch(`https://lydata.ronny-s3.click/agenda-txt/LCIDC01_${agendaId}.doc`, {
        mode: 'no-cors',
        headers: {
          'Accept': 'text/plain'
        }
      });
      
      let text;
      try {
        text = await textResponse.text();
      } catch (err) {
        throw new Error('無法讀取會議文字內容，請稍後再試');
      }
      
      if (!text) {
        throw new Error('會議文字內容為空');
      }
      
      // Then process with OpenAI
      const aiResponse = await fetch('/api/process-text', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          text,
          operation,
        }),
      });
      
      if (!aiResponse.ok) throw new Error('AI 處理失敗');
      
      const { result } = await aiResponse.json();
      setAiResult(result);
    } catch (err) {
      setError(err instanceof Error ? err.message : '處理失敗，請稍後再試');
    } finally {
      setProcessingText(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Link href="/" className="flex items-center gap-2">
                <Building2 className="h-6 w-6" />
                <h1 className="text-xl font-bold">Congressional Insights</h1>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link 
            href="/transportation" 
            className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Meetings
          </Link>
        </div>

        {loading && (
          <div className="flex justify-center items-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center py-8">
            Error: {error}
          </div>
        )}

        {meeting && (
          <div className="space-y-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <h2 className="text-2xl font-bold">{meeting[MEETING.MEETING_TITLE]}</h2>
                {transcriptUrl && (
                  <a 
                    href={transcriptUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center text-muted-foreground hover:text-primary"
                    title="View Full Transcript"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                )}
              </div>
              <div className="text-gray-600 mb-6">
                {meeting[MEETING.DATE].join(', ')}
              </div>
            </div>

            {meeting['公報發言紀錄']?.[0]?.agenda_lcidc_ids?.[0] && (
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <Select
                    value={operation}
                    onValueChange={(value: 'summary' | 'key-points') => setOperation(value)}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select operation" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="summary">摘要</SelectItem>
                      <SelectItem value="key-points">重點整理</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button
                    onClick={handleProcessText}
                    disabled={processingText}
                    className="flex items-center gap-2"
                  >
                    <FileText className="h-4 w-4" />
                    {processingText ? '處理中...' : 'AI 分析'}
                  </Button>
                </div>

                {aiResult && (
                  <Alert>
                    <AlertDescription className="whitespace-pre-wrap">
                      {aiResult}
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {meeting[MEETING.TRANSCRIPT]?.[0] && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold mb-4">{MEETING.MEETING_CONTENT}</h3>
                <div className="text-gray-500">
                  {meeting[MEETING.TRANSCRIPT][0].meetingRoom}
                </div>
                <div className="prose max-w-none">
                  {meeting[MEETING.TRANSCRIPT][0].meetingContent}
                </div>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
} 