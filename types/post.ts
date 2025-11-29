export interface Post {
  slug: string
  title: string
  description: string
  publishDate: string
  tags: string[]
  draft: boolean
  content: string
  image?: string
  excerpt?: string
}