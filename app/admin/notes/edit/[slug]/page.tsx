'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getNoteBySlug, saveNote } from '@/lib/admin-actions'
import NoteEditor from '@/components/note-editor'
import { Post } from '@/types/post'

export default function EditNotePage({ params }: { params: Promise<{ slug: string }> }) {
  const router = useRouter()
  const [note, setNote] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const resolvedParams = await params
        const noteData = await getNoteBySlug(resolvedParams.slug)
        if (noteData) {
          setNote(noteData)
        } else {
          router.push('/admin/notes')
        }
      } catch (error) {
        console.error('Error fetching note:', error)
        router.push('/admin/notes')
      } finally {
        setLoading(false)
      }
    }

    fetchNote()
  }, [params, router])

  const handleSave = async (noteData: Post) => {
    return await saveNote(noteData)
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <NoteEditor
      note={note || undefined}
      onSave={handleSave}
    />
  )
}
