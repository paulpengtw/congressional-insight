'use client';

import Link from 'next/link';
import { Meeting } from '@/app/types';
import { MEETING } from '@/app/constants/zh';
import { ExternalLink } from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <div className="rounded-lg border bg-card p-6 hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h2 
            className="text-xl font-semibold mb-2"
          >
            {meeting[MEETING.MEETING_TITLE]}
          </h2>
          <Link 
            href={`/transportation/${meeting[MEETING.MEETING_CODE]}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            View Details
          </Link>
        </div>
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
    </div>
  );
} 