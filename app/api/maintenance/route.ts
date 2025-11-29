import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getMaintenanceConfig, saveMaintenanceConfig } from '@/lib/maintenance'

export async function GET() {
  try {
    const config = getMaintenanceConfig()
    return NextResponse.json(config)
  } catch (error) {
    console.error('Error getting maintenance config:', error)
    return NextResponse.json({ error: 'Failed to get config' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const config = await request.json()
    const success = saveMaintenanceConfig(config)

    if (success) {
      return NextResponse.json({ success: true, config: getMaintenanceConfig() })
    } else {
      return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error saving maintenance config:', error)
    return NextResponse.json({ error: 'Failed to save config' }, { status: 500 })
  }
}
