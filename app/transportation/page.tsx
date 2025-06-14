'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Building2 } from 'lucide-react';
import { Meeting as OriginalMeeting } from '../types';
import { MeetingCard } from './MeetingCard';
import { KEYWORDS, MEETING } from '../constants/zh';

interface EnhancedMeeting extends OriginalMeeting {
  agenda_lcidc_ids: string;
}

export default function TransportationPage() {
  const [selectedSession, setSelectedSession] = useState<string>('all');
  const [showDigitalOnly, setShowDigitalOnly] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [meetings, setMeetings] = useState<EnhancedMeeting[]>([]);

  useEffect(() => {
    const fetchMeetings = async () => {
      setLoading(true);
      try {
        const response = await fetch('https://v2.ly.govapi.tw/committee/23/meets');
        if (!response.ok) {
          throw new Error('Failed to fetch meetings');
        }
        const data = await response.json();
        console.log('Fetched meetings data:', data);
        const meetingsWithIds = data.meets.map((meeting: any) => {
          const agendaLcidcIds = meeting.公報發言紀錄?.[0]?.agenda_lcidc_ids || [];
          console.log('Extracted agenda_lcidc_ids:', agendaLcidcIds);
          return {
            ...meeting,
            agenda_lcidc_ids: agendaLcidcIds[0] || '' // Use the first ID if available
          };
        });
        setMeetings(meetingsWithIds as EnhancedMeeting[] || []);
        console.log('Agenda LCIDC IDs:', meetingsWithIds.map((m: EnhancedMeeting) => m.agenda_lcidc_ids));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchMeetings();
  }, []);

  const isDigitalRelated = (meeting: EnhancedMeeting) => {
    // Check if meeting content contains digital/communications related keywords
    const keywords = [
      KEYWORDS.DIGITAL,
      KEYWORDS.COMMUNICATION,
      KEYWORDS.NETWORK,
      KEYWORDS.INFORMATION,
      KEYWORDS.TECHNOLOGY
    ];
    const content = meeting[MEETING.TRANSCRIPT]?.[0]?.meetingContent || '';
    return keywords.some(keyword => content.includes(keyword));
  };

  const filteredMeetings = meetings.filter(meeting => {
    if (selectedSession !== 'all' && meeting[MEETING.SESSION].toString() !== selectedSession) {
      return false;
    }
    if (showDigitalOnly && !isDigitalRelated(meeting)) {
      return false;
    }
    return true;
  });

  const uniqueSessions = Array.from(new Set(meetings.map(m => m[MEETING.SESSION]))).sort((a, b) => b - a);

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
        <div className="mb-8 space-y-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <select
              value={selectedSession}
              onChange={(e) => setSelectedSession(e.target.value)}
              className="px-3 py-2 border rounded-md"
            >
              <option value="all">All Sessions</option>
              {uniqueSessions.map((session) => (
                <option key={session} value={session.toString()}>
                  Session {session}
                </option>
              ))}
            </select>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={showDigitalOnly}
                onChange={(e) => setShowDigitalOnly(e.target.checked)}
                className="h-4 w-4"
              />
              Show Digital/Communications Related Only
            </label>
          </div>
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

        <div className="space-y-6">
          {filteredMeetings.map((meeting) => (
            <MeetingCard key={meeting[MEETING.MEETING_CODE]} meeting={meeting} />
          ))}
        </div>
      </main>
    </div>
  );
}
