// API endpoint for contact form submissions
import fs from 'fs'
import path from 'path'
import { withCORS } from '../../lib/middleware'

const submissionsDir = path.join(process.cwd(), 'data', 'submissions')

// Rate limiting - Simple in-memory store (in production, use Redis)
const rateLimitStore = new Map()

// Check rate limit
function checkRateLimit(ip) {
  const now = Date.now()
  const windowMs = 15 * 60 * 1000 // 15 minutes
  const maxRequests = 5
  
  if (!rateLimitStore.has(ip)) {
    rateLimitStore.set(ip, [])
  }
  
  const requests = rateLimitStore.get(ip)
  const recentRequests = requests.filter(time => now - time < windowMs)
  
  if (recentRequests.length >= maxRequests) {
    return false
  }
  
  recentRequests.push(now)
  rateLimitStore.set(ip, recentRequests)
  
  return true
}
// Validate email format
function isValidEmail(email) {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
  return emailRegex.test(email)
}

// Save submission to file
function saveSubmission(submission) {
  try {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `submission-${timestamp}.json`
    const filepath = path.join(submissionsDir, filename)
    
    fs.writeFileSync(filepath, JSON.stringify(submission, null, 2))
    return true
  } catch (error) {
    console.error('Error saving submission:', error)
    return false
  }
}

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  try {
    const { name, email, organization, interest, message, honeypot } = req.body
    
    // Check honeypot field (should be empty)
    if (honeypot) {
      console.log('Honeypot triggered')
      // Still return success to not reveal to spammers
      return res.status(200).json({ success: true })
    }    
    // Get client IP for rate limiting
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress || '127.0.0.1'
    
    // Check rate limit
    if (!checkRateLimit(ip)) {
      return res.status(429).json({
        success: false,
        message: 'Too many requests. Please try again later.'
      })
    }
    
    // Validate required fields
    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required'
      })
    }
    
    // Validate email format
    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email address'
      })
    }
    
    // Additional spam checks
    // Check for suspicious content patterns
    const suspiciousPatterns = [
      /viagra/i,
      /casino/i,
      /lottery/i,
      /\b(?:https?:\/\/|www\.)\S+/g, // URLs in message
      /\d{3,}/g // Long numbers (phone numbers, etc.)
    ]
    
    const isSuspicious = suspiciousPatterns.some(pattern => 
      pattern.test(message) || pattern.test(name)
    )
    
    if (isSuspicious) {
      console.log('Suspicious content detected')
      // Still return success to not reveal to spammers
      return res.status(200).json({ success: true })
    }
    
    // Create submission object
    const submission = {
      id: Date.now(),
      name: name.trim(),
      email: email.trim(),
      organization: organization?.trim() || '',
      interest: interest || '',
      message: message.trim(),
      submittedAt: new Date().toISOString(),
      ip: ip,
      status: 'new'
    }
    
    // Save submission
    if (!saveSubmission(submission)) {
      return res.status(500).json({
        success: false,
        message: 'Failed to save submission. Please try again.'
      })
    }
    
    // TODO: Send email notification to administrators
    // This would be implemented with a service like SendGrid or AWS SES
    
    return res.status(200).json({
      success: true,
      message: 'Thank you for your message. We will get back to you soon!'
    })
  } catch (error) {
    console.error('Contact form error:', error)
    return res.status(500).json({
      success: false,
      message: 'An error occurred. Please try again.'
    })
  }
}

export default withCORS(handler)