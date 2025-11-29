'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllPosts, deletePost } from '@/lib/admin-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Post } from '@/types/post'
import { Pencil, Trash2 } from 'lucide-react'

export default function AdminPostsPage() {
  const router = useRouter()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)

  const fetchPosts = async () => {
    try {
      const postsData = await getAllPosts()
      setPosts(postsData)
    } catch (error) {
      console.error('Error fetching posts:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
  }, [])

  const handleDelete = async (slug: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm('Are you sure you want to delete this post?')) {
      const success = await deletePost(slug)
      if (success) {
        fetchPosts()
      } else {
        alert('Failed to delete post')
      }
    }
  }

  const handleEdit = (slug: string) => {
    router.push(`/admin/posts/edit/${slug}`)
  }

  if (loading) {
    return <div className="flex justify-center items-center h-64">Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Button asChild>
          <Link href="/admin/posts/new">Create New Post</Link>
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
            {posts.map((post) => (
              <tr
                key={post.slug}
                className="hover:bg-gray-50 cursor-pointer"
                onClick={() => handleEdit(post.slug)}
              >
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">{post.title}</div>
                  <div className="text-sm text-gray-500 truncate max-w-md">{post.description}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(post.publishDate)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    post.draft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
                  }`}>
                    {post.draft ? 'Draft' : 'Published'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={(e) => { e.stopPropagation(); handleEdit(post.slug) }}
                    className="text-blue-600 hover:text-blue-900 p-2 rounded hover:bg-blue-50 inline-flex items-center"
                    title="Edit"
                  >
                    <Pencil className="h-4 w-4" />
                    <span className="ml-1">Edit</span>
                  </button>
                  <button
                    onClick={(e) => handleDelete(post.slug, e)}
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

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No posts found</p>
            <Button asChild className="mt-4">
              <Link href="/admin/posts/new">Create Your First Post</Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  )
}