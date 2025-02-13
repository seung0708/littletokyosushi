import { google, analyticsdata_v1beta } from 'googleapis'

const scopes = ['https://www.googleapis.com/auth/analytics.readonly']
const jwt = new google.auth.JWT(
  process.env.GOOGLE_CLIENT_EMAIL,
  undefined,
  process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
  scopes
)

const analyticsData = google.analyticsdata({
  version: 'v1beta',
  auth: jwt
})

// Format the property ID with the required prefix
const PROPERTY_ID = `properties/${process.env.PROPERTY_ID}`

type AnalyticsResponse = {
  activeUsers: number
  pageViews: number
  sessions: number
  avgSessionDuration: number
}

export async function getAnalytics(startDate: string, endDate: string): Promise<AnalyticsResponse | null> {
  try {
    if (!process.env.PROPERTY_ID) {
      throw new Error('Google Analytics Property ID is not configured')
    }

    const response = await analyticsData.properties.runReport({
      property: PROPERTY_ID, // Use the formatted property ID
      requestBody: {
        dateRanges: [{ startDate, endDate }],
        metrics: [
          { name: 'activeUsers' },
          { name: 'screenPageViews' },
          { name: 'sessions' },
          { name: 'averageSessionDuration' }
        ]
      }
    })

    const metrics = response.data.rows?.[0]?.metricValues || []
    
    return {
      activeUsers: Number(metrics[0]?.value || 0),
      pageViews: Number(metrics[1]?.value || 0),
      sessions: Number(metrics[2]?.value || 0),
      avgSessionDuration: Number(metrics[3]?.value || 0)
    }
  } catch (error) {
    console.error('Error fetching analytics:', error)
    return null
  }
}