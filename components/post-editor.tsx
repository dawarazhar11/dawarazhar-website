"use client"

import { useState, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/types/post'
import { Button } from '@/components/ui/button'
import { Upload, X, Image as ImageIcon } from 'lucide-react'
import dynamic from 'next/dynamic'

// Dynamically import the markdown editor to avoid SSR issues
const MarkdownEditor = dynamic(() => import('@/components/markdown-editor'), {
  ssr: false,
  loading: () => <p>Loading editor...</p>
})

interface PostEditorProps {
  post?: Post
  onSave: (post: Post) => Promise<boolean>
}

export default function PostEditor({ post, onSave }: PostEditorProps) {
  const router = useRouter()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [title, setTitle] = useState(post?.title || '')
  const [description, setDescription] = useState(post?.description || '')
  const [publishDate, setPublishDate] = useState(post?.publishDate || new Date().toISOString().split('T')[0])
  const [tags, setTags] = useState(post?.tags?.join(', ') || '')
  const [draft, setDraft] = useState(post?.draft || false)
  const [image, setImage] = useState(post?.image || '')
  const [content, setContent] = useState(post?.content || '')
  const [isSaving, setIsSaving] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadError, setUploadError] = useState('')

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    setUploadError('')

    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed')
      }

      setImage(data.url)
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : 'Upload failed')
    } finally {
      setIsUploading(false)
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    const postData: Post = {
      slug: post?.slug || '',
      title,
      description,
      publishDate,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      draft,
      content,
      image: image || undefined,
    }

    const success = await onSave(postData)
    
    if (success) {
      router.push('/admin/posts')
    } else {
      alert('Failed to save post')
    }
    
    setIsSaving(false)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">
        {post ? 'Edit Post' : 'Create New Post'}
      </h1>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
          
          <div>
            <label htmlFor="publishDate" className="block text-sm font-medium text-gray-700 mb-1">
              Publish Date
            </label>
            <input
              id="publishDate"
              type="date"
              value={publishDate}
              onChange={(e) => setPublishDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label htmlFor="tags" className="block text-sm font-medium text-gray-700 mb-1">
            Tags (comma separated)
          </label>
          <input
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="engineering, cfd, tutorial"
          />
        </div>
        
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
            Cover Image (optional)
          </label>

          {/* Image Preview */}
          {image && (
            <div className="mb-3 relative inline-block">
              <img
                src={image}
                alt="Cover preview"
                className="h-32 w-auto rounded-lg border border-gray-200 object-cover"
              />
              <button
                type="button"
                onClick={() => setImage('')}
                className="absolute -top-2 -right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                title="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )}

          {/* Upload and URL Input */}
          <div className="flex gap-2">
            <input
              id="image"
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              placeholder="/images/posts/example.jpg or paste URL"
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
              id="image-upload"
            />
            <Button
              type="button"
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              {isUploading ? (
                <>
                  <span className="animate-spin h-4 w-4 border-2 border-gray-300 border-t-blue-500 rounded-full"></span>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  Upload
                </>
              )}
            </Button>
          </div>

          {uploadError && (
            <p className="mt-1 text-sm text-red-600">{uploadError}</p>
          )}
          <p className="mt-1 text-xs text-gray-500">
            Upload an image (max 5MB) or paste an external URL
          </p>
        </div>
        
        <div className="flex items-center">
          <input
            id="draft"
            type="checkbox"
            checked={draft}
            onChange={(e) => setDraft(e.target.checked)}
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label htmlFor="draft" className="ml-2 block text-sm text-gray-900">
            Draft
          </label>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Content
          </label>
          <MarkdownEditor
            value={content}
            onChange={setContent}
          />
        </div>
        
        <div className="flex justify-end space-x-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push('/admin/posts')}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSaving}
          >
            {isSaving ? 'Saving...' : 'Save Post'}
          </Button>
        </div>
      </form>
    </div>
  )
}