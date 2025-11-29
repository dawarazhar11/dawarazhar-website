import { notFound } from "next/navigation"
import { getAllNotes, getNoteBySlug } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export async function generateStaticParams() {
  const notes = getAllNotes()
  return notes.map((note) => ({
    slug: note.slug,
  }))
}

export default async function NotePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const note = await getNoteBySlug(slug)

  if (!note) {
    notFound()
  }

  return (
    <article className="container py-10 max-w-4xl">
      <div className="space-y-4 pb-8">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/notes">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to notes
          </Link>
        </Button>
        <h1 className="text-3xl font-bold tracking-tight">{note.title}</h1>
        <div className="text-muted-foreground">
          <time dateTime={note.publishDate}>{formatDate(note.publishDate)}</time>
        </div>
      </div>
      <div 
        className="prose prose-gray dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: note.content }}
      />
    </article>
  )
}