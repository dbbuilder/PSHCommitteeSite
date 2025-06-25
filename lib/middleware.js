// Middleware for protecting API routes
import { isAuthenticated } from './auth'

/**
 * CORS middleware for API routes
 * @param {Function} handler - The API route handler
 * @returns {Function} - API route handler with CORS
 */
export function withCORS(handler) {
  return async (req, res) => {
    // Set CORS headers for all requests (including errors)
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
    
    return handler(req, res)
  }
}

/**
 * Middleware to protect API routes
 * @param {Function} handler - The API route handler
 * @returns {Function} - Protected API route handler
 */
export function withAuth(handler) {
  return async (req, res) => {
    try {
      // Check if user is authenticated
      const user = isAuthenticated(req)
      
      if (!user) {
        // Make sure CORS headers are set even for auth failures
        return res.status(401).json({
          success: false,
          message: 'Unauthorized - Please login to access this resource'
        })
      }
      
      // Add user to request object
      req.user = user
      
      // Call the actual handler
      return handler(req, res)
    } catch (error) {
      console.error('Auth middleware error:', error)
      // Make sure CORS headers are set even for errors
      return res.status(500).json({
        success: false,
        message: 'Internal server error'
      })
    }
  }
}

/**
 * Middleware to check if user has specific role
 * @param {string[]} allowedRoles - Array of allowed roles
 * @returns {Function} - Middleware function
 */
export function withRole(allowedRoles) {
  return (handler) => {
    return async (req, res) => {
      try {
        // Check if user is authenticated first
        const user = isAuthenticated(req)
        
        if (!user) {
          return res.status(401).json({
            success: false,
            message: 'Unauthorized - Please login to access this resource'
          })
        }
        
        // Add user to request object
        req.user = user
        
        const userRole = user.role || 'user'
        
        if (!allowedRoles.includes(userRole)) {
          return res.status(403).json({
            success: false,
            message: 'Forbidden - Insufficient permissions'
          })
        }
        
        return handler(req, res)
      } catch (error) {
        console.error('Role middleware error:', error)
        return res.status(500).json({
          success: false,
          message: 'Internal server error'
        })
      }
    }
  }
}