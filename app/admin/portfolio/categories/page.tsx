"use client"

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowLeft, Plus, Trash2, GripVertical, Save } from 'lucide-react'
import type { PortfolioCategory } from '@/types/portfolio'

export default function CategoriesPage() {
  const router = useRouter()
  const [categories, setCategories] = useState<PortfolioCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [newCategory, setNewCategory] = useState({ name: '', description: '' })

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch('/api/portfolio/categories')
      if (response.ok) {
        const data = await response.json()
        setCategories(data.categories || [])
      }
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
  }

  const addCategory = () => {
    if (!newCategory.name.trim()) return

    const category: PortfolioCategory = {
      id: `cat_${Date.now()}`,
      name: newCategory.name.trim(),
      slug: generateSlug(newCategory.name),
      description: newCategory.description.trim() || undefined,
      order: categories.length + 1,
    }

    setCategories([...categories, category])
    setNewCategory({ name: '', description: '' })
  }

  const removeCategory = (id: string) => {
    if (!confirm('Are you sure you want to remove this category?')) return
    setCategories(categories.filter(c => c.id !== id))
  }

  const updateCategory = (id: string, field: keyof PortfolioCategory, value: string | number) => {
    setCategories(categories.map(c =>
      c.id === id ? { ...c, [field]: value } : c
    ))
  }

  const moveCategory = (index: number, direction: 'up' | 'down') => {
    const newCategories = [...categories]
    const targetIndex = direction === 'up' ? index - 1 : index + 1

    if (targetIndex < 0 || targetIndex >= newCategories.length) return

    const temp = newCategories[index]
    newCategories[index] = newCategories[targetIndex]
    newCategories[targetIndex] = temp

    // Update order values
    newCategories.forEach((cat, i) => {
      cat.order = i + 1
    })

    setCategories(newCategories)
  }

  const saveCategories = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/portfolio/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categories }),
      })

      if (response.ok) {
        alert('Categories saved successfully')
      } else {
        alert('Failed to save categories')
      }
    } catch (error) {
      console.error('Error saving categories:', error)
      alert('Error saving categories')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => router.push('/admin/portfolio')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold">Portfolio Categories</h1>
        </div>
        <Button onClick={saveCategories} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Add New Category</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4">
            <div className="flex-1 space-y-2">
              <Label>Category Name</Label>
              <Input
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                placeholder="e.g., Power Electronics"
              />
            </div>
            <div className="flex-1 space-y-2">
              <Label>Description (optional)</Label>
              <Input
                value={newCategory.description}
                onChange={(e) => setNewCategory({ ...newCategory, description: e.target.value })}
                placeholder="Brief description"
              />
            </div>
            <div className="flex items-end">
              <Button onClick={addCategory}>
                <Plus className="h-4 w-4 mr-2" />
                Add
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Existing Categories</CardTitle>
        </CardHeader>
        <CardContent>
          {categories.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No categories yet. Add one above.</p>
          ) : (
            <div className="space-y-2">
              {categories
                .sort((a, b) => a.order - b.order)
                .map((category, index) => (
                  <div
                    key={category.id}
                    className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg"
                  >
                    <div className="flex flex-col gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveCategory(index, 'up')}
                        disabled={index === 0}
                      >
                        ▲
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => moveCategory(index, 'down')}
                        disabled={index === categories.length - 1}
                      >
                        ▼
                      </Button>
                    </div>
                    <GripVertical className="h-4 w-4 text-gray-400" />
                    <div className="flex-1 grid grid-cols-3 gap-4">
                      <Input
                        value={category.name}
                        onChange={(e) => updateCategory(category.id, 'name', e.target.value)}
                        placeholder="Category name"
                      />
                      <Input
                        value={category.slug}
                        onChange={(e) => updateCategory(category.id, 'slug', e.target.value)}
                        placeholder="slug"
                      />
                      <Input
                        value={category.description || ''}
                        onChange={(e) => updateCategory(category.id, 'description', e.target.value)}
                        placeholder="Description"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeCategory(category.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
