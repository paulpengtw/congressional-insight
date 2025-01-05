import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const agendaId = searchParams.get('agendaId');

  console.log('Received agendaId:', agendaId);

  if (!agendaId) {
    return NextResponse.json({ success: false, error: 'Agenda ID is required' }, { status: 400 });
  }

  try {
    // First try to get the agenda_lcidc_ids from the meeting data
    console.log('Fetching meeting data...');
    const meetingResponse = await fetch('https://v2.ly.govapi.tw/committee/23/meets');
    
    if (!meetingResponse.ok) {
      throw new Error(`Failed to fetch meeting data: ${meetingResponse.statusText}`);
    }

    const meetingData = await meetingResponse.json();
    console.log('Meeting data received, total meetings:', meetingData.meets?.length);
    
    const meeting = meetingData.meets.find((m: any) => {
      console.log('Checking meeting:', m.會議代碼, 'against:', agendaId);
      return m.會議代碼 === agendaId;
    });
    
    console.log('Found meeting:', meeting ? 'yes' : 'no');
    console.log('Meeting data:', JSON.stringify(meeting, null, 2));
    
    if (!meeting) {
      throw new Error(`Meeting not found for ID: ${agendaId}`);
    }

    if (!meeting.公報發言紀錄?.[0]?.agenda_lcidc_ids?.[0]) {
      throw new Error('No agenda LCIDC ID found for this meeting');
    }

    const agendaLcidcId = meeting.公報發言紀錄[0].agenda_lcidc_ids[0];
    console.log('Found agendaLcidcId:', agendaLcidcId);
    
    // Now fetch the actual content using the agenda_lcidc_id
    console.log('Fetching content from:', `https://r.jina.ai/lydata.ronny-s3.click/agenda-txt/LCIDC01_${agendaLcidcId}.doc`);
    const contentResponse = await fetch(`https://r.jina.ai/lydata.ronny-s3.click/agenda-txt/LCIDC01_${agendaLcidcId}.doc`);
    
    if (!contentResponse.ok) {
      throw new Error(`Failed to fetch content: ${contentResponse.statusText} (${contentResponse.status})`);
    }

    const content = await contentResponse.text();
    console.log('Content length:', content.length);
    
    return NextResponse.json({
      success: true,
      content,
      agendaLcidcId
    });
  } catch (error) {
    console.error('Error in meeting-content API:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to fetch meeting content',
        details: error instanceof Error ? error.stack : undefined
      },
      { status: 500 }
    );
  }
} 