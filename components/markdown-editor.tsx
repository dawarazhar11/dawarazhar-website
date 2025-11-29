"use client"

import { useRef, useState, useCallback } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import {
  Bold,
  Italic,
  Heading1,
  Heading2,
  Heading3,
  List,
  ListOrdered,
  Link,
  Image,
  Code,
  Quote,
  Minus,
  Youtube,
  Eye,
  EyeOff,
  Upload
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface MarkdownEditorProps {
  value: string
  onChange: (value: string) => void
}

export default function MarkdownEditor({ value, onChange }: MarkdownEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [linkUrl, setLinkUrl] = useState("")
  const [linkText, setLinkText] = useState("")
  const [imageUrl, setImageUrl] = useState("")
  const [imageAlt, setImageAlt] = useState("")
  const [youtubeUrl, setYoutubeUrl] = useState("")
  const [isLinkDialogOpen, setIsLinkDialogOpen] = useState(false)
  const [isImageDialogOpen, setIsImageDialogOpen] = useState(false)
  const [isYoutubeDialogOpen, setIsYoutubeDialogOpen] = useState(false)

  const insertText = useCallback((before: string, after: string = "", placeholder: string = "") => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const end = textarea.selectionEnd
    const selectedText = value.substring(start, end) || placeholder
    const newText = value.substring(0, start) + before + selectedText + after + value.substring(end)

    onChange(newText)

    // Set cursor position after insert
    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + before.length + selectedText.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  const insertAtCursor = useCallback((text: string) => {
    const textarea = textareaRef.current
    if (!textarea) return

    const start = textarea.selectionStart
    const newText = value.substring(0, start) + text + value.substring(start)

    onChange(newText)

    setTimeout(() => {
      textarea.focus()
      const newCursorPos = start + text.length
      textarea.setSelectionRange(newCursorPos, newCursorPos)
    }, 0)
  }, [value, onChange])

  const handleBold = () => insertText("**", "**", "bold text")
  const handleItalic = () => insertText("*", "*", "italic text")
  const handleH1 = () => insertText("\n# ", "\n", "Heading 1")
  const handleH2 = () => insertText("\n## ", "\n", "Heading 2")
  const handleH3 = () => insertText("\n### ", "\n", "Heading 3")
  const handleBulletList = () => insertText("\n- ", "\n", "List item")
  const handleNumberedList = () => insertText("\n1. ", "\n", "List item")
  const handleCode = () => insertText("`", "`", "code")
  const handleCodeBlock = () => insertText("\n```\n", "\n```\n", "code block")
  const handleQuote = () => insertText("\n> ", "\n", "Quote")
  const handleHorizontalRule = () => insertAtCursor("\n\n---\n\n")

  const handleInsertLink = () => {
    if (linkUrl) {
      const text = linkText || linkUrl
      insertAtCursor(`[${text}](${linkUrl})`)
      setLinkUrl("")
      setLinkText("")
      setIsLinkDialogOpen(false)
    }
  }

  const handleInsertImage = () => {
    if (imageUrl) {
      const alt = imageAlt || "Image"
      insertAtCursor(`\n![${alt}](${imageUrl})\n`)
      setImageUrl("")
      setImageAlt("")
      setIsImageDialogOpen(false)
    }
  }

  const handleInsertYoutube = () => {
    if (youtubeUrl) {
      insertAtCursor(`\n${youtubeUrl}\n`)
      setYoutubeUrl("")
      setIsYoutubeDialogOpen(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Create form data for upload
    const formData = new FormData()
    formData.append('file', file)

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.ok) {
        const data = await response.json()
        setImageUrl(data.url)
      } else {
        alert('Failed to upload image')
      }
    } catch {
      // For now, create a local preview URL as fallback
      const localUrl = `/images/posts/${file.name}`
      setImageUrl(localUrl)
      alert(`Image upload API not configured. Use this path: ${localUrl}\nMake sure to manually copy the image to public/images/posts/`)
    }
  }

  // Simple markdown to HTML converter for preview
  const renderPreview = (markdown: string) => {
    let html = markdown
      // Code blocks (must be before inline code)
      .replace(/```([\s\S]*?)```/g, '<pre class="bg-gray-100 dark:bg-gray-800 p-4 rounded-md overflow-x-auto my-4"><code>$1</code></pre>')
      // Inline code
      .replace(/`([^`]+)`/g, '<code class="bg-gray-100 dark:bg-gray-800 px-1 rounded">$1</code>')
      // Headers
      .replace(/^### (.*$)/gim, '<h3 class="text-xl font-bold mt-6 mb-2">$1</h3>')
      .replace(/^## (.*$)/gim, '<h2 class="text-2xl font-bold mt-8 mb-3">$1</h2>')
      .replace(/^# (.*$)/gim, '<h1 class="text-3xl font-bold mt-8 mb-4">$1</h1>')
      // Bold and Italic
      .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank">$1</a>')
      // Images
      .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" class="max-w-full rounded-lg my-4" />')
      // Blockquotes
      .replace(/^> (.*$)/gim, '<blockquote class="border-l-4 border-gray-300 pl-4 italic my-4">$1</blockquote>')
      // Horizontal rule
      .replace(/^---$/gim, '<hr class="my-8 border-gray-300" />')
      // Unordered lists
      .replace(/^\- (.*$)/gim, '<li class="ml-4">$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.*$)/gim, '<li class="ml-4 list-decimal">$1</li>')
      // YouTube embeds (auto-detect URLs)
      .replace(/(https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+))/g,
        '<div class="my-4 aspect-video"><iframe class="w-full h-full rounded-lg" src="https://www.youtube.com/embed/$4" frameborder="0" allowfullscreen></iframe></div>')
      // Paragraphs (line breaks)
      .replace(/\n\n/g, '</p><p class="my-4">')
      .replace(/\n/g, '<br />')

    return `<p class="my-4">${html}</p>`
  }

  const ToolbarButton = ({ onClick, title, children }: { onClick: () => void, title: string, children: React.ReactNode }) => (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      onClick={onClick}
      title={title}
      className="h-8 w-8 p-0"
    >
      {children}
    </Button>
  )

  return (
    <div className="border border-gray-300 dark:border-gray-700 rounded-md overflow-hidden">
      {/* Toolbar */}
      <div className="bg-gray-50 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700 p-2 flex flex-wrap gap-1 items-center">
        {/* Text Formatting */}
        <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-1">
          <ToolbarButton onClick={handleBold} title="Bold (Ctrl+B)">
            <Bold className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleItalic} title="Italic (Ctrl+I)">
            <Italic className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Headings */}
        <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-1">
          <ToolbarButton onClick={handleH1} title="Heading 1">
            <Heading1 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleH2} title="Heading 2">
            <Heading2 className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleH3} title="Heading 3">
            <Heading3 className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Lists */}
        <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-1">
          <ToolbarButton onClick={handleBulletList} title="Bullet List">
            <List className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleNumberedList} title="Numbered List">
            <ListOrdered className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Link */}
        <Dialog open={isLinkDialogOpen} onOpenChange={setIsLinkDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Link">
              <Link className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Link</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="linkText">Link Text</Label>
                <Input
                  id="linkText"
                  value={linkText}
                  onChange={(e) => setLinkText(e.target.value)}
                  placeholder="Click here"
                />
              </div>
              <div>
                <Label htmlFor="linkUrl">URL</Label>
                <Input
                  id="linkUrl"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  placeholder="https://example.com"
                />
              </div>
              <Button onClick={handleInsertLink} className="w-full">Insert Link</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Image */}
        <Dialog open={isImageDialogOpen} onOpenChange={setIsImageDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Insert Image">
              <Image className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Insert Image</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="imageAlt">Alt Text</Label>
                <Input
                  id="imageAlt"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  placeholder="Image description"
                />
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={imageUrl}
                  onChange={(e) => setImageUrl(e.target.value)}
                  placeholder="/images/posts/my-image.jpg"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Or upload:</span>
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <Button type="button" variant="outline" size="sm" asChild>
                    <span><Upload className="h-4 w-4 mr-2" />Upload Image</span>
                  </Button>
                </label>
              </div>
              <Button onClick={handleInsertImage} className="w-full">Insert Image</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* YouTube */}
        <Dialog open={isYoutubeDialogOpen} onOpenChange={setIsYoutubeDialogOpen}>
          <DialogTrigger asChild>
            <Button type="button" variant="ghost" size="sm" className="h-8 w-8 p-0" title="Embed YouTube">
              <Youtube className="h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Embed YouTube Video</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="youtubeUrl">YouTube URL</Label>
                <Input
                  id="youtubeUrl"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                />
              </div>
              <p className="text-sm text-muted-foreground">
                Just paste the YouTube URL and it will be automatically embedded.
              </p>
              <Button onClick={handleInsertYoutube} className="w-full">Insert Video</Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Code */}
        <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-1">
          <ToolbarButton onClick={handleCode} title="Inline Code">
            <Code className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleCodeBlock} title="Code Block">
            <span className="text-xs font-mono">{'{}'}</span>
          </ToolbarButton>
        </div>

        {/* Quote & HR */}
        <div className="flex gap-0.5 border-r border-gray-300 dark:border-gray-600 pr-2 mr-1">
          <ToolbarButton onClick={handleQuote} title="Blockquote">
            <Quote className="h-4 w-4" />
          </ToolbarButton>
          <ToolbarButton onClick={handleHorizontalRule} title="Horizontal Rule">
            <Minus className="h-4 w-4" />
          </ToolbarButton>
        </div>

        {/* Preview Toggle */}
        <div className="ml-auto">
          <Button
            type="button"
            variant={showPreview ? "default" : "outline"}
            size="sm"
            onClick={() => setShowPreview(!showPreview)}
            className="h-8"
          >
            {showPreview ? <EyeOff className="h-4 w-4 mr-2" /> : <Eye className="h-4 w-4 mr-2" />}
            {showPreview ? "Edit" : "Preview"}
          </Button>
        </div>
      </div>

      {/* Editor / Preview */}
      {showPreview ? (
        <div
          className="min-h-[400px] p-4 prose prose-gray dark:prose-invert max-w-none overflow-auto"
          dangerouslySetInnerHTML={{ __html: renderPreview(value) }}
        />
      ) : (
        <Textarea
          ref={textareaRef}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="min-h-[400px] font-mono text-sm border-0 rounded-none focus-visible:ring-0"
          placeholder={`Start writing your post...

Use the toolbar above or type Markdown directly:
# Heading 1
## Heading 2
**bold** or *italic*
- Bullet points
1. Numbered list
[Link text](https://url.com)
![Image alt](image-url.jpg)

Paste YouTube URLs for auto-embedding!`}
        />
      )}

      {/* Footer */}
      <div className="bg-gray-50 dark:bg-gray-800 px-3 py-2 text-xs text-muted-foreground border-t border-gray-300 dark:border-gray-700 flex justify-between">
        <span>Supports Markdown syntax • YouTube/Twitter URLs auto-embed</span>
        <span>{value.length} characters</span>
      </div>
    </div>
  )
}
