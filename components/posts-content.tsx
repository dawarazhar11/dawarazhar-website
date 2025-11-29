"use client"

import { PostCard } from "@/components/post-card"
import { motion } from "framer-motion"
import { Post } from "@/types/post"
import { useState, useEffect } from "react"

interface PostsContentProps {
  posts: Post[]
}

export function PostsContent({ posts }: PostsContentProps) {
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => setShowEdit(data.authenticated))
      .catch(() => setShowEdit(false))
  }, [])

  return (
    <div className="container px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
      <motion.div
        className="space-y-3 sm:space-y-4 pb-6 sm:pb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <motion.h1
          className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Blog Posts
        </motion.h1>
        <motion.p 
          className="text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          Exploring engineering, technology, and software development
        </motion.p>
      </motion.div>
      <div className="grid gap-4 sm:gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {posts.map((post, index) => (
          <motion.div
            key={post.slug}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 + index * 0.1 }}
            whileHover={{ y: -5 }}
          >
            <PostCard post={post} showEdit={showEdit} />
          </motion.div>
        ))}
      </div>
    </div>
  )
}