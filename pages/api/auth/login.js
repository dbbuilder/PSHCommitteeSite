// API endpoint for admin authentication
import { comparePassword, generateToken, defaultAdmin } from '../../../lib/auth'
import { withCORS } from '../../../lib/middleware'

async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  try {
    const { username, password } = req.body

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required'
      })
    }

    // Check if username matches
    if (username !== defaultAdmin.username) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Verify password
    const isValidPassword = await comparePassword(password, defaultAdmin.password)
    
    if (!isValidPassword) {      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      })
    }

    // Generate token
    const token = generateToken(defaultAdmin)

    // Return success response with token
    return res.status(200).json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: defaultAdmin.id,
        username: defaultAdmin.username,
        role: defaultAdmin.role
      }
    })
  } catch (error) {
    console.error('Login error:', error)
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
}

export default withCORS(handler)