import { createClient } from '@supabase/supabase-js'

// Simple server-side client — no auth needed, just reading public posts
export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export type BlogPost = {
  id: string
  blog_id: string
  title: string
  slug: string
  content: string
  excerpt: string | null
  cover_image: string | null
  status: string
  category: string
  read_time: string
  tool_link: string | null
  tool_name: string | null
  seo_title: string | null
  seo_description: string | null
  views: number
  published_at: string
  created_at: string
}

// Fetch all published posts — used on blog listing page
export async function getAllPosts(): Promise<BlogPost[]> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .order('published_at', { ascending: false })

  if (error) {
    console.error('Supabase error:', error.message)
    return []
  }

  return data ?? []
}

// Fetch single post by slug — used on post detail page
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  const { data, error } = await supabase
    .from('posts')
    .select('*')
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) return null
  return data
}

// Fetch related posts (same category, different slug)
export async function getRelatedPosts(category: string, excludeSlug: string): Promise<BlogPost[]> {
  const { data } = await supabase
    .from('posts')
    .select('*')
    .eq('status', 'published')
    .eq('category', category)
    .neq('slug', excludeSlug)
    .limit(2)

  return data ?? []
}

// Increment view count
export async function incrementViews(postId: string) {
  await supabase.rpc('increment_post_views', { post_id: postId })
}
