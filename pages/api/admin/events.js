// Events API - Vercel Compatible
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

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

  // Import fs here to avoid issues
  const fs = require('fs')
  const path = require('path')
  const eventsPath = path.join(process.cwd(), 'data', 'events.json')

  try {
    if (req.method === 'GET') {
      const data = fs.readFileSync(eventsPath, 'utf8')
      const parsed = JSON.parse(data)
      const events = parsed.events || []
      res.status(200).json({ success: true, data: events })
      return
    }

    if (req.method === 'POST') {
      const { title, description, date, time, location } = req.body
      
      if (!title || !date || !time || !location) {
        res.status(400).json({ success: false, message: 'Title, date, time, and location are required' })
        return
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
      
      res.status(201).json({ success: true, data: newEvent })
      return
    }

    res.status(405).json({ success: false, message: 'Method not allowed' })
  } catch (error) {
    console.error('Events API error:', error)
    res.status(500).json({ success: false, message: 'Internal server error' })
  }
}