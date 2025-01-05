export interface Congressman {
  id: string;
  name: string;
  party: 'Democrat' | 'Republican' | 'Independent';
  state: string;
  imageUrl?: string;
}

export interface Transcript {
  id: string;
  congressmanId: string;
  date: string;
  topic: string;
  content: string;
  tags: string[];
  meetingId: string;
}

export interface Meeting {
  id: string;
  title: string;
  date: string;
  description: string;
  committee: string;
  agenda_lcidc_ids?: string[];
}