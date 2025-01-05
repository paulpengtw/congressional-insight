import { MeetingDetail } from '../components/MeetingDetail';
import { ApiResponse } from '../types';
import { MEETING } from '@/app/constants/zh';

export async function generateStaticParams() {
  try {
    const response = await fetch('https://v2.ly.govapi.tw/committee/23/meets');
    if (!response.ok) {
      return [];
    }
    const data: ApiResponse = await response.json();
    return data.meets.map((meeting) => ({
      meetingId: meeting[MEETING.MEETING_CODE],
    }));
  } catch (error) {
    console.error('Error fetching meetings:', error);
    return [];
  }
}

export default function MeetingPage({ params }: { params: { meetingId: string } }) {
  return <MeetingDetail meetingId={params.meetingId} />;
} 