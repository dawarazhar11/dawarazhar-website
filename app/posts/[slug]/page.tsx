import { notFound } from "next/navigation"
import { getAllPosts, getPostBySlug } from "@/lib/posts"
import { formatDate } from "@/lib/utils"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AdminEditButton } from "@/components/admin-edit-button"
import type { Metadata } from "next"

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({
    slug: post.slug,
  }))
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dawarazhar.com'
  const postUrl = `${siteUrl}/posts/${post.slug}`
  const imageUrl = post.image || `${siteUrl}/og-image.png`

  return {
    title: post.title,
    description: post.description || post.excerpt,
    authors: [{ name: 'Dawar Azhar' }],
    openGraph: {
      title: post.title,
      description: post.description || post.excerpt,
      url: postUrl,
      siteName: 'Dawar Azhar Blog',
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
      locale: 'en_US',
      type: 'article',
      publishedTime: post.publishDate,
      authors: ['Dawar Azhar'],
      tags: post.tags,
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.description || post.excerpt,
      images: [imageUrl],
      creator: '@dawarazhar',
    },
    alternates: {
      canonical: postUrl,
    },
  }
}

export default async function PostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container py-10 max-w-4xl">
      <div className="space-y-4 pb-8">
        <div className="flex justify-between items-center">
          <Button variant="ghost" size="sm" asChild>
            <Link href="/posts">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to posts
            </Link>
          </Button>
          <AdminEditButton slug={slug} />
        </div>
        {post.image && (
          <div className="relative h-64 md:h-96 overflow-hidden rounded-lg bg-muted">
            <Image
              src={post.image}
              alt={post.title}
              fill
              className="object-cover"
              priority
            />
          </div>
        )}
        <h1 className="text-4xl font-bold tracking-tight">{post.title}</h1>
        <div className="flex items-center gap-4 text-muted-foreground">
          <time dateTime={post.publishDate}>{formatDate(post.publishDate)}</time>
          {post.tags.length > 0 && (
            <>
              <span>·</span>
              <div className="flex flex-wrap gap-2">
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
            </>
          )}
        </div>
      </div>
      <div 
        className="prose prose-gray dark:prose-invert max-w-none"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />
    </article>
  )
}