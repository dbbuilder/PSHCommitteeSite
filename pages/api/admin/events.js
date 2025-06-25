// Events API - Vercel Blob Storage Compatible
import jwt from 'jsonwebtoken'
import { 
  getAllEvents, 
  addEvent, 
  updateEvent, 
  deleteEvent,
  initializeEventsMetadata 
} from '../../../lib/eventsBlobStorage'

const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

// Initialize blob storage on first request
let initialized = false;

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  
  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }

  // Check authentication
  const authHeader = req.headers.authorization
  if (!authHeader?.startsWith('Bearer ')) {
    res.status(401).json({ success: false, message: 'Unauthorized' })
    return
  }

  try {
    const token = authHeader.substring(7)
    jwt.verify(token, JWT_SECRET)
  } catch (error) {
    res.status(401).json({ success: false, message: 'Invalid token' })
    return
  }

  // Initialize blob storage if needed
  if (!initialized) {
    await initializeEventsMetadata();
    initialized = true;
  }

  try {
    if (req.method === 'GET') {
      const events = await getAllEvents();
      res.status(200).json({ success: true, data: events })
      return
    }

    if (req.method === 'POST') {
      const { title, description, date, time, location, address, registrationLink } = req.body
      
      if (!title || !date || !time || !location) {
        res.status(400).json({ success: false, message: 'Title, date, time, and location are required' })
        return
      }
      
      const newEvent = await addEvent({
        title,
        description: description || '',
        date,
        time,
        location,
        address: address || '',
        registrationLink: registrationLink || ''
      });
      
      res.status(201).json({ success: true, data: newEvent })
      return
    }

    if (req.method === 'PUT') {
      const { id, ...updates } = req.body
      
      if (!id) {
        res.status(400).json({ success: false, message: 'Event ID is required' })
        return
      }
      
      const updatedEvent = await updateEvent(id, updates);
      
      if (!updatedEvent) {
        res.status(404).json({ success: false, message: 'Event not found' })
        return
      }
      
      res.status(200).json({ success: true, data: updatedEvent })
      return
    }

    if (req.method === 'DELETE') {
      const { id } = req.body
      
      if (!id) {
        res.status(400).json({ success: false, message: 'Event ID is required' })
        return
      }
      
      const deleted = await deleteEvent(id);
      
      if (!deleted) {
        res.status(404).json({ success: false, message: 'Event not found' })
        return
      }
      
      res.status(200).json({ success: true, message: 'Event deleted successfully' })
      return
    }

    res.status(405).json({ success: false, message: 'Method not allowed' })
  } catch (error) {
    console.error('Events API error:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}