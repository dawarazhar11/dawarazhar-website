# Radix Blog App - Project Context

## Project Overview

This is a Next.js 15 blog application for Dawar Azhar, an engineering professional specializing in computational engineering, combining CFD (Computational Fluid Dynamics), FEA (Finite Element Analysis), and machine learning to solve complex engineering challenges.

The blog features:
- Markdown-based content management system with frontmatter metadata
- Dynamic blog post rendering with embedded media support
- Portfolio, resume, and about sections
- Modern UI with Tailwind CSS, Framer Motion animations, and Radix UI components
- Responsive design optimized for engineering content

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS with custom theme
- **UI Components**: Radix UI, Shadcn UI components
- **Content**: Markdown files with YAML frontmatter
- **Animations**: Framer Motion
- **Markdown Processing**: remark, rehype ecosystem
- **Deployment**: Vercel (standard Next.js deployment)

## Project Structure

```
├── app/                 # Next.js app router pages
│   ├── posts/          # Blog posts listing and individual post pages
│   ├── about/          # About page
│   ├── portfolio/      # Portfolio showcase
│   ├── resume/         # Resume page
│   └── ...             # Other pages
├── components/         # React UI components
├── content/            # Markdown content files
│   ├── posts/          # Blog post markdown files
│   └── notes/          # Notes markdown files
├── lib/                # Utility functions and data processing
├── types/              # TypeScript type definitions
├── public/             # Static assets
└── ...                 # Config files
```

## Content Management

The blog uses a file-based CMS approach where content is stored as Markdown files in the `content/posts/` directory. Each post includes:

- **Frontmatter metadata**: title, description, publishDate, tags, draft status, image
- **Markdown content**: The main article content with support for technical formatting

### Post Format Example

```markdown
---
title: "AI Advancements in 2025: A Year of Breakthroughs"
description: "This year has seen significant advancements in various areas of AI research, pushing the boundaries of what is possible."
publishDate: 2025-06-27
tags: ["uncategorized"]
---

**AI Advancements in 2025: A Year of Breakthroughs**

As we enter the year 2025, artificial intelligence (AI) has made tremendous strides...
```

## Development Commands

```bash
# Development server
npm run dev

# Build for production
npm run build

# Production server
npm run start

# Linting
npm run lint
```

## Key Implementation Details

1. **Static Generation**: Blog posts are statically generated at build time using `generateStaticParams`
2. **Markdown Processing**: Custom remark/rehype pipeline with support for:
   - YouTube/Twitter/CodePen/GitHub Gist embeds
   - Syntax highlighting
   - HTML sanitization
3. **Content API**: The `lib/posts.ts` module provides functions to:
   - Get all posts: `getAllPosts()`
   - Get post by slug: `getPostBySlug(slug)`
   - Get all notes: `getAllNotes()`
   - Get note by slug: `getNoteBySlug(slug)`
4. **SEO Optimization**: Meta descriptions, semantic HTML, and proper heading structure
5. **Responsive Design**: Mobile-first approach with Tailwind CSS breakpoints

## Content Creation Guidelines

Refer to `CONTENT_CREATION_GUIDE.md` for detailed guidelines on:
- Article structure and frontmatter format
- Writing style and technical standards
- SEO optimization and tagging strategy
- Media and visual content guidelines
- Code example standards
- Quality assurance checklist

## Adding New Content

To add a new blog post:
1. Create a new markdown file in `content/posts/` with the proper frontmatter
2. Write content using standard Markdown syntax
3. Add relevant tags and metadata
4. The post will automatically appear on the site after deployment

## Custom Features

- **Auto-Embeds**: Paste YouTube/Twitter URLs on their own lines for automatic embedding
- **Technical Formatting**: Support for LaTeX-style mathematical expressions
- **Code Syntax Highlighting**: Automatic syntax highlighting for code blocks
- **Responsive Images**: Properly sized images for different screen sizes
- **Animated UI**: Smooth animations and transitions using Framer Motion