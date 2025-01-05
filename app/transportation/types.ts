export interface Meeting {
  會議代碼: string;
  會議標題: string;
  日期: string[];
  會期: number;
  屆: number;
  發言紀錄: Array<{
    meetingContent: string;
    meetingRoom: string;
  }>;
  議事錄?: {
    agenda_lcidc_ids?: string[];
  };
}

export interface ApiResponse {
  meets: Meeting[];
}

export interface Session {
  term: number;
  session: number;
} 