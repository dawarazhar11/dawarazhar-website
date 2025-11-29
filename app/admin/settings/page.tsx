"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { AlertCircle, CheckCircle2, Key, Construction, Eye } from 'lucide-react'
import Link from 'next/link'

interface MaintenanceConfig {
  enabled: boolean
  title: string
  message: string
  showProgress: boolean
  progressPercent: number
  expectedDate: string
  showSocial: boolean
}

export default function SettingsPage() {
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Maintenance mode state
  const [maintenanceConfig, setMaintenanceConfig] = useState<MaintenanceConfig>({
    enabled: false,
    title: 'Coming Soon',
    message: "We're working hard to bring you something amazing. Stay tuned!",
    showProgress: true,
    progressPercent: 75,
    expectedDate: '',
    showSocial: true,
  })
  const [maintenanceLoading, setMaintenanceLoading] = useState(false)
  const [maintenanceMessage, setMaintenanceMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

  // Load maintenance config on mount
  useEffect(() => {
    fetch('/api/maintenance')
      .then(res => res.json())
      .then(data => {
        if (data && !data.error) {
          setMaintenanceConfig(data)
        }
      })
      .catch(err => console.error('Error loading maintenance config:', err))
  }, [])

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'New passwords do not match' })
      return
    }

    if (newPassword.length < 8) {
      setMessage({ type: 'error', text: 'Password must be at least 8 characters long' })
      return
    }

    setLoading(true)

    try {
      const response = await fetch('/api/auth/change-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      })

      const data = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Password changed successfully' })
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
      } else {
        setMessage({ type: 'error', text: data.error || 'Failed to change password' })
      }
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  const handleSaveMaintenanceConfig = async () => {
    setMaintenanceLoading(true)
    setMaintenanceMessage(null)

    try {
      const response = await fetch('/api/maintenance', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(maintenanceConfig),
      })

      const data = await response.json()

      if (response.ok) {
        setMaintenanceMessage({ type: 'success', text: maintenanceConfig.enabled ? 'Maintenance mode enabled' : 'Maintenance mode disabled' })
      } else {
        setMaintenanceMessage({ type: 'error', text: data.error || 'Failed to save settings' })
      }
    } catch (error) {
      setMaintenanceMessage({ type: 'error', text: 'An error occurred. Please try again.' })
    } finally {
      setMaintenanceLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <h1 className="text-3xl font-bold">Settings</h1>

      {/* Maintenance Mode Card */}
      <Card className={maintenanceConfig.enabled ? 'border-orange-300 bg-orange-50/50' : ''}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Construction className="h-5 w-5" />
            Maintenance Mode
            {maintenanceConfig.enabled && (
              <span className="text-xs font-normal px-2 py-1 bg-orange-200 text-orange-800 rounded-full">
                Active
              </span>
            )}
          </CardTitle>
          <CardDescription>
            Enable to show a "Coming Soon" page to visitors while you work on the site.
            Admin pages remain accessible.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Enable Toggle */}
          <div className="flex items-center justify-between p-4 bg-muted/50 rounded-lg">
            <div>
              <Label htmlFor="maintenance-enabled" className="text-base font-medium">Enable Maintenance Mode</Label>
              <p className="text-sm text-muted-foreground">
                Visitors will see the "Coming Soon" page
              </p>
            </div>
            <Switch
              id="maintenance-enabled"
              checked={maintenanceConfig.enabled}
              onCheckedChange={(checked) => setMaintenanceConfig(prev => ({ ...prev, enabled: checked }))}
            />
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="maintenance-title">Page Title</Label>
            <Input
              id="maintenance-title"
              value={maintenanceConfig.title}
              onChange={(e) => setMaintenanceConfig(prev => ({ ...prev, title: e.target.value }))}
              placeholder="Coming Soon"
            />
          </div>

          {/* Message */}
          <div className="space-y-2">
            <Label htmlFor="maintenance-message">Message</Label>
            <Textarea
              id="maintenance-message"
              value={maintenanceConfig.message}
              onChange={(e) => setMaintenanceConfig(prev => ({ ...prev, message: e.target.value }))}
              placeholder="We're working hard to bring you something amazing..."
              rows={3}
            />
          </div>

          {/* Progress */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Show Progress Bar</Label>
              <Switch
                checked={maintenanceConfig.showProgress}
                onCheckedChange={(checked) => setMaintenanceConfig(prev => ({ ...prev, showProgress: checked }))}
              />
            </div>
            {maintenanceConfig.showProgress && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progress: {maintenanceConfig.progressPercent}%</span>
                </div>
                <Slider
                  value={[maintenanceConfig.progressPercent]}
                  onValueChange={([value]) => setMaintenanceConfig(prev => ({ ...prev, progressPercent: value }))}
                  max={100}
                  step={5}
                />
              </div>
            )}
          </div>

          {/* Expected Date */}
          <div className="space-y-2">
            <Label htmlFor="expected-date">Expected Launch Date (optional)</Label>
            <Input
              id="expected-date"
              value={maintenanceConfig.expectedDate}
              onChange={(e) => setMaintenanceConfig(prev => ({ ...prev, expectedDate: e.target.value }))}
              placeholder="e.g., January 2025"
            />
          </div>

          {/* Show Social */}
          <div className="flex items-center justify-between">
            <div>
              <Label>Show Social Links</Label>
              <p className="text-sm text-muted-foreground">Display GitHub, LinkedIn, and email links</p>
            </div>
            <Switch
              checked={maintenanceConfig.showSocial}
              onCheckedChange={(checked) => setMaintenanceConfig(prev => ({ ...prev, showSocial: checked }))}
            />
          </div>

          {maintenanceMessage && (
            <div className={`flex items-center gap-2 p-3 rounded-md ${
              maintenanceMessage.type === 'success'
                ? 'bg-green-50 text-green-700 border border-green-200'
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {maintenanceMessage.type === 'success' ? (
                <CheckCircle2 className="h-4 w-4" />
              ) : (
                <AlertCircle className="h-4 w-4" />
              )}
              {maintenanceMessage.text}
            </div>
          )}

          <div className="flex gap-3">
            <Button onClick={handleSaveMaintenanceConfig} disabled={maintenanceLoading}>
              {maintenanceLoading ? 'Saving...' : 'Save Settings'}
            </Button>
            <Button variant="outline" asChild>
              <Link href="/coming-soon" target="_blank">
                <Eye className="h-4 w-4 mr-2" />
                Preview Page
              </Link>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Password Change Card */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Key className="h-5 w-5" />
            Change Password
          </CardTitle>
          <CardDescription>
            Update your admin password. Make sure to use a strong password.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleChangePassword} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="currentPassword">Current Password</Label>
              <Input
                id="currentPassword"
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
                placeholder="Enter current password"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="newPassword">New Password</Label>
              <Input
                id="newPassword"
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                placeholder="Enter new password (min 8 characters)"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirm New Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm new password"
              />
            </div>

            {message && (
              <div className={`flex items-center gap-2 p-3 rounded-md ${
                message.type === 'success'
                  ? 'bg-green-50 text-green-700 border border-green-200'
                  : 'bg-red-50 text-red-700 border border-red-200'
              }`}>
                {message.type === 'success' ? (
                  <CheckCircle2 className="h-4 w-4" />
                ) : (
                  <AlertCircle className="h-4 w-4" />
                )}
                {message.text}
              </div>
            )}

            <Button type="submit" disabled={loading}>
              {loading ? 'Changing Password...' : 'Change Password'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
