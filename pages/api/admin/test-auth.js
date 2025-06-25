// Test endpoint to verify authentication
import { withAuth, withCORS } from '../../../lib/middleware'

async function handler(req, res) {
  // If we reach here, authentication passed
  return res.status(200).json({
    success: true,
    message: 'Authentication successful',
    user: req.user,
    method: req.method
  })
}

// Apply authentication middleware with CORS
export default withCORS(withAuth(handler))