import { getIronSession } from 'iron-session'
import { cookies } from 'next/headers'
import { sessionOptions, SessionData } from './session'
import fs from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'config', 'admin.json')

/**
 * Get the current admin password from config file or environment
 */
function getAdminPassword(): string {
  try {
    // First check environment variable
    if (process.env.ADMIN_PASSWORD) {
      return process.env.ADMIN_PASSWORD
    }

    // Then check config file
    if (fs.existsSync(CONFIG_FILE)) {
      const config = JSON.parse(fs.readFileSync(CONFIG_FILE, 'utf-8'))
      return config.password || 'admin123'
    }

    return 'admin123'
  } catch {
    return 'admin123'
  }
}

/**
 * Verify a password against the stored password
 */
export async function verifyPassword(password: string): Promise<boolean> {
  try {
    const storedPassword = getAdminPassword()
    return password === storedPassword
  } catch (error) {
    console.error('Error verifying password:', error)
    return false
  }
}

/**
 * Get the current session
 */
export async function getSession() {
  const cookieStore = await cookies()
  return getIronSession<SessionData>(cookieStore, sessionOptions)
}

/**
 * Check if the user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  try {
    const session = await getSession()
    return session.isAuthenticated === true
  } catch (error) {
    console.error('Error checking authentication:', error)
    return false
  }
}

/**
 * Require authentication, redirect if not authenticated
 */
export async function requireAuth() {
  const authenticated = await isAuthenticated()
  if (!authenticated) {
    return false
  }
  return true
}
