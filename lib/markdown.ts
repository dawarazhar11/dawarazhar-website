import { remark } from 'remark'
import html from 'remark-html'
import { visit } from 'unist-util-visit'
import rehypeSanitize, { defaultSchema } from 'rehype-sanitize'
import rehypeStringify from 'rehype-stringify'
import remarkRehype from 'remark-rehype'
import type { Node, Parent } from 'unist'

interface MdastNode extends Node {
  type: string
  children?: Array<{ type: string; url?: string; value?: string }>
  value?: string
}

// Custom plugin to convert URLs to embeds
function remarkEmbeds() {
  return (tree: Node) => {
    visit(tree, 'paragraph', (node: MdastNode) => {
      if (node.children && node.children.length === 1 && node.children[0].type === 'link') {
        const url = node.children[0].url
        if (!url) return

        // YouTube embed
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)
        if (youtubeMatch) {
          const videoId = youtubeMatch[1]
          ;(node as MdastNode).type = 'html'
          ;(node as MdastNode).value = `
            <div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 2rem 0;">
              <iframe
                src="https://www.youtube.com/embed/${videoId}"
                style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowfullscreen
                title="YouTube video"
              ></iframe>
            </div>
          `
          delete node.children
          return
        }

        // Twitter/X embed
        const twitterMatch = url.match(/(?:twitter\.com|x\.com)\/\w+\/status\/(\d+)/)
        if (twitterMatch) {
          ;(node as MdastNode).type = 'html'
          ;(node as MdastNode).value = `
            <div class="twitter-embed" style="margin: 2rem 0;">
              <blockquote class="twitter-tweet">
                <a href="${url}">Loading tweet...</a>
              </blockquote>
              <script async src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
            </div>
          `
          delete node.children
          return
        }

        // CodePen embed
        const codepenMatch = url.match(/codepen\.io\/([^\/]+)\/pen\/([^\/\?]+)/)
        if (codepenMatch) {
          const [, user, penId] = codepenMatch
          ;(node as MdastNode).type = 'html'
          ;(node as MdastNode).value = `
            <div class="codepen-embed" style="margin: 2rem 0;">
              <iframe
                height="400"
                style="width: 100%;"
                scrolling="no"
                title="CodePen Embed"
                src="https://codepen.io/${user}/embed/${penId}?default-tab=result"
                frameborder="no"
                loading="lazy"
                allowtransparency="true"
                allowfullscreen="true">
              </iframe>
            </div>
          `
          delete node.children
          return
        }

        // GitHub Gist embed
        const gistMatch = url.match(/gist\.github\.com\/([^\/]+)\/([a-f0-9]+)/)
        if (gistMatch) {
          const [, , gistId] = gistMatch
          ;(node as MdastNode).type = 'html'
          ;(node as MdastNode).value = `
            <div class="gist-embed" style="margin: 2rem 0;">
              <script src="https://gist.github.com/${gistMatch[1]}/${gistId}.js"></script>
            </div>
          `
          delete node.children
          return
        }
      }
    })
  }
}

// Also handle standalone URLs in text
function remarkAutoLink() {
  return (tree: Node) => {
    visit(tree, 'text', (node: MdastNode, index: number | undefined, parent: Parent | undefined) => {
      if (!parent || parent.type === 'link' || index === undefined) return

      const urlRegex = /^(https?:\/\/(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)[^\s]+)$/
      const nodeValue = node.value || ''
      const match = nodeValue.trim().match(urlRegex)

      if (match) {
        const url = match[1]
        const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/)

        if (youtubeMatch) {
          const videoId = youtubeMatch[1]
          ;(parent as Parent & { children: MdastNode[] }).children[index] = {
            type: 'html',
            value: `
              <div class="video-embed" style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 2rem 0;">
                <iframe
                  src="https://www.youtube.com/embed/${videoId}"
                  style="position: absolute; top: 0; left: 0; width: 100%; height: 100%; border: 0;"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowfullscreen
                  title="YouTube video"
                ></iframe>
              </div>
            `
          }
        }
      }
    })
  }
}

// Extend the default schema to allow iframes for embeds
const customSchema = {
  ...defaultSchema,
  tagNames: [...(defaultSchema.tagNames || []), 'iframe'],
  attributes: {
    ...defaultSchema.attributes,
    iframe: [
      'src',
      'width',
      'height',
      'frameborder',
      'allow',
      'allowfullscreen',
      'title',
      'style',
      'loading',
      'scrolling',
      'allowtransparency',
    ],
    div: [...(defaultSchema.attributes?.div || []), 'className', 'style'],
    script: ['src', 'async', 'charset'],
  },
  protocols: {
    ...defaultSchema.protocols,
    src: ['http', 'https'],
  },
}

export async function markdownToHtml(markdown: string): Promise<string> {
  const result = await remark()
    .use(remarkAutoLink)
    .use(remarkEmbeds)
    .use(remarkRehype, { allowDangerousHtml: true })
    .use(rehypeSanitize, customSchema)
    .use(rehypeStringify)
    .process(markdown)

  return result.toString()
}