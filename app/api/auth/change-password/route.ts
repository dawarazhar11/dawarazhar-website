import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import fs from 'fs'
import path from 'path'

const CONFIG_FILE = path.join(process.cwd(), 'config', 'admin.json')

function getStoredPassword(): string {
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

function savePassword(newPassword: string): boolean {
  try {
    const configDir = path.dirname(CONFIG_FILE)
    if (!fs.existsSync(configDir)) {
      fs.mkdirSync(configDir, { recursive: true })
    }

    fs.writeFileSync(CONFIG_FILE, JSON.stringify({ password: newPassword }, null, 2))
    return true
  } catch (error) {
    console.error('Error saving password:', error)
    return false
  }
}

export async function POST(request: NextRequest) {
  try {
    // Check if user is authenticated
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { currentPassword, newPassword } = await request.json()

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: 'Current password and new password are required' },
        { status: 400 }
      )
    }

    if (newPassword.length < 8) {
      return NextResponse.json(
        { error: 'Password must be at least 8 characters long' },
        { status: 400 }
      )
    }

    // Verify current password
    const storedPassword = getStoredPassword()
    if (currentPassword !== storedPassword) {
      return NextResponse.json(
        { error: 'Current password is incorrect' },
        { status: 400 }
      )
    }

    // Save new password
    const saved = savePassword(newPassword)
    if (!saved) {
      return NextResponse.json(
        { error: 'Failed to save new password' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true, message: 'Password changed successfully' })
  } catch (error) {
    console.error('Change password error:', error)
    return NextResponse.json(
      { error: 'An error occurred' },
      { status: 500 }
    )
  }
}
