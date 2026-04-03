-- ============================================
-- AnantaSutra Database Schema for Supabase
-- Run this in Supabase SQL Editor (one time)
-- ============================================

-- 1. Users table (blog writers/admins)
CREATE TABLE IF NOT EXISTS users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'writer' CHECK (role IN ('admin', 'editor', 'writer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Blog posts table
CREATE TABLE IF NOT EXISTS blog_posts (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  excerpt TEXT NOT NULL DEFAULT '',
  content TEXT NOT NULL DEFAULT '',
  author_id UUID REFERENCES users(id) ON DELETE SET NULL,
  author_name TEXT NOT NULL DEFAULT 'AnantaSutra',
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  read_time TEXT DEFAULT '5 min read',
  category TEXT NOT NULL DEFAULT 'General',
  tags TEXT[] DEFAULT '{}',
  featured BOOLEAN DEFAULT FALSE,
  status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'scheduled')),
  scheduled_date TIMESTAMPTZ,
  view_count INTEGER DEFAULT 0,
  meta_title TEXT,
  meta_description TEXT,
  image_url TEXT,
  image_alt TEXT,
  video_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Contact form submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  service TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Indexes for performance
CREATE INDEX IF NOT EXISTS idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX IF NOT EXISTS idx_blog_posts_status ON blog_posts(status);
CREATE INDEX IF NOT EXISTS idx_blog_posts_category ON blog_posts(category);
CREATE INDEX IF NOT EXISTS idx_blog_posts_date ON blog_posts(date DESC);
CREATE INDEX IF NOT EXISTS idx_blog_posts_featured ON blog_posts(featured) WHERE featured = TRUE;
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);

-- 5. Row Level Security (RLS)
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;

-- Public can read published blog posts
CREATE POLICY "Public can read published posts" ON blog_posts
  FOR SELECT USING (status = 'published' OR (status = 'scheduled' AND scheduled_date <= NOW()));

-- Authenticated users (via anon key with role check in app) can do everything with posts
CREATE POLICY "Anon can insert posts" ON blog_posts FOR INSERT WITH CHECK (true);
CREATE POLICY "Anon can update posts" ON blog_posts FOR UPDATE USING (true);
CREATE POLICY "Anon can delete posts" ON blog_posts FOR DELETE USING (true);
CREATE POLICY "Anon can read all posts" ON blog_posts FOR SELECT USING (true);

-- Users table: read all, insert/update via app
CREATE POLICY "Anyone can read users" ON users FOR SELECT USING (true);
CREATE POLICY "Anyone can insert users" ON users FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update users" ON users FOR UPDATE USING (true);

-- Contact submissions: insert public, read via app
CREATE POLICY "Anyone can insert contact" ON contact_submissions FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can read contact" ON contact_submissions FOR SELECT USING (true);
CREATE POLICY "Anyone can update contact" ON contact_submissions FOR UPDATE USING (true);

-- 6. Function to auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- 7. Insert default admin user (password: admin123 - change this!)
-- bcrypt hash for 'admin123'
INSERT INTO users (email, password_hash, name, role) VALUES
  ('admin@anantasutra.com', '$2a$10$rQEY7gVhTqFNOJxJdFmDaeGH5r7VSOIFjAMrMBLhIXDfYMqBqWyPa', 'Bhavya Duneja', 'admin')
ON CONFLICT (email) DO NOTHING;

-- 8. Chat sessions table (Sutra chatbot conversation recordings)
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id TEXT UNIQUE NOT NULL,
  messages JSONB NOT NULL DEFAULT '[]',
  meeting_booked BOOLEAN NOT NULL DEFAULT FALSE,
  meeting_data JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS chat_sessions_session_id_idx ON chat_sessions(session_id);
CREATE INDEX IF NOT EXISTS chat_sessions_created_at_idx ON chat_sessions(created_at DESC);
CREATE INDEX IF NOT EXISTS chat_sessions_meeting_booked_idx ON chat_sessions(meeting_booked);
