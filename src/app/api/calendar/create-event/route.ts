import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { createMeetEvent, CalendarEvent } from '@/services/calendar/google-calendar'

export const runtime = 'nodejs';

export async function POST(request: NextRequest) {
  try {
    // Vérifier l'authentification
    const supabase = createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    const body = await request.json() as {
      calendarId: string
      event: CalendarEvent
    }

    if (!body.calendarId || !body.event) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    const result = await createMeetEvent(body.calendarId, body.event)

    return NextResponse.json({
      success: true,
      data: result,
    })
  } catch (error) {
    console.error('Error in create event API:', error)
    return NextResponse.json(
      { error: 'Failed to create calendar event' },
      { status: 500 }
    )
  }
}

