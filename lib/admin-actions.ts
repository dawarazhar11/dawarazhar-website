'use server'

import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Post } from '@/types/post'

const postsDirectory = path.join(process.cwd(), 'content', 'posts')
const notesDirectory = path.join(process.cwd(), 'content', 'notes')

// Get all posts
export async function getAllPosts(): Promise<Post[]> {
  if (!fs.existsSync(postsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(postsDirectory)
  const allPosts = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(postsDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        publishDate: data.publishDate || new Date().toISOString(),
        tags: data.tags || [],
        draft: data.draft || false,
        content,
        image: data.image || null,
      }
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())

  return allPosts
}

// Get post by slug
export async function getPostBySlug(slug: string): Promise<Post | undefined> {
  const fullPath = path.join(postsDirectory, `${slug}.md`)
  
  if (!fs.existsSync(fullPath)) {
    return undefined
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    publishDate: data.publishDate || new Date().toISOString(),
    tags: data.tags || [],
    draft: data.draft || false,
    content,
    image: data.image || null,
  }
}

// Save post
export async function savePost(post: Post): Promise<boolean> {
  try {
    // Create posts directory if it doesn't exist
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true })
    }

    // Generate slug from title if not provided
    let slug = post.slug || post.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled'
    
    // Ensure slug is unique
    const fullPath = path.join(postsDirectory, `${slug}.md`)
    let counter = 1
    let uniqueSlug = slug
    while (fs.existsSync(path.join(postsDirectory, `${uniqueSlug}.md`)) && 
           (!post.slug || uniqueSlug !== post.slug)) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
    slug = uniqueSlug
    
    // Format frontmatter - filter out undefined values
    const frontmatter: Record<string, unknown> = {
      title: post.title || 'Untitled',
      description: post.description || '',
      publishDate: post.publishDate || new Date().toISOString().split('T')[0],
      tags: post.tags || [],
      draft: post.draft ?? false,
    }

    // Only add image if it exists
    if (post.image) {
      frontmatter.image = post.image
    }

    // Create markdown content with frontmatter
    const markdownContent = matter.stringify(post.content || '', frontmatter)
    
    // Write file
    const finalPath = path.join(postsDirectory, `${slug}.md`)
    fs.writeFileSync(finalPath, markdownContent)
    
    return true
  } catch (error) {
    console.error('Error saving post:', error)
    return false
  }
}

// Delete post
export async function deletePost(slug: string): Promise<boolean> {
  try {
    const fullPath = path.join(postsDirectory, `${slug}.md`)

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      return true
    }

    return false
  } catch (error) {
    console.error('Error deleting post:', error)
    return false
  }
}

// ============== NOTES FUNCTIONS ==============

// Get all notes
export async function getAllNotes(): Promise<Post[]> {
  if (!fs.existsSync(notesDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(notesDirectory)
  const allNotes = fileNames
    .filter(fileName => fileName.endsWith('.md'))
    .map((fileName) => {
      const slug = fileName.replace(/\.md$/, '')
      const fullPath = path.join(notesDirectory, fileName)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug,
        title: data.title || slug,
        description: data.description || '',
        publishDate: data.publishDate || new Date().toISOString(),
        tags: data.tags || [],
        draft: data.draft || false,
        content,
        image: data.image || null,
      }
    })
    .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())

  return allNotes
}

// Get note by slug
export async function getNoteBySlug(slug: string): Promise<Post | undefined> {
  const fullPath = path.join(notesDirectory, `${slug}.md`)

  if (!fs.existsSync(fullPath)) {
    return undefined
  }

  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug,
    title: data.title || slug,
    description: data.description || '',
    publishDate: data.publishDate || new Date().toISOString(),
    tags: data.tags || [],
    draft: data.draft || false,
    content,
    image: data.image || null,
  }
}

// Save note
export async function saveNote(note: Post): Promise<boolean> {
  try {
    if (!fs.existsSync(notesDirectory)) {
      fs.mkdirSync(notesDirectory, { recursive: true })
    }

    let slug = note.slug || note.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'untitled'

    let counter = 1
    let uniqueSlug = slug
    while (fs.existsSync(path.join(notesDirectory, `${uniqueSlug}.md`)) &&
           (!note.slug || uniqueSlug !== note.slug)) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
    slug = uniqueSlug

    const frontmatter: Record<string, unknown> = {
      title: note.title || 'Untitled',
      description: note.description || '',
      publishDate: note.publishDate || new Date().toISOString().split('T')[0],
      tags: note.tags || [],
      draft: note.draft ?? false,
    }

    if (note.image) {
      frontmatter.image = note.image
    }

    const markdownContent = matter.stringify(note.content || '', frontmatter)

    const finalPath = path.join(notesDirectory, `${slug}.md`)
    fs.writeFileSync(finalPath, markdownContent)

    return true
  } catch (error) {
    console.error('Error saving note:', error)
    return false
  }
}

// Delete note
export async function deleteNote(slug: string): Promise<boolean> {
  try {
    const fullPath = path.join(notesDirectory, `${slug}.md`)

    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath)
      return true
    }

    return false
  } catch (error) {
    console.error('Error deleting note:', error)
    return false
  }
}