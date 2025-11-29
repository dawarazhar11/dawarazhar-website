"use client"

import { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/check')
        const data = await response.json()
        setIsLoggedIn(data.authenticated)
        setIsLoading(false)

        // Don't redirect if already on login page
        if (!data.authenticated && pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        setIsLoggedIn(false)
        setIsLoading(false)
        if (pathname !== '/admin/login') {
          router.push('/admin/login')
        }
      }
    }

    checkAuth()
  }, [router, pathname])

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' })
      setIsLoggedIn(false)
      router.push('/admin/login')
      router.refresh()
    } catch (error) {
      console.error('Logout failed:', error)
    }
  }

  // If on login page, just render children without admin layout
  if (pathname === '/admin/login') {
    return <>{children}</>
  }

  // If not authenticated and not on login page, show loading
  if (!isLoggedIn && isLoading) {
    return <div>Loading...</div>
  }

  // If not authenticated, redirect will happen in useEffect
  if (!isLoggedIn) {
    return <div>Loading...</div>
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-xl font-bold">Admin Dashboard</h1>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" asChild>
              <Link href="/admin/posts">Posts</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/admin/notes">Notes</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/admin/portfolio">Portfolio</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/admin/resume">Resume</Link>
            </Button>
            <Button variant="ghost" asChild>
              <Link href="/admin/settings">Settings</Link>
            </Button>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  )
}