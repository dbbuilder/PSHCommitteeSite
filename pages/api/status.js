// API status endpoint - no auth required
export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  
  if (req.method === 'OPTIONS') {
    res.status(200).end()
    return
  }
  
  res.status(200).json({ 
    success: true,
    message: 'PSH Committee API is running',
    environment: {
      nodeEnv: process.env.NODE_ENV,
      hasJwtSecret: !!process.env.JWT_SECRET,
      jwtSecretLength: process.env.JWT_SECRET ? process.env.JWT_SECRET.length : 0,
      timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
      timestamp: new Date().toISOString()
    },
    endpoints: {
      auth: {
        login: '/api/auth/login',
        verify: '/api/auth/verify'
      },
      admin: {
        blog: '/api/admin/blog',
        events: '/api/admin/events',
        submissions: '/api/admin/submissions',
        test: '/api/admin/test'
      },
      public: {
        blog: '/api/blog',
        events: '/api/events',
        contact: '/api/contact'
      }
    }
  })
}