'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getAllPosts, deletePost } from '@/lib/admin-actions'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { formatDate } from '@/lib/utils'
import { Post } from '@/types/post'
import { Pencil, Trash2, Plus } from 'lucide-react'

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
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 sm:gap-0">
        <h1 className="text-xl sm:text-2xl font-bold">Blog Posts</h1>
        <Button asChild size="sm" className="w-full sm:w-auto">
          <Link href="/admin/posts/new" className="flex items-center justify-center gap-2">
            <Plus className="h-4 w-4" />
            Create New Post
          </Link>
        </Button>
      </div>

      {/* Desktop Table View */}
      <div className="hidden md:block bg-white shadow rounded-lg overflow-hidden">
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

      {/* Mobile Card View */}
      <div className="md:hidden space-y-3">
        {posts.map((post) => (
          <div
            key={post.slug}
            className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-md transition-shadow"
            onClick={() => handleEdit(post.slug)}
          >
            <div className="flex justify-between items-start mb-2">
              <h3 className="text-sm font-medium text-gray-900 line-clamp-2 flex-1 pr-2">
                {post.title}
              </h3>
              <span className={`px-2 py-0.5 text-xs font-semibold rounded-full whitespace-nowrap ${
                post.draft ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'
              }`}>
                {post.draft ? 'Draft' : 'Published'}
              </span>
            </div>
            {post.description && (
              <p className="text-xs text-gray-500 line-clamp-2 mb-2">{post.description}</p>
            )}
            <div className="flex justify-between items-center text-xs text-gray-400">
              <span>{formatDate(post.publishDate)}</span>
              <div className="flex gap-2">
                <button
                  onClick={(e) => { e.stopPropagation(); handleEdit(post.slug) }}
                  className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 inline-flex items-center"
                >
                  <Pencil className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => handleDelete(post.slug, e)}
                  className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 inline-flex items-center"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}

        {posts.length === 0 && (
          <div className="text-center py-12 bg-white shadow rounded-lg">
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
