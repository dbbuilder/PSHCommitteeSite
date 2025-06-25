import fs from 'fs'
import path from 'path'

export default function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  const { method, query } = req
  const eventsPath = path.join(process.cwd(), 'data', 'events.json')
  
  switch (method) {
    case 'GET':
      try {
        const eventsData = fs.readFileSync(eventsPath, 'utf8')
        const data = JSON.parse(eventsData)
        let events = data.events || []
        
        // Filter future events by default
        events = events.filter(event => new Date(event.date) >= new Date())
        
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
