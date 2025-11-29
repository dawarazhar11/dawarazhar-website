import { getAllPosts } from "@/lib/posts"
import { HomeContent } from "@/components/home-content"

export default function HomePage() {
  const posts = getAllPosts().slice(0, 6)

  return <HomeContent posts={posts} />
}
