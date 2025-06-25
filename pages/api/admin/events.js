// Events API - Simplified for Vercel
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

export default function handler(req, res) {
  // Handle CORS
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT')
  res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type')
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end()
  }

  // Verify auth
  const authHeader = req.headers.authorization
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized' })
  }

  try {
    const token = authHeader.substring(7)
    jwt.verify(token, JWT_SECRET)
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' })
  }

  const eventsPath = path.join(process.cwd(), 'data', 'events.json')
  
  if (req.method === 'GET') {
    try {
      const data = fs.readFileSync(eventsPath, 'utf8')
      const parsed = JSON.parse(data)
      const events = parsed.events || []
      return res.status(200).json({ success: true, data: events })
    } catch (error) {
      return res.status(500).json({ success: false, message: 'Error reading events' })
    }
  }
  
  if (req.method === 'POST') {
    try {
      const { title, description, date, time, location } = req.body
      
      if (!title || !date || !time || !location) {
        return res.status(400).json({ 
          success: false, 
          message: 'Title, date, time, and location are required' 
        })
      }
      
      const data = fs.readFileSync(eventsPath, 'utf8')
      const parsed = JSON.parse(data)
      const events = parsed.events || []
      
      const newEvent = {
        id: Date.now().toString(),
        title,
        description: description || '',
        date,
        time,
        location,
        address: '',
        registrationLink: '',
        createdAt: new Date().toISOString()
      }
      
      events.push(newEvent)
      fs.writeFileSync(eventsPath, JSON.stringify({ events }, null, 2))
      
      return res.status(201).json({ success: true, data: newEvent })
    } catch (error) {
      console.error('Error creating event:', error)
      return res.status(500).json({ 
        success: false, 
        message: 'Error creating event' 
      })
    }
  }
  
  return res.status(405).json({ 
    success: false, 
    message: `Method ${req.method} not allowed` 
  })
}

export const config = {
  api: {
    bodyParser: true,
  },
}