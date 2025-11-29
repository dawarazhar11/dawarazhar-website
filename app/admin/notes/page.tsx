'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllNotes, deleteNote } from '@/lib/admin-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Post } from '@/types/post'
import { Pencil, Trash2 } from 'lucide-react'

export default function AdminNotesPage() {
  const router = useRouter()
  const [notes, setNotes] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchNotes = async () => {
    try {
      const notesData = await getAllNotes()
      setNotes(notesData)
    } catch (error) {
      console.error('Error fetching notes:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchNotes()
  }, [])

  const handleDelete = async (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this note?')) {
      const success = await deleteNote(slug)
      if (success) {
        fetchNotes()
      } else {
        alert('Failed to delete note')
      }
    }
  }

  const handleEdit = (slug: string) => {
    router.push(`/admin/notes/edit/${slug}`)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Notes</h1>
        <Button asChild>
          <Link href="/admin/notes/new">Create New Note</Link>
        </Button>
      </div>

      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {notes.map((note) => (
              <tr
                key={note.slug}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleEdit(note.slug)}
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{note.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-md">{note.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(note.publishDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    note.draft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {note.draft ? 'Draft' : 'Published'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(note.slug) }}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 inline-flex items-center"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="ml-1">Edit</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(note.slug, e)}
                    className="text-red-600 hover:text-red-900 p-2 rounded hover:bg-red-50 inline-flex items-center ml-2"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span className="ml-1">Delete</span>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {notes.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No notes found</p>
            <Button asChild className="mt-4">
              <Link href="/admin/notes/new">Create Your First Note</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}
