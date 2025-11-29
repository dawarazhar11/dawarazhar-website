'use client'

import { savePost } from '@/lib/admin-actions'
import PostEditor from '@/components/post-editor'
import { Post } from '@/types/post'

export default function NewPostPage() {
  const handleSave = async (post: Post) => {
    return await savePost(post)
  }

  return (
    <PostEditor
      onSave={handleSave}
    />
  )
}