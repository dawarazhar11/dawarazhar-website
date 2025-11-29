import { getAllPosts } from "@/lib/posts"
import { PostsContent } from "@/components/posts-content"

export default function PostsPage() {
  const posts = getAllPosts()

  return <PostsContent posts={posts} />
}