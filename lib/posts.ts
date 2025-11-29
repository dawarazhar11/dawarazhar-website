import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { markdownToHtml } from './markdown'
import type { Post } from '@/types/post'

export type { Post } from '@/types/post'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')
const notesDirectory = path.join(process.cwd(), 'content', 'notes')

function extractExcerpt(content: string, maxLength: number = 150): string {
  try {
    // Remove markdown syntax and get plain text
    const plainText = content
      .replace(/^#+\s+/gm, '') // Remove headers
      .replace(/\[([^\]]+)\]\([^\)]+\)/g, '$1') // Remove links
      .replace(/[*_~`]/g, '') // Remove emphasis
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim()

    if (plainText.length <= maxLength) return plainText
    return plainText.substring(0, maxLength).trim() + '...'
  } catch (error) {
    console.error('Error extracting excerpt:', error)
    return ''
  }
}

export function getAllPosts(): Post[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(postsDirectory)) {
      console.warn(`Posts directory does not exist: ${postsDirectory}`)
      return []
    }

    const fileNames = fs.readdirSync(postsDirectory)
    const allPosts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.md$/, '')
          const fullPath = path.join(postsDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf8')
          const { data, content } = matter(fileContents)

          return {
            slug,
            title: data.title || slug,
            description: data.description || extractExcerpt(content),
            publishDate: data.publishDate || new Date().toISOString(),
            tags: data.tags || [],
            draft: data.draft || false,
            content,
            image: data.image || undefined,
            excerpt: extractExcerpt(content),
          }
        } catch (error) {
          console.error(`Error reading post file ${fileName}:`, error)
          return null
        }
      })
      .filter((post): post is NonNullable<typeof post> => post !== null && !post.draft)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())

    return allPosts as Post[]
  } catch (error) {
    console.error('Error getting all posts:', error)
    return []
  }
}

export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  try {
    // Sanitize slug to prevent directory traversal
    const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '')
    const fullPath = path.join(postsDirectory, `${sanitizedSlug}.md`)

    if (!fs.existsSync(fullPath)) {
      console.warn(`Post not found: ${sanitizedSlug}`)
      return undefined
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const contentHtml = await markdownToHtml(content)

    return {
      slug: sanitizedSlug,
      title: data.title || sanitizedSlug,
      description: data.description || extractExcerpt(content),
      publishDate: data.publishDate || new Date().toISOString(),
      tags: data.tags || [],
      draft: data.draft || false,
      content: contentHtml,
      image: data.image || undefined,
      excerpt: extractExcerpt(content),
    }
  } catch (error) {
    console.error(`Error getting post by slug ${slug}:`, error)
    return undefined
  }
}

export function getAllNotes(): Post[] {
  try {
    // Check if directory exists
    if (!fs.existsSync(notesDirectory)) {
      console.warn(`Notes directory does not exist: ${notesDirectory}`)
      return []
    }

    const fileNames = fs.readdirSync(notesDirectory)
    const allNotes = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.md$/, '')
          const fullPath = path.join(notesDirectory, fileName)
          const fileContents = fs.readFileSync(fullPath, 'utf8')
          const { data, content } = matter(fileContents)

          return {
            slug,
            title: data.title || slug,
            description: data.description || extractExcerpt(content),
            publishDate: data.publishDate || new Date().toISOString(),
            tags: data.tags || [],
            draft: data.draft || false,
            content,
            image: data.image || undefined,
            excerpt: extractExcerpt(content),
          }
        } catch (error) {
          console.error(`Error reading note file ${fileName}:`, error)
          return null
        }
      })
      .filter((note): note is NonNullable<typeof note> => note !== null && !note.draft)
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())

    return allNotes as Post[]
  } catch (error) {
    console.error('Error getting all notes:', error)
    return []
  }
}

export async function getNoteBySlug(slug: string): Promise<Post | undefined> {
  try {
    // Sanitize slug to prevent directory traversal
    const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '')
    const fullPath = path.join(notesDirectory, `${sanitizedSlug}.md`)

    if (!fs.existsSync(fullPath)) {
      console.warn(`Note not found: ${sanitizedSlug}`)
      return undefined
    }

    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)
    const contentHtml = await markdownToHtml(content)

    return {
      slug: sanitizedSlug,
      title: data.title || sanitizedSlug,
      description: data.description || extractExcerpt(content),
      publishDate: data.publishDate || new Date().toISOString(),
      tags: data.tags || [],
      draft: data.draft || false,
      content: contentHtml,
      image: data.image || undefined,
      excerpt: extractExcerpt(content),
    }
  } catch (error) {
    console.error(`Error getting note by slug ${slug}:`, error)
    return undefined
  }
}