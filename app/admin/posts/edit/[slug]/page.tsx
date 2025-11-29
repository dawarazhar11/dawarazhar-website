'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getPostBySlug, savePost } from '@/lib/admin-actions'
import PostEditor from '@/components/post-editor'
import { Post } from '@/types/post'

export default function EditPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const resolvedParams = await params
        const postData = await getPostBySlug(resolvedParams.slug)
        if (postData) {
          setPost(postData)
        } else {
          router.push('/admin/posts')
        }
      } catch (error) {
        console.error('Error fetching post:', error)
        router.push('/admin/posts')
      } finally {
        setLoading(false)
      }
    }

    fetchPost()
  }, [params, router])

  const handleSave = async (postData: Post) => {
    return await savePost(postData)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <PostEditor
      post={post || undefined}
      onSave={handleSave}
    />
  )
}