// Authentication utilities for the PSH Advisory Committee website
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'

// Get JWT secret from environment variable or use default for development
const JWT_SECRET = process.env.JWT_SECRET || 'psh-advisory-committee-secret-key-change-in-production'

/**
 * Hash a password using bcrypt
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Hashed password
 */
export async function hashPassword(password) {
  try {
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    return hashedPassword
  } catch (error) {
    console.error('Error hashing password:', error)
    throw new Error('Failed to hash password')
  }
}

/**
 * Compare a plain text password with a hashed password
 * @param {string} password - Plain text password
 * @param {string} hashedPassword - Hashed password to compare against
 * @returns {Promise<boolean>} - True if passwords match
 */
export async function comparePassword(password, hashedPassword) {
  try {
    const isMatch = await bcrypt.compare(password, hashedPassword)
    return isMatch
  } catch (error) {
    console.error('Error comparing passwords:', error)    throw new Error('Failed to compare passwords')
  }
}

/**
 * Generate a JWT token for a user
 * @param {Object} user - User object with id and username
 * @returns {string} - JWT token
 */
export function generateToken(user) {
  try {
    const token = jwt.sign(
      {
        id: user.id,
        username: user.username,
        role: user.role || 'admin'
      },
      JWT_SECRET,
      {
        expiresIn: '24h' // Token expires in 24 hours
      }
    )
    return token
  } catch (error) {
    console.error('Error generating token:', error)
    throw new Error('Failed to generate token')
  }
}

/**
 * Verify and decode a JWT token
 * @param {string} token - JWT token to verify
 * @returns {Object|null} - Decoded token payload or null if invalid
 */export function verifyToken(token) {
  try {
    const decoded = jwt.verify(token, JWT_SECRET)
    return decoded
  } catch (error) {
    console.error('Error verifying token:', error)
    return null
  }
}

/**
 * Middleware to check if user is authenticated
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 * @returns {Object|null} - User object or null if not authenticated
 */
export function isAuthenticated(req) {
  try {
    // Check for token in authorization header
    const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null
    }

    const token = authHeader.substring(7) // Remove 'Bearer ' prefix
    const decoded = verifyToken(token)
    
    if (!decoded) {
      return null
    }

    return decoded
  } catch (error) {
    console.error('Error checking authentication:', error)
    return null
  }
}

// Default admin user for initial setup
// In production, this should be stored in a database
export const defaultAdmin = {
  id: 1,
  username: process.env.ADMIN_USERNAME || 'admin',
  // Default password: 'admin123' - CHANGE IN PRODUCTION
  password: process.env.ADMIN_PASSWORD_HASH || '$2a$10$YourHashedPasswordHere',
  role: 'admin'
}