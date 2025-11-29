import { getAllNotes } from "@/lib/posts"
import { NotesContent } from "@/components/notes-content"

export default function NotesPage() {
  const notes = getAllNotes()

  return <NotesContent notes={notes} />
}