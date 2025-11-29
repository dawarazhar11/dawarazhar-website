import { NextRequest, NextResponse } from 'next/server'
import { isAuthenticated } from '@/lib/auth'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB

export async function POST(request: NextRequest) {
  try {
    const authenticated = await isAuthenticated()
    if (!authenticated) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const formData = await request.formData()
    const file = formData.get('file') as File | null
    const slug = formData.get('slug') as string || 'temp'
    const type = formData.get('type') as string || 'file'

    if (!file) {
      return NextResponse.json({ error: 'No file provided' }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: 'File too large. Maximum size is 50MB' }, { status: 400 })
    }

    // Validate file type
    const fileName = file.name.toLowerCase()
    if (type === 'model') {
      if (!fileName.endsWith('.glb') && !fileName.endsWith('.gltf')) {
        return NextResponse.json({ error: 'Only .glb and .gltf files are allowed for 3D models' }, { status: 400 })
      }
    } else if (type === 'image') {
      const validExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg']
      if (!validExtensions.some(ext => fileName.endsWith(ext))) {
        return NextResponse.json({ error: 'Invalid image format' }, { status: 400 })
      }
    }

    // Create directory if it doesn't exist
    const sanitizedSlug = slug.replace(/[^a-z0-9-]/gi, '')
    const uploadDir = path.join(process.cwd(), 'public', 'portfolio', sanitizedSlug)
    await mkdir(uploadDir, { recursive: true })

    // Generate unique filename
    const timestamp = Date.now()
    const extension = path.extname(file.name)
    const baseName = type === 'model' ? 'model' : `image-${timestamp}`
    const finalFileName = `${baseName}${extension}`
    const filePath = path.join(uploadDir, finalFileName)

    // Write file
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    await writeFile(filePath, buffer)

    // Return public URL
    const publicUrl = `/portfolio/${sanitizedSlug}/${finalFileName}`

    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName: finalFileName,
      size: file.size,
    })
  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json({ error: 'Failed to upload file' }, { status: 500 })
  }
}
