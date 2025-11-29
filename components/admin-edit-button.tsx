"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"
import Link from "next/link"

interface AdminEditButtonProps {
  slug: string
  className?: string
}

export function AdminEditButton({ slug, className }: AdminEditButtonProps) {
  const [showEdit, setShowEdit] = useState(false)

  useEffect(() => {
    fetch('/api/auth/check')
      .then(res => res.json())
      .then(data => setShowEdit(data.authenticated))
      .catch(() => setShowEdit(false))
  }, [])

  if (!showEdit) {
    return null
  }

  return (
    <Button variant="outline" size="sm" asChild className={className}>
      <Link href={`/admin/posts/edit/${slug}`}>
        <Edit className="mr-2 h-4 w-4" />
        Edit Post
      </Link>
    </Button>
  )
}