export interface Meeting {
  會議代碼: string;  // Format: 委員會-11-1-23-10
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
  // IMPORTANT: This is the correct field to get agenda_lcidc_ids for fetching meeting content
  // agenda_lcidc_ids format example: "11311001_00006"
  // The URL should be: https://r.jina.ai/lydata.ronny-s3.click/agenda-txt/LCIDC01_${agenda_lcidc_id}.doc
  公報發言紀錄?: Array<{
    agenda_lcidc_ids: string[];
  }>;
}

export interface ApiResponse {
  meets: Meeting[];
}

export interface Session {
  term: number;
  session: number;
} 