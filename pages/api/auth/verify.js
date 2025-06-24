// API endpoint to verify authentication token
import { withAuth, withCORS } from '../../../lib/middleware'

async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed'
    })
  }

  // If we reach here, the user is authenticated (middleware verified the token)
  return res.status(200).json({
    success: true,
    message: 'Token is valid',
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role
    }
  })
}

// Apply authentication middleware before the handler
export default withCORS(withAuth(handler))