import { Metadata } from 'next'
import { createClient } from '@supabase/supabase-js'
import JsonLd from '@/components/JsonLd'

async function getPost(id: string) {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    if (!supabaseUrl || !supabaseKey) return null

    const supabase = createClient(supabaseUrl, supabaseKey)

    // Try by slug first, then by id
    let { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', id)
      .single()

    if (!data) {
      const result = await supabase
        .from('blog_posts')
        .select('*')
        .eq('id', id)
        .single()
      data = result.data
    }

    return data
  } catch {
    return null
  }
}

export async function generateMetadata({ params }: { params: { id: string } }): Promise<Metadata> {
  const post = await getPost(params.id)

  if (!post) {
    return {
      title: 'Post Not Found',
      description: 'The blog post you are looking for does not exist.',
    }
  }

  const title = post.meta_title || post.title
  const description = post.meta_description || post.excerpt
  const imageUrl = post.image_url || '/images/og-image.png'

  return {
    title,
    description,
    alternates: {
      canonical: `https://anantasutra.com/blog/${post.slug}`,
    },
    openGraph: {
      title,
      description,
      url: `https://anantasutra.com/blog/${post.slug}`,
      type: 'article',
      publishedTime: post.date,
      modifiedTime: post.updated_at,
      authors: [post.author_name],
      section: post.category,
      tags: post.tags || [],
      images: imageUrl ? [{ url: imageUrl, width: 1200, height: 630, alt: post.image_alt || post.title }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: imageUrl ? [imageUrl] : [],
    },
  }
}

export default async function BlogPostLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: { id: string }
}) {
  const post = await getPost(params.id)

  if (!post) return <>{children}</>

  const articleJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.image_url || undefined,
    datePublished: post.date,
    dateModified: post.updated_at,
    author: {
      '@type': 'Person',
      name: post.author_name,
      url: 'https://anantasutra.com/co-founder',
    },
    publisher: {
      '@type': 'Organization',
      name: 'AnantaSutra',
      logo: {
        '@type': 'ImageObject',
        url: 'https://anantasutra.com/images/logo-nobg.png',
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://anantasutra.com/blog/${post.slug}`,
    },
    articleSection: post.category,
    keywords: (post.tags || []).join(', '),
    wordCount: post.content ? post.content.replace(/<[^>]*>/g, '').split(/\s+/).length : undefined,
    inLanguage: 'en',
  }

  const breadcrumbJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: 'https://anantasutra.com',
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Blog',
        item: 'https://anantasutra.com/blog',
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: post.title,
        item: `https://anantasutra.com/blog/${post.slug}`,
      },
    ],
  }

  return (
    <>
      <JsonLd data={articleJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      {children}
    </>
  )
}
