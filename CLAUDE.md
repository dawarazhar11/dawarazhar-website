# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

**Development:**
- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build for production with Turbopack
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## Architecture

This is a professional engineering blog built with Next.js 15, featuring advanced animations, interactive visualizations, and comprehensive content management.

**Core Stack:**
- Next.js 15 with App Router and Turbopack
- TypeScript with strict mode configuration
- Tailwind CSS with custom design system
- Radix UI components for consistent UI
- Framer Motion for animations
- Recharts for data visualizations

**Content Management System:**
- Blog posts in `content/posts/` as Markdown with frontmatter
- Notes in `content/notes/` for quick thoughts and observations
- Content processing via `lib/posts.ts` with gray-matter and custom remark pipeline
- Auto-embed functionality for YouTube, Twitter/X, CodePen, and GitHub Gist via `lib/markdown.ts`
- Support for frontmatter: title, description, publishDate, tags, draft, image
- Automatic excerpt generation from content (150 chars max by default)

**Client/Server Architecture Pattern:**
- Server components handle data fetching (getAllPosts, getPostBySlug, getAllNotes, getNoteBySlug)
- Client components handle animations and interactivity
- Type definitions separated in `types/post.ts` to avoid import conflicts
- Wrapper components pattern: `*-content.tsx` files contain client-side animations
- IMPORTANT: Always use "use client" directive for components using Framer Motion or hooks

**Admin Panel:**
- `/admin` - Protected admin dashboard for content management
- `/admin/login` - Simple localStorage-based authentication (not production-ready)
- `/admin/posts` - List and manage all posts
- `/admin/posts/new` - Create new posts with markdown editor
- `/admin/posts/edit/[slug]` - Edit existing posts
- Admin actions in `lib/admin-actions.ts` (server actions for CRUD operations)
- Authentication helper in `lib/auth.ts` using ADMIN_PASSWORD env variable
- Uses PostEditor and MarkdownEditor components for content creation

**Professional Pages:**
- `/` - Animated homepage with recent posts
- `/portfolio` - Project showcase with interactive cards
- `/about` - Professional profile with metrics visualizations (`MetricsSection`)
- `/resume` - Complete professional resume with contact info
- `/posts` & `/posts/[slug]` - Blog posts with content listings and animations
- `/notes` & `/notes/[slug]` - Quick notes with content listings

**Animation System:**
- Framer Motion integration across all pages
- Staggered entrance animations with consistent timing (delays: 0.1s increments)
- Hover effects using whileHover and whileTap properties
- Interactive button animations with scale transforms
- Client-side animation wrappers for server components
- Animated counters with React CountUp library

**Visualization Components:**
- `components/about/metrics-section.tsx` - Professional metrics dashboard
- Interactive charts using Recharts (bar, pie, line charts)
- Proper responsive container setup with explicit margins
- X-axis rotation for long labels (angle={-45})
- Animated counters with React CountUp
- Custom color schemes using tailwind colors

**Key Configuration:**
- `@/*` path alias maps to repository root
- Dark mode support via client-side theme management
- Custom UI component system in `components/ui/`
- Image assets organized in `public/images/posts/`
- ESLint errors allowed during builds (ignoreDuringBuilds: true)
- TypeScript build errors blocked (ignoreBuildErrors: false)

**Markdown Processing:**
- Custom remark plugins: remarkAutoLink and remarkEmbeds
- Supports YouTube embeds (youtube.com, youtu.be)
- Supports Twitter/X embeds with async script loading
- Supports CodePen embeds with iframe
- Supports GitHub Gist embeds with script tags
- HTML allowed in markdown via allowDangerousHtml

**Important Notes:**
- When adding animations, use client wrapper components to avoid server/client conflicts
- Post type definitions are centralized in `types/post.ts`
- Markdown processing supports custom embeds and HTML content
- Admin panel authentication is localStorage-based and NOT production-ready
- Server actions are used for all admin CRUD operations (savePost, deletePost)
- Professional contact info: hello@dawarazhar.com, GitHub: dawarazhar11, LinkedIn: /in/dawarazhar