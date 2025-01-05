import Link from 'next/link';
import { Meeting } from '../types';
import { MEETING } from '@/app/constants/zh';

interface MeetingCardProps {
  meeting: Meeting;
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  const transcriptUrl = `https://ly.govapi.tw/gazette_agenda/${meeting[MEETING.MINUTES]?.agenda_lcidc_ids?.[0]}/html`;
  
  return (
    <div className="rounded-lg border bg-card p-6 hover:border-primary transition-colors">
      <div className="flex justify-between items-start mb-2">
        <Link href={`/transportation/${meeting[MEETING.MEETING_CODE]}`}>
          <h3 className="text-lg font-semibold hover:text-primary">
            {meeting[MEETING.MEETING_TITLE]}
          </h3>
        </Link>
        <a 
          href={transcriptUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-primary hover:underline"
        >
          {MEETING.VIEW_TRANSCRIPT}
        </a>
      </div>
      <p className="text-sm text-muted-foreground mb-4">
        {meeting[MEETING.DATE].join(', ')}
      </p>
      {meeting[MEETING.TRANSCRIPT]?.[0] && (
        <div>
          <p className="text-sm text-muted-foreground mb-2">
            {meeting[MEETING.TRANSCRIPT][0].meetingRoom}
          </p>
          <p className="text-sm">
            {meeting[MEETING.TRANSCRIPT][0].meetingContent}
          </p>
        </div>
      )}
    </div>
  );
} 