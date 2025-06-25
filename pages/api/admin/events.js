// Admin API for managing calendar events with correct data structure
import fs from 'fs'
import path from 'path'
import { withAuth, withCORS } from '../../../lib/middleware'

const eventsPath = path.join(process.cwd(), 'data', 'events.json')

// Helper function to read events data
function readEventsData() {
  try {
    const data = fs.readFileSync(eventsPath, 'utf8')
    const parsed = JSON.parse(data)
    // Handle both array and object with events property
    return parsed.events || parsed || []
  } catch (error) {
    console.error('Error reading events data:', error)
    return []
  }
}

// Helper function to write events data
function writeEventsData(events) {
  try {
    // Maintain the original structure with events wrapper
    const data = { events }
    fs.writeFileSync(eventsPath, JSON.stringify(data, null, 2))
    return true
  } catch (error) {
    console.error('Error writing events data:', error)
    return false
  }
}

async function handler(req, res) {
  // Debug logging
  console.log('[Events API] Request method:', req.method)
  console.log('[Events API] Request headers:', req.headers)
  console.log('[Events API] User:', req.user)
  
  const { method, body, query } = req
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
      console.log('[Events API] POST body:', body)
      
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
}

// Apply authentication middleware with CORS
export default withCORS(withAuth(handler))