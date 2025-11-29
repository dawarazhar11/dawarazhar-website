import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { getPortfolioCategories, savePortfolioCategories } from '@/lib/portfolio'
import type { PortfolioCategory } from '@/types/portfolio'

export async function GET() {
  try {
    const categories = getPortfolioCategories()
    return NextResponse.json({ categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { categories }: { categories: PortfolioCategory[] } = await request.json()

    if (!Array.isArray(categories)) {
      return NextResponse.json({ error: 'Categories must be an array' }, { status: 400 })
    }

    const success = savePortfolioCategories(categories)
    if (success) {
      return NextResponse.json({ success: true, categories })
    } else {
      return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 })
    }
  } catch (error) {
    console.error('Error saving categories:', error)
    return NextResponse.json({ error: 'Failed to save categories' }, { status: 500 })
  }
}
