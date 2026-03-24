# ⚡ Synapse — AI & Technology Blog

A premium, futuristic blog platform built for AI and tech content. Inspired by Apple, OpenAI, and modern AI startups.

![Synapse Blog](https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&q=80)

## ✨ Features

- **Neural Particle Background** — Interactive canvas animation with mouse parallax
- **3D AI Orb** — React Three Fiber animated orb with distortion & orbital rings
- **Framer Motion** — Page transitions, scroll reveals, hover micro-interactions
- **Glassmorphism UI** — Subtle blur effects, neon accents, glow shadows
- **Dark/Light Mode** — Smooth toggle, dark-first design
- **Blog System** — Full CRUD with Supabase, draft/publish workflow
- **Admin Panel** — Secure dashboard, post editor, stats overview
- **Markdown Editor** — Write posts in Markdown with live preview
- **Reading Progress** — Neon progress bar on blog posts
- **SEO Optimized** — Meta tags, OG images, structured URLs

## 🛠 Tech Stack

| Layer | Tech |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Animations | Framer Motion |
| 3D Graphics | React Three Fiber + Three.js |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage |
| Fonts | DM Sans + Syne (Google Fonts) |
| Markdown | ReactMarkdown + remark-gfm |
| Icons | Lucide React |

---

## 🚀 Quick Start

### 1. Clone & Install

```bash
git clone https://github.com/yourname/synapse-blog.git
cd synapse-blog
npm install
```

### 2. Set Up Supabase

1. Go to [supabase.com](https://supabase.com) → **New Project**
2. Copy your **Project URL** and **anon key** from Settings → API
3. Open the **SQL Editor** and run `supabase/schema.sql`
4. Go to **Storage** → Create bucket `blog-images` (public)

### 3. Environment Variables

```bash
cp .env.example .env.local
```

Fill in `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Create Admin User

1. In Supabase Dashboard → **Authentication** → **Users** → **Invite user**
2. Enter your email & set a password
3. In **SQL Editor** run:
   ```sql
   UPDATE public.users SET role = 'admin' WHERE email = 'your@email.com';
   ```

### 5. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Home page
│   ├── layout.tsx            # Root layout (fonts, theme)
│   ├── blog/
│   │   ├── page.tsx          # Blog listing
│   │   └── [slug]/page.tsx   # Individual post
│   └── admin/
│       ├── page.tsx          # Dashboard
│       ├── login/page.tsx    # Auth page
│       └── posts/[id]/page.tsx # Post editor
├── components/
│   ├── layout/
│   │   ├── Navbar.tsx        # Sticky glass navbar
│   │   ├── Footer.tsx        # Footer with links
│   │   └── ThemeProvider.tsx # next-themes wrapper
│   ├── three/
│   │   ├── NeuralBackground.tsx # Canvas particle system
│   │   └── OrbScene.tsx      # Three.js AI orb
│   └── blog/
│       ├── Hero.tsx          # Landing hero section
│       ├── PostCard.tsx      # Blog card with animations
│       ├── FeaturedPosts.tsx # Featured grid
│       ├── LatestPosts.tsx   # All posts with tag filter
│       ├── PostContent.tsx   # Markdown renderer
│       ├── ReadingProgress.tsx # Scroll progress bar
│       └── NewsletterCTA.tsx # Email signup section
├── lib/
│   ├── supabase.ts           # Supabase client setup
│   ├── posts.ts              # Data fetching + mock data
│   └── utils.ts              # Helpers, formatters
├── types/
│   └── index.ts              # TypeScript interfaces
└── styles/
    └── globals.css           # Global styles, CSS vars
```

---

## 🗄 Database Schema

### `posts` table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Primary key |
| title | text | Post title |
| slug | text | URL slug (unique) |
| excerpt | text | Short summary |
| content | text | Markdown content |
| cover_image | text | Image URL |
| author_name | text | Display name |
| tags | text[] | Category tags |
| published | boolean | Live status |
| featured | boolean | Homepage feature |
| views | integer | View counter |
| reading_time | integer | Minutes to read |
| published_at | timestamptz | Publication date |

### `users` table
| Column | Type | Description |
|--------|------|-------------|
| id | uuid | Auth user ID |
| email | text | Login email |
| name | text | Display name |
| role | text | admin/author/reader |

---

## 🎨 Customization

### Colors (tailwind.config.ts)
```ts
neon: {
  blue: "#4f9eff",    // primary accent
  purple: "#a855f7",  // secondary accent
  cyan: "#22d3ee",    // tertiary
}
```

### Fonts
Change in `app/layout.tsx`:
```ts
import { DM_Sans, Syne } from "next/font/google";
```

### Mock Data → Real Data
In each page, replace:
```ts
const posts = MOCK_POSTS;
// with:
const posts = await getPosts();
```

---

## 🚢 Deployment

### Vercel (Recommended)
```bash
npm install -g vercel
vercel --prod
```

Add environment variables in Vercel dashboard.

### Environment Variables for Production
```env
NEXT_PUBLIC_SUPABASE_URL=your_production_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_production_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
NEXT_PUBLIC_SITE_URL=https://yoursite.com
```

---

## 📝 Writing Posts

1. Go to `/admin` → Sign in
2. Click **New Post**
3. Write in Markdown
4. Add tags, cover image
5. **Save Draft** or **Publish**

### Markdown Features
- `# H1`, `## H2`, `### H3` — Headings
- `**bold**`, `_italic_` — Emphasis  
- `` `code` `` — Inline code
- ```` ```js ```` — Syntax highlighted code blocks
- `> quote` — Blockquotes
- `- item` — Bullet lists
- `[link](url)` — Links
- `![alt](url)` — Images

---

## ⚡ Performance Tips

- Three.js orb is lazy-loaded with `Suspense`
- Neural background uses `requestAnimationFrame` with cleanup
- Images use Next.js `<Image>` with lazy loading
- Framer Motion uses `whileInView` to avoid rendering off-screen
- Posts are statically generated at build time

---

## 📄 License

MIT — feel free to use for personal or commercial projects.

---

Built with ❤️ using Next.js, Supabase, and Three.js
