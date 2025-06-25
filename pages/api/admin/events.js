// Admin API for managing calendar events - Fixed for Vercel
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const eventsPath = path.join(process.cwd(), 'data', 'events.json')
const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

// Helper function to verify auth token
function verifyAuth(req) {
  try {
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    return null
  }
}

// Helper function to read events data
function readEventsData() {
  try {
    const data = fs.readFileSync(eventsPath, 'utf8')
    const parsed = JSON.parse(data)
    return parsed.events || parsed || []
  } catch (error) {
    console.error('Error reading events data:', error)
    return []
  }
}

// Helper function to write events data
function writeEventsData(events) {
  try {
    const data = { events }
    fs.writeFileSync(eventsPath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing events data:', error)
    return false
  }
}
export default async function handler(req, res) {
  // Set CORS headers for all requests
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization'
  )
  
  // Handle preflight request
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Verify authentication
  const user = verifyAuth(req)
  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Unauthorized - Please login to access this resource'
    })
  }

  const { method, body, query } = req

  try {
    switch (method) {
      case 'GET':
        // Get all events or single event by ID
        const events = readEventsData()
        
        if (query.id) {
          const event = events.find(e => e.id === query.id || e.id === parseInt(query.id))
          if (event) {
            return res.status(200).json({ success: true, data: event })
          } else {
            return res.status(404).json({ success: false, message: 'Event not found' })
          }
        }
        
        return res.status(200).json({ success: true, data: events })

      case 'POST':
        // Create new event
        const allEvents = readEventsData()
        
        // Validate required fields
        if (!body.title || !body.date || !body.time || !body.location) {
          return res.status(400).json({
            success: false,
            message: 'Title, date, time, and location are required'
          })
        }        
        // Generate new event with unique ID
        const newId = Date.now().toString()
        const newEvent = {
          id: newId,
          title: body.title,
          description: body.description || '',
          date: body.date,
          time: body.time,
          location: body.location,
          address: body.address || '',
          registrationLink: body.registrationLink || '',
          createdAt: new Date().toISOString()
        }
        
        allEvents.push(newEvent)
        
        if (writeEventsData(allEvents)) {
          return res.status(201).json({ success: true, data: newEvent })
        } else {
          return res.status(500).json({ success: false, message: 'Failed to save event' })
        }

      case 'PUT':
        // Update existing event
        if (!query.id) {
          return res.status(400).json({ success: false, message: 'Event ID is required' })
        }
        
        const eventsToUpdate = readEventsData()
        const eventIndex = eventsToUpdate.findIndex(e => e.id === query.id || e.id === parseInt(query.id))
        
        if (eventIndex === -1) {
          return res.status(404).json({ success: false, message: 'Event not found' })
        }
        
        // Update event fields
        eventsToUpdate[eventIndex] = {
          ...eventsToUpdate[eventIndex],
          ...body,
          id: eventsToUpdate[eventIndex].id, // Preserve ID
          updatedAt: new Date().toISOString()
        }
        
        if (writeEventsData(eventsToUpdate)) {
          return res.status(200).json({ success: true, data: eventsToUpdate[eventIndex] })
        } else {
          return res.status(500).json({ success: false, message: 'Failed to update event' })
        }
      case 'DELETE':
        // Delete event
        if (!query.id) {
          return res.status(400).json({ success: false, message: 'Event ID is required' })
        }
        
        const eventsToDelete = readEventsData()
        const filteredEvents = eventsToDelete.filter(e => e.id !== query.id && e.id !== parseInt(query.id))
        
        if (filteredEvents.length === eventsToDelete.length) {
          return res.status(404).json({ success: false, message: 'Event not found' })
        }
        
        if (writeEventsData(filteredEvents)) {
          return res.status(200).json({ success: true, message: 'Event deleted successfully' })
        } else {
          return res.status(500).json({ success: false, message: 'Failed to delete event' })
        }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE'])
        return res.status(405).json({ success: false, message: `Method ${method} not allowed` })
    }
  } catch (error) {
    console.error('Events API error:', error)
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
}