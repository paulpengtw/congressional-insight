import { MEETING } from './constants/zh';

type Meeting = {
  [MEETING.MEETING_CODE]: string;
  [MEETING.MEETING_TITLE]: string;
  [MEETING.DATE]: string[];
  [MEETING.SESSION]: number;
  [MEETING.TRANSCRIPT]?: {
    meetingRoom: string;
    meetingContent: string;
  }[];
  [MEETING.MINUTES]?: {
    agenda_lcidc_ids: string[];
  };
  '公報發言紀錄'?: {
    agenda_lcidc_ids: string[];
    meet_name: string;
    content: string;
  }[];
}

export type Transcript = {
  id: string;
  content: string;
  date: string;
  sentiment?: number;
  topic?: string;
  summary?: string;
};

export type Congressman = {
  name: string;
  party: string;
  state: string;
  imageUrl?: string;
};

export type { Meeting }; 