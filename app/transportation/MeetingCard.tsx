import Link from 'next/link';
import { Meeting } from '../types';
import { MEETING } from '@/app/constants/zh';
import { ExternalLink } from 'lucide-react';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const transcriptUrl = meeting['公報發言紀錄']?.[0]?.agenda_lcidc_ids?.[0]
    ? `https://ly.govapi.tw/gazette_agenda/${meeting['公報發言紀錄'][0].agenda_lcidc_ids[0]}/html`
    : null;
  
  const transcript = meeting[MEETING.TRANSCRIPT]?.[0];
  const encodedMeetingCode = encodeURIComponent(meeting[MEETING.MEETING_CODE]);
  
  return (
    <div className="rounded-lg border bg-card p-6 hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 
            className="text-lg font-semibold mb-2 hover:text-primary"
          >
            {meeting[MEETING.MEETING_TITLE]}
            {transcriptUrl && (
              <a 
                href={transcriptUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center ml-2 text-muted-foreground hover:text-primary"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </h3>
          <Link 
            href={`/transportation/${encodedMeetingCode}`}
            className="text-sm text-muted-foreground hover:text-primary"
          >
            View Details
          </Link>
        </div>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {meeting[MEETING.DATE].join(', ')}
      </p>
      {transcript && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {transcript.meetingRoom}
          </p>
          <p className="text-sm">
            {transcript.meetingContent}
          </p>
        </div>
      )}
    </div>
  );
} 