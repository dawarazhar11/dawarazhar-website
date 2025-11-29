'use client'

import { useRouter } from 'next/navigation'
import { saveNote } from '@/lib/admin-actions'
import NoteEditor from '@/components/note-editor'
import { Post } from '@/types/post'

export default function NewNotePage() {
  const router = useRouter()

  const handleSave = async (noteData: Post) => {
    const success = await saveNote(noteData)
    if (success) {
      router.push('/admin/notes')
    }
    return success
  }

  return <NoteEditor onSave={handleSave} />
}
