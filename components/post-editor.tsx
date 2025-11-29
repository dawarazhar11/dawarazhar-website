"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Post } from '@/types/post'
import { Button } from '@/components/ui/button'
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
  const [title, setTitle] = useState(post?.title || '')
  const [description, setDescription] = useState(post?.description || '')
  const [publishDate, setPublishDate] = useState(post?.publishDate || new Date().toISOString().split('T')[0])
  const [tags, setTags] = useState(post?.tags?.join(', ') || '')
  const [draft, setDraft] = useState(post?.draft || false)
  const [image, setImage] = useState(post?.image || '')
  const [content, setContent] = useState(post?.content || '')
  const [isSaving, setIsSaving] = useState(false)

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
            Image URL (optional)
          </label>
          <input
            id="image"
            type="text"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            placeholder="/images/posts/example.jpg"
          />
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