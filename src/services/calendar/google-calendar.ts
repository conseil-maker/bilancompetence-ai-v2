import { google } from 'googleapis'
import { addHours, format } from 'date-fns'

const calendar = google.calendar('v3')

export interface CalendarEvent {
  id?: string
  summary: string
  description?: string
  start: Date
  end: Date
  attendees?: string[]
  location?: string
  conferenceData?: {
    createRequest?: {
      requestId: string
      conferenceSolutionKey: {
        type: string
      }
    }
  }
}

export interface CalendarAvailability {
  date: Date
  slots: {
    start: Date
    end: Date
    available: boolean
  }[]
}

async function getAuthClient() {
  if (!process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL || !process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY) {
    throw new Error('Google Calendar credentials not configured')
  }
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      private_key: process.env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    },
    scopes: ['https://www.googleapis.com/auth/calendar'],
  })

  return auth.getClient()
}

export async function createEvent(
  calendarId: string,
  event: CalendarEvent
): Promise<string> {
  try {
    const auth = await getAuthClient()

    const response = await calendar.events.insert({
      auth: auth as any,
      calendarId,
      conferenceDataVersion: 1,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: 'Europe/Paris',
        },
        attendees: event.attendees?.map(email => ({ email })),
        location: event.location,
        conferenceData: event.conferenceData,
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 }, // 1 jour avant
            { method: 'popup', minutes: 60 }, // 1 heure avant
          ],
        },
      },
    })

    return response.data.id!
  } catch (error) {
    console.error('Error creating calendar event:', error)
    throw new Error('Failed to create calendar event')
  }
}

export async function updateEvent(
  calendarId: string,
  eventId: string,
  updates: Partial<CalendarEvent>
): Promise<void> {
  try {
    const auth = await getAuthClient()

    await calendar.events.patch({
      auth: auth as any,
      calendarId,
      eventId,
      requestBody: {
        summary: updates.summary,
        description: updates.description,
        start: updates.start ? {
          dateTime: updates.start.toISOString(),
          timeZone: 'Europe/Paris',
        } : undefined,
        end: updates.end ? {
          dateTime: updates.end.toISOString(),
          timeZone: 'Europe/Paris',
        } : undefined,
        attendees: updates.attendees?.map(email => ({ email })),
        location: updates.location,
      },
    })
  } catch (error) {
    console.error('Error updating calendar event:', error)
    throw new Error('Failed to update calendar event')
  }
}

export async function deleteEvent(
  calendarId: string,
  eventId: string
): Promise<void> {
  try {
    const auth = await getAuthClient()

    await calendar.events.delete({
      auth: auth as any,
      calendarId,
      eventId,
    })
  } catch (error) {
    console.error('Error deleting calendar event:', error)
    throw new Error('Failed to delete calendar event')
  }
}

export async function getAvailability(
  calendarId: string,
  date: Date
): Promise<CalendarAvailability> {
  try {
    const auth = await getAuthClient()

    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0)

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999)

    const response = await calendar.events.list({
      auth: auth as any,
      calendarId,
      timeMin: startOfDay.toISOString(),
      timeMax: endOfDay.toISOString(),
      singleEvents: true,
      orderBy: 'startTime',
    })

    const events = response.data.items || []

    // Créer des créneaux de 9h à 18h par intervalles de 1h
    const slots = []
    for (let hour = 9; hour < 18; hour++) {
      const slotStart = new Date(date)
      slotStart.setHours(hour, 0, 0, 0)

      const slotEnd = new Date(date)
      slotEnd.setHours(hour + 1, 0, 0, 0)

      // Vérifier si le créneau est libre
      const isAvailable = !events.some(event => {
        const eventStart = new Date(event.start?.dateTime || event.start?.date || '')
        const eventEnd = new Date(event.end?.dateTime || event.end?.date || '')
        return (
          (slotStart >= eventStart && slotStart < eventEnd) ||
          (slotEnd > eventStart && slotEnd <= eventEnd) ||
          (slotStart <= eventStart && slotEnd >= eventEnd)
        )
      })

      slots.push({
        start: slotStart,
        end: slotEnd,
        available: isAvailable,
      })
    }

    return {
      date,
      slots,
    }
  } catch (error) {
    console.error('Error fetching availability:', error)
    throw new Error('Failed to fetch availability')
  }
}

export async function createMeetEvent(
  calendarId: string,
  event: CalendarEvent
): Promise<{ eventId: string; meetLink: string }> {
  try {
    const auth = await getAuthClient()

    const response = await calendar.events.insert({
      auth: auth as any,
      calendarId,
      conferenceDataVersion: 1,
      requestBody: {
        summary: event.summary,
        description: event.description,
        start: {
          dateTime: event.start.toISOString(),
          timeZone: 'Europe/Paris',
        },
        end: {
          dateTime: event.end.toISOString(),
          timeZone: 'Europe/Paris',
        },
        attendees: event.attendees?.map(email => ({ email })),
        conferenceData: {
          createRequest: {
            requestId: `meet-${Date.now()}`,
            conferenceSolutionKey: {
              type: 'hangoutsMeet',
            },
          },
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: 'email', minutes: 24 * 60 },
            { method: 'popup', minutes: 60 },
          ],
        },
      },
    })

    const meetLink = response.data.conferenceData?.entryPoints?.find(
      ep => ep.entryPointType === 'video'
    )?.uri || ''

    return {
      eventId: response.data.id!,
      meetLink,
    }
  } catch (error) {
    console.error('Error creating Meet event:', error)
    throw new Error('Failed to create Meet event')
  }
}

