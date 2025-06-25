// Public Events API - Vercel Blob Storage Compatible
import { 
  getAllEvents, 
  initializeEventsMetadata 
} from '../../lib/eventsBlobStorage'

// Initialize blob storage on first request
let initialized = false;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Initialize blob storage if needed
  if (!initialized) {
    await initializeEventsMetadata();
    initialized = true;
  }

  const { method, query } = req
  
  switch (method) {
    case 'GET':
      try {
        let events = await getAllEvents();
        
        // Filter future events by default unless includePast is specified
        if (!query.includePast) {
          events = events.filter(event => new Date(event.date) >= new Date())
        }
        
        // Sort by date
        events.sort((a, b) => new Date(a.date) - new Date(b.date))
        
        // Apply limit if specified
        if (query.limit) {
          events = events.slice(0, parseInt(query.limit))
        }
        
        res.status(200).json(events)
      } catch (error) {
        console.error('Events API error:', error)
        res.status(500).json({ error: 'Failed to fetch events', details: error.message })
      }
      break
      
    default:
      res.setHeader('Allow', ['GET'])
      res.status(405).end(`Method ${method} Not Allowed`)
  }
}