import Link from "next/link"
import Image from "next/image"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { formatDate } from "@/lib/utils"
import { Post } from "@/types/post"
import { Button } from "@/components/ui/button"
import { ArrowRight, Edit, FileText } from "lucide-react"

interface PostCardProps {
  post: Post
  showEdit?: boolean
}

export function PostCard({ post, showEdit = false }: PostCardProps) {
  const hasValidImage = post.image && !post.image.startsWith('data:') && post.image.length < 500

  return (
    <Card className="h-full flex flex-col hover:shadow-lg transition-shadow overflow-hidden">
      <Link href={`/posts/${post.slug}`} className="relative h-40 sm:h-48 overflow-hidden bg-muted flex items-center justify-center">
        {hasValidImage ? (
          <img
            src={post.image}
            alt={post.title}
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-muted-foreground">
            <FileText className="h-12 w-12 mb-2" />
            <span className="text-xs">Engineering Blog Post</span>
          </div>
        )}
      </Link>
      <CardHeader>
        <CardTitle className="line-clamp-2">
          <Link href={`/posts/${post.slug}`} className="hover:underline">
            {post.title}
          </Link>
        </CardTitle>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
        </div>
      </CardHeader>
      <CardContent className="flex-1">
        <CardDescription className="line-clamp-3">
          {post.description || post.excerpt}
        </CardDescription>
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {post.tags.slice(0, 5).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center rounded-md bg-secondary px-2.5 py-0.5 text-xs font-semibold text-secondary-foreground"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 5 && (
              <span className="inline-flex items-center rounded-md bg-muted px-2.5 py-0.5 text-xs font-semibold text-muted-foreground">
                +{post.tags.length - 5} more
              </span>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/posts/${post.slug}`}>
            Read more
            <ArrowRight className="ml-1 h-4 w-4" />
          </Link>
        </Button>
        {showEdit && (
          <Button variant="outline" size="sm" asChild>
            <Link href={`/admin/posts/edit/${post.slug}`}>
              <Edit className="mr-1 h-4 w-4" />
              Edit
            </Link>
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}