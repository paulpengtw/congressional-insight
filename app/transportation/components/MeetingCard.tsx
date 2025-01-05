'use client';

import Link from 'next/link';
import { Meeting } from '../types';
import { MEETING } from '@/app/constants/zh';
import { ExternalLink } from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const transcriptUrl = `https://ly.govapi.tw/gazette_agenda/${meeting[MEETING.MEETING_CODE]}/html`;
  
  return (
    <div className="rounded-lg border bg-card p-6 hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-2">
        <Link href={`/transportation/${meeting[MEETING.MEETING_CODE]}`}>
          <h2 className="text-xl font-semibold mb-2">
            {meeting[MEETING.MEETING_TITLE]}
          </h2>
          <div className="flex items-center space-x-2 text-blue-600 hover:text-blue-800">
            <ExternalLink className="h-4 w-4" />
            <span>{MEETING.VIEW_TRANSCRIPT}</span>
          </div>
          <div className="text-gray-600">
            {meeting[MEETING.DATE].join(', ')}
          </div>
          {meeting[MEETING.TRANSCRIPT]?.[0] && (
            <div className="mt-4">
              <div className="text-sm text-gray-500">
                {meeting[MEETING.TRANSCRIPT][0].meetingRoom}
              </div>
              <p className="text-gray-700 line-clamp-3">
                {meeting[MEETING.TRANSCRIPT][0].meetingContent}
              </p>
            </div>
          )}
        </Link>
      </div>
    </div>
  );
} 