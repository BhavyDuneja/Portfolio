'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit, Trash2, Save, X, Lock, LogOut, Image as ImageIcon,
  Video, LayoutDashboard, FileText, Eye, BarChart3, Search,
  ChevronDown, Calendar, Clock, Tag, Filter, ArrowUpDown,
  CheckCircle2, AlertCircle, Timer, Upload, Download, Database
} from 'lucide-react'
import Link from 'next/link'
import {
  getAllPosts, addPost, updatePost, deletePost,
  BlogPost, PostStatus, generateSlug, getPostStats,
  uploadImage
} from '@/lib/storage'
import { isAuthenticated, loginUser, logoutUser, getAuthUser } from '@/lib/auth'
import RichTextEditor from '@/components/RichTextEditor'

// ── Toast System ──
interface Toast {
  id: number
  message: string
  type: 'success' | 'error' | 'info'
}

let toastId = 0

const ToastContainer = ({ toasts, onRemove }: { toasts: Toast[]; onRemove: (id: number) => void }) => (
  <div className="fixed top-6 right-6 z-[100] flex flex-col gap-3">
    <AnimatePresence>
      {toasts.map(toast => (
        <motion.div
          key={toast.id}
          initial={{ opacity: 0, x: 80, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: 80, scale: 0.9 }}
          className={`flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border backdrop-blur-xl min-w-[280px] ${
            toast.type === 'success'
              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
              : toast.type === 'error'
              ? 'bg-red-500/10 border-red-500/30 text-red-400'
              : 'bg-saffron-500/10 border-saffron-500/30 text-saffron-400'
          }`}
        >
          {toast.type === 'success' ? <CheckCircle2 className="w-5 h-5 shrink-0" /> :
           toast.type === 'error' ? <AlertCircle className="w-5 h-5 shrink-0" /> :
           <AlertCircle className="w-5 h-5 shrink-0" />}
          <span className="text-sm font-medium flex-1">{toast.message}</span>
          <button onClick={() => onRemove(toast.id)} className="text-white/40 hover:text-white/70">
            <X className="w-4 h-4" />
          </button>
        </motion.div>
      ))}
    </AnimatePresence>
  </div>
)

// ── Delete Confirmation Modal ──
const DeleteModal = ({ postTitle, onConfirm, onCancel }: { postTitle: string; onConfirm: () => void; onCancel: () => void }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[90] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
    onClick={onCancel}
  >
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.9, opacity: 0 }}
      className="bg-dark-300 border border-white/10 rounded-2xl p-8 max-w-md w-full shadow-2xl"
      onClick={e => e.stopPropagation()}
    >
      <div className="text-center">
        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
          <Trash2 className="w-8 h-8 text-red-400" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Delete Post</h3>
        <p className="text-gray-400 mb-6">
          Are you sure you want to delete &quot;{postTitle}&quot;? This action cannot be undone.
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onCancel}
            className="px-6 py-2.5 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all font-medium"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-6 py-2.5 rounded-xl bg-red-500 text-white hover:bg-red-600 transition-all font-medium"
          >
            Delete
          </button>
        </div>
      </div>
    </motion.div>
  </motion.div>
)

// ── Status Badge ──
const StatusBadge = ({ status }: { status: PostStatus }) => {
  const config = {
    published: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', border: 'border-emerald-500/20', icon: CheckCircle2, label: 'Published' },
    draft: { bg: 'bg-yellow-500/10', text: 'text-yellow-400', border: 'border-yellow-500/20', icon: FileText, label: 'Draft' },
    scheduled: { bg: 'bg-blue-500/10', text: 'text-blue-400', border: 'border-blue-500/20', icon: Timer, label: 'Scheduled' },
  }
  const c = config[status]
  const Icon = c.icon
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${c.bg} ${c.text} border ${c.border}`}>
      <Icon className="w-3 h-3" />
      {c.label}
    </span>
  )
}

// ── Form Data ──
interface FormData {
  title: string
  slug: string
  excerpt: string
  content: string
  category: string
  tags: string
  readTime: string
  author: string
  featured: boolean
  status: PostStatus
  scheduledDate: string
  imageUrl: string
  videoUrl: string
  imageAlt: string
  metaTitle: string
  metaDescription: string
}

const emptyForm: FormData = {
  title: '',
  slug: '',
  excerpt: '',
  content: '',
  category: 'Software Architecture',
  tags: '',
  readTime: '',
  author: 'Bhavya Duneja',
  featured: false,
  status: 'draft',
  scheduledDate: '',
  imageUrl: '',
  videoUrl: '',
  imageAlt: '',
  metaTitle: '',
  metaDescription: '',
}

const categories = [
  'Software Architecture',
  'Cloud Computing',
  'Career',
  'Web Development',
  'Startup and Finance',
  'Philosophy',
  'Cooking',
  'AI & Automation',
  'Wisdom & Philosophy',
  'Product Stories',
  'Marketing',
  "Founder's Journal",
]

type SortKey = 'date' | 'views' | 'title'
type SortDir = 'asc' | 'desc'

// ── Main Component ──
const AdminPanel = () => {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [stats, setStats] = useState({ total: 0, published: 0, drafts: 0, scheduled: 0, totalViews: 0 })
  const [isClient, setIsClient] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // UI state
  const [activeView, setActiveView] = useState<'dashboard' | 'posts' | 'form' | 'meetings' | 'calendar'>('dashboard')
  const [meetings, setMeetings] = useState<any[]>([])
  const [meetingsLoading, setMeetingsLoading] = useState(false)
  const [expandedMeeting, setExpandedMeeting] = useState<string | null>(null)
  const [meetingNotes, setMeetingNotes] = useState<Record<string, string>>({})
  const [savingNotes, setSavingNotes] = useState<string | null>(null)
  const [rescheduleData, setRescheduleData] = useState<Record<string, { date: string; time: string }>>({})
  const [showReschedule, setShowReschedule] = useState<string | null>(null)
  const [showFollowUp, setShowFollowUp] = useState<string | null>(null)
  const [followUpData, setFollowUpData] = useState<Record<string, { date: string; time: string; agenda: string }>>({})
  const [savingFollowUp, setSavingFollowUp] = useState(false)
  const [calendarMonth, setCalendarMonth] = useState(new Date())
  const [editingPost, setEditingPost] = useState<BlogPost | null>(null)
  const [formData, setFormData] = useState<FormData>(emptyForm)
  const [toasts, setToasts] = useState<Toast[]>([])
  const [deleteTarget, setDeleteTarget] = useState<BlogPost | null>(null)

  // Post list filters
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<PostStatus | 'all'>('all')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [sortKey, setSortKey] = useState<SortKey>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')

  // ── Toasts ──
  const showToast = useCallback((message: string, type: Toast['type'] = 'success') => {
    const id = ++toastId
    setToasts(prev => [...prev, { id, message, type }])
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 4000)
  }, [])

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  // ── Init ──
  useEffect(() => {
    setIsClient(true)
    if (typeof window !== 'undefined') {
      setAuthenticated(isAuthenticated())
    }
  }, [])

  useEffect(() => {
    if (!isClient || !authenticated) return
    const loadData = async () => {
      const [allPosts, postStats] = await Promise.all([getAllPosts(), getPostStats()])
      setPosts(allPosts)
      setStats(postStats)
    }
    loadData()
  }, [isClient, authenticated])

  const reloadPosts = async () => {
    const [allPosts, postStats] = await Promise.all([getAllPosts(), getPostStats()])
    setPosts(allPosts)
    setStats(postStats)
  }

  const loadMeetings = useCallback(async () => {
    setMeetingsLoading(true)
    try {
      const res = await fetch('/api/meetings')
      const data = await res.json()
      setMeetings(data.meetings || [])
    } catch { setMeetings([]) }
    setMeetingsLoading(false)
  }, [])

  useEffect(() => {
    if ((activeView === 'meetings' || activeView === 'calendar') && meetings.length === 0) loadMeetings()
  }, [activeView, meetings.length, loadMeetings])

  const saveNotes = async (meetingId: string) => {
    setSavingNotes(meetingId)
    try {
      await fetch('/api/meetings/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: meetingId, notes: meetingNotes[meetingId] || '' }),
      })
      setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, notes: meetingNotes[meetingId] } : m))
      showToast('Notes saved!', 'success')
    } catch { showToast('Failed to save notes', 'error') }
    setSavingNotes(null)
  }

  const updateMeetingStatus = async (meetingId: string, status: string) => {
    if (status === 'rescheduled') {
      setShowReschedule(showReschedule === meetingId ? null : meetingId)
      return
    }
    try {
      await fetch('/api/meetings/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: meetingId, status }),
      })
      // Send email for cancelled or no-show
      if (status === 'cancelled' || status === 'no-show') {
        const meeting = meetings.find(m => m.id === meetingId)
        if (meeting) {
          await fetch('/api/meetings/status-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ...meeting, status }),
          })
        }
      }
      setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, status } : m))
      setShowReschedule(null)
      showToast(`Status updated to ${status}`, 'success')
    } catch { showToast('Failed to update status', 'error') }
  }

  const confirmReschedule = async (meetingId: string) => {
    const rd = rescheduleData[meetingId]
    if (!rd?.date || !rd?.time) {
      showToast('Please select new date and time', 'error')
      return
    }
    try {
      await fetch('/api/meetings/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: meetingId,
          status: 'rescheduled',
          meeting_date: rd.date,
          meeting_time: rd.time,
        }),
      })
      // Send reschedule confirmation email to client
      const meeting = meetings.find(m => m.id === meetingId)
      if (meeting) {
        await fetch('/api/meetings/status-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...meeting,
            status: 'rescheduled',
            new_date: rd.date,
            new_time: rd.time,
          }),
        })
      }
      setMeetings(prev => prev.map(m => m.id === meetingId ? { ...m, status: 'rescheduled', meeting_date: rd.date, meeting_time: rd.time } : m))
      setShowReschedule(null)
      showToast(`Rescheduled to ${rd.date} at ${rd.time} — confirmation email sent`, 'success')
    } catch { showToast('Failed to reschedule', 'error') }
  }

  const createFollowUp = async (parentMeeting: any) => {
    const fd = followUpData[parentMeeting.id]
    if (!fd?.date || !fd?.time || !fd?.agenda) {
      showToast('Please fill date, time, and agenda', 'error')
      return
    }
    setSavingFollowUp(true)
    try {
      const meetingNumber = meetings.filter(m => m.email === parentMeeting.email).length + 1
      await fetch('/api/meetings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: parentMeeting.name,
          email: parentMeeting.email,
          phone: parentMeeting.phone,
          date: fd.date,
          time: fd.time,
          timezone: parentMeeting.timezone,
          service_interest: `Meeting #${meetingNumber}: ${fd.agenda}`,
          parent_meeting_id: parentMeeting.id,
        }),
      })
      // Auto-mark current meeting as completed
      await fetch('/api/meetings/notes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: parentMeeting.id, status: 'completed' }),
      })
      setShowFollowUp(null)
      showToast(`Meeting completed. Follow-up "${fd.agenda}" scheduled for ${fd.date}`, 'success')
      await loadMeetings()
    } catch { showToast('Failed to create follow-up', 'error') }
    setSavingFollowUp(false)
  }

  // ── Image Upload ──
  const [uploading, setUploading] = useState(false)

  const handleImageUpload = async (file: File) => {
    setUploading(true)
    const url = await uploadImage(file)
    setUploading(false)
    if (url) {
      setFormData(prev => ({ ...prev, imageUrl: url }))
      showToast('Image uploaded successfully!')
    } else {
      showToast('Failed to upload image. Try again.', 'error')
    }
  }

  // ── Export / Import Posts ──
  const handleExportPosts = () => {
    const data = JSON.stringify(posts, null, 2)
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `anantasutra-blog-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
    showToast('Blog posts exported!')
  }

  const handleImportPosts = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = async (ev) => {
      try {
        const imported = JSON.parse(ev.target?.result as string)
        if (Array.isArray(imported)) {
          let count = 0
          for (const post of imported) {
            try {
              const { id: _id, ...postWithoutId } = post
              await addPost(postWithoutId as Omit<BlogPost, 'id'>)
              count++
            } catch (err) {
              console.error('Failed to import post:', post.title, err)
            }
          }
          await reloadPosts()
          showToast(`Imported ${count} of ${imported.length} posts!`)
        } else {
          showToast('Invalid file format', 'error')
        }
      } catch {
        showToast('Failed to parse file', 'error')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  // ── Auth ──
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoginError('')
    setLoginLoading(true)
    try {
      const user = await loginUser(loginEmail, loginPassword)
      if (user) {
        setAuthenticated(true)
        setLoginEmail('')
        setLoginPassword('')
      } else {
        setLoginError('Invalid email or password. Please try again.')
      }
    } catch {
      setLoginError('Login failed. Please try again.')
    } finally {
      setLoginLoading(false)
    }
  }

  const handleLogout = () => {
    logoutUser()
    setAuthenticated(false)
    setActiveView('dashboard')
  }

  // ── Form Handlers ──
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    const checked = (e.target as HTMLInputElement).checked
    setFormData(prev => {
      const updated = { ...prev, [name]: type === 'checkbox' ? checked : value }
      // Auto-generate slug from title
      if (name === 'title') {
        updated.slug = generateSlug(value)
      }
      return updated
    })
  }

  const openCreateForm = () => {
    setEditingPost(null)
    setFormData(emptyForm)
    setActiveView('form')
  }

  const openEditForm = (post: BlogPost) => {
    setEditingPost(post)
    setFormData({
      title: post.title,
      slug: post.slug || generateSlug(post.title),
      excerpt: post.excerpt,
      content: post.content,
      category: post.category,
      tags: post.tags.join(', '),
      readTime: post.readTime,
      author: post.author,
      featured: post.featured,
      status: post.status || 'published',
      scheduledDate: post.scheduledDate || '',
      imageUrl: post.imageUrl || '',
      videoUrl: post.videoUrl || '',
      imageAlt: post.imageAlt || '',
      metaTitle: post.metaTitle || '',
      metaDescription: post.metaDescription || '',
    })
    setActiveView('form')
  }

  // YouTube / GDrive helpers
  const getYouTubeEmbedUrl = (url: string): string => {
    if (!url) return ''
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
      /youtube\.com\/watch\?.*v=([^&\n?#]+)/,
    ]
    for (const pattern of patterns) {
      const match = url.match(pattern)
      if (match?.[1]) return `https://www.youtube.com/embed/${match[1]}`
    }
    return url
  }

  const getGoogleDriveImageUrl = (url: string): string => {
    if (!url) return ''
    if (url.includes('drive.google.com/file/d/')) {
      const fileId = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/)?.[1]
      if (fileId) return `https://drive.google.com/uc?export=view&id=${fileId}`
    }
    return url
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const now = new Date().toISOString()

    const postData: Omit<BlogPost, 'id'> & { id?: string } = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      excerpt: formData.excerpt,
      content: formData.content,
      author: formData.author || 'Bhavya Duneja',
      date: editingPost?.date || now.split('T')[0],
      readTime: formData.readTime,
      category: formData.category,
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean),
      featured: formData.featured,
      status: formData.status,
      scheduledDate: formData.status === 'scheduled' ? formData.scheduledDate : undefined,
      viewCount: editingPost?.viewCount || 0,
      metaTitle: formData.metaTitle,
      metaDescription: formData.metaDescription,
      imageUrl: formData.imageUrl ? getGoogleDriveImageUrl(formData.imageUrl) : undefined,
      videoUrl: formData.videoUrl ? getYouTubeEmbedUrl(formData.videoUrl) : undefined,
      imageAlt: formData.imageAlt,
      createdAt: editingPost?.createdAt || now,
      updatedAt: now,
    }

    try {
      if (editingPost) {
        await updatePost(editingPost.id, postData)
        showToast('Post updated successfully!')
      } else {
        await addPost(postData as Omit<BlogPost, 'id'>)
        showToast('Post created successfully!')
      }
      await reloadPosts()
      setFormData(emptyForm)
      setEditingPost(null)
      setActiveView('posts')
    } catch (error) {
      console.error('Error saving post:', error)
      showToast('Failed to save post. Please try again.', 'error')
    }
  }

  const handleDelete = async () => {
    if (!deleteTarget) return
    const success = await deletePost(deleteTarget.id)
    if (success) {
      await reloadPosts()
      showToast('Post deleted successfully!')
    } else {
      showToast('Failed to delete post.', 'error')
    }
    setDeleteTarget(null)
  }

  // ── Filtering & Sorting ──
  const filteredPosts = (() => {
    let result = [...posts]
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.title.toLowerCase().includes(q) ||
        p.excerpt.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q))
      )
    }
    if (statusFilter !== 'all') {
      result = result.filter(p => p.status === statusFilter)
    }
    if (categoryFilter !== 'all') {
      result = result.filter(p => p.category === categoryFilter)
    }
    result.sort((a, b) => {
      let cmp = 0
      if (sortKey === 'date') cmp = new Date(a.updatedAt || a.date).getTime() - new Date(b.updatedAt || b.date).getTime()
      else if (sortKey === 'views') cmp = (a.viewCount || 0) - (b.viewCount || 0)
      else cmp = a.title.localeCompare(b.title)
      return sortDir === 'desc' ? -cmp : cmp
    })
    return result
  })()

  const usedCategories = Array.from(new Set(posts.map(p => p.category))).sort()

  // ── Tag Chips ──
  const parsedTags = formData.tags.split(',').map(t => t.trim()).filter(Boolean)

  // ── Loading state ──
  if (!isClient) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-saffron-500" />
      </div>
    )
  }

  // ── Login ──
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-dark-950 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-md"
        >
          <div className="bg-dark-300 border border-white/10 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-8">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-saffron-500 to-violet-500 flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-white mb-2">Admin Login</h1>
              <p className="text-gray-500 text-sm">Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Email</label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all"
                  placeholder="Enter your email"
                  autoFocus
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
                <input
                  type="password"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:ring-1 focus:ring-saffron-500/20 focus:outline-none transition-all"
                  placeholder="Enter your password"
                />
              </div>

              {loginError && (
                <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl text-sm">
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full px-6 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-dark-950 rounded-xl hover:from-saffron-400 hover:to-saffron-500 transition-all font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Lock className="w-5 h-5" />
                {loginLoading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <Link href="/blog" className="text-sm text-gray-500 hover:text-saffron-400 transition-colors">
                Back to Blog
              </Link>
            </div>
          </div>
        </motion.div>
      </div>
    )
  }

  // ── Sidebar Nav Items ──
  const navItems = [
    { key: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'posts' as const, label: 'Posts', icon: FileText },
    { key: 'meetings' as const, label: 'Meetings', icon: Calendar },
    { key: 'calendar' as const, label: 'Calendar', icon: Eye },
  ]

  // ── Stat Cards ──
  const statCards = [
    { label: 'Total Posts', value: stats.total, icon: FileText, color: 'from-saffron-500/20 to-saffron-500/5', iconColor: 'text-saffron-400', borderColor: 'border-saffron-500/20' },
    { label: 'Published', value: stats.published, icon: CheckCircle2, color: 'from-emerald-500/20 to-emerald-500/5', iconColor: 'text-emerald-400', borderColor: 'border-emerald-500/20' },
    { label: 'Drafts', value: stats.drafts, icon: FileText, color: 'from-yellow-500/20 to-yellow-500/5', iconColor: 'text-yellow-400', borderColor: 'border-yellow-500/20' },
    { label: 'Total Views', value: stats.totalViews, icon: Eye, color: 'from-violet-500/20 to-violet-500/5', iconColor: 'text-violet-400', borderColor: 'border-violet-500/20' },
  ]

  return (
    <div className="min-h-screen bg-dark-950 flex">
      <ToastContainer toasts={toasts} onRemove={removeToast} />
      <AnimatePresence>
        {deleteTarget && (
          <DeleteModal
            postTitle={deleteTarget.title}
            onConfirm={handleDelete}
            onCancel={() => setDeleteTarget(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Sidebar ── */}
      <aside className="w-64 bg-dark-400 border-r border-white/5 flex flex-col fixed h-full z-40 max-lg:hidden">
        <div className="p-6 border-b border-white/5">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-saffron-500 to-violet-500 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="text-white font-bold text-lg leading-tight">Admin</h2>
              <p className="text-gray-600 text-xs">Blog Dashboard</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeView === item.key || (activeView === 'form' && item.key === 'posts')
            return (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-saffron-500/10 text-saffron-400 border border-saffron-500/20'
                    : 'text-gray-500 hover:text-white hover:bg-white/5 border border-transparent'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-4 border-t border-white/5 space-y-2">
          <button
            onClick={handleExportPosts}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <Download className="w-5 h-5" />
            Export Posts
          </button>
          <label className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all cursor-pointer">
            <Upload className="w-5 h-5" />
            Import Posts
            <input type="file" accept=".json" className="hidden" onChange={handleImportPosts} />
          </label>
          <Link
            href="/blog"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-gray-500 hover:text-white hover:bg-white/5 transition-all"
          >
            <Eye className="w-5 h-5" />
            View Blog
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-400 hover:text-red-300 hover:bg-red-500/5 transition-all"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </aside>

      {/* ── Mobile Top Bar ── */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-40 bg-dark-400 border-b border-white/5 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-saffron-500 to-violet-500 flex items-center justify-center">
            <BarChart3 className="w-4 h-4 text-white" />
          </div>
          <span className="text-white font-bold">Admin</span>
        </div>
        <div className="flex items-center gap-2">
          {navItems.map(item => {
            const Icon = item.icon
            const isActive = activeView === item.key || (activeView === 'form' && item.key === 'posts')
            return (
              <button
                key={item.key}
                onClick={() => setActiveView(item.key)}
                className={`p-2 rounded-lg transition-all ${isActive ? 'bg-saffron-500/10 text-saffron-400' : 'text-gray-500 hover:text-white'}`}
              >
                <Icon className="w-5 h-5" />
              </button>
            )
          })}
          <button onClick={handleLogout} className="p-2 rounded-lg text-red-400 hover:text-red-300">
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* ── Main Content ── */}
      <main className="flex-1 lg:ml-64 pt-16 lg:pt-0">
        <div className="p-6 lg:p-8 max-w-7xl mx-auto">

          {/* ═══ Dashboard View ═══ */}
          {activeView === 'dashboard' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Dashboard</h1>
                  <p className="text-gray-500">Overview of your blog</p>
                </div>
                <button onClick={openCreateForm} className="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-dark-950 rounded-xl hover:from-saffron-400 hover:to-saffron-500 transition-all font-semibold text-sm">
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map(card => {
                  const Icon = card.icon
                  return (
                    <div key={card.label} className={`bg-gradient-to-br ${card.color} border ${card.borderColor} rounded-2xl p-5`}>
                      <div className="flex items-center justify-between mb-3">
                        <Icon className={`w-5 h-5 ${card.iconColor}`} />
                      </div>
                      <p className="text-2xl lg:text-3xl font-bold text-white mb-1">{card.value}</p>
                      <p className="text-gray-500 text-sm">{card.label}</p>
                    </div>
                  )
                })}
              </div>

              {/* Recent Posts */}
              <div className="bg-dark-300 border border-white/5 rounded-2xl overflow-hidden">
                <div className="flex items-center justify-between p-5 border-b border-white/5">
                  <h2 className="text-lg font-semibold text-white">Recent Posts</h2>
                  <button onClick={() => setActiveView('posts')} className="text-sm text-saffron-400 hover:text-saffron-300 transition-colors">
                    View All
                  </button>
                </div>
                <div className="divide-y divide-white/5">
                  {posts.slice(0, 5).map(post => (
                    <div key={post.id} className="flex items-center justify-between p-5 hover:bg-white/[0.02] transition-colors">
                      <div className="flex-1 min-w-0 mr-4">
                        <h3 className="text-white font-medium truncate">{post.title}</h3>
                        <div className="flex items-center gap-3 mt-1.5">
                          <StatusBadge status={post.status || 'published'} />
                          <span className="text-xs text-gray-600">{post.category}</span>
                          <span className="text-xs text-gray-600 flex items-center gap-1"><Eye className="w-3 h-3" />{post.viewCount || 0}</span>
                        </div>
                      </div>
                      <button onClick={() => openEditForm(post)} className="p-2 rounded-lg text-gray-500 hover:text-saffron-400 hover:bg-saffron-500/10 transition-all">
                        <Edit className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                  {posts.length === 0 && (
                    <div className="p-12 text-center text-gray-600">
                      <FileText className="w-10 h-10 mx-auto mb-3 opacity-50" />
                      <p>No posts yet. Create your first one!</p>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          )}

          {/* ═══ Posts List View ═══ */}
          {activeView === 'posts' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Posts</h1>
                  <p className="text-gray-500">{filteredPosts.length} of {posts.length} posts</p>
                </div>
                <button onClick={openCreateForm} className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-saffron-500 to-saffron-600 text-dark-950 rounded-xl hover:from-saffron-400 hover:to-saffron-500 transition-all font-semibold text-sm">
                  <Plus className="w-4 h-4" />
                  New Post
                </button>
              </div>

              {/* Filters Bar */}
              <div className="bg-dark-300 border border-white/5 rounded-2xl p-4 mb-6">
                <div className="flex flex-col lg:flex-row gap-3">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search posts..."
                      className="w-full pl-10 pr-4 py-2.5 bg-dark-400 border border-white/10 rounded-xl text-white text-sm placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all"
                    />
                  </div>

                  {/* Status Filter */}
                  <div className="relative">
                    <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                    <select
                      value={statusFilter}
                      onChange={e => setStatusFilter(e.target.value as PostStatus | 'all')}
                      className="pl-10 pr-8 py-2.5 bg-dark-400 border border-white/10 rounded-xl text-white text-sm appearance-none cursor-pointer focus:border-saffron-500/50 focus:outline-none transition-all min-w-[140px]"
                    >
                      <option value="all">All Status</option>
                      <option value="published">Published</option>
                      <option value="draft">Draft</option>
                      <option value="scheduled">Scheduled</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* Category Filter */}
                  <div className="relative">
                    <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4" />
                    <select
                      value={categoryFilter}
                      onChange={e => setCategoryFilter(e.target.value)}
                      className="pl-10 pr-8 py-2.5 bg-dark-400 border border-white/10 rounded-xl text-white text-sm appearance-none cursor-pointer focus:border-saffron-500/50 focus:outline-none transition-all min-w-[180px]"
                    >
                      <option value="all">All Categories</option>
                      {usedCategories.map(c => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 w-4 h-4 pointer-events-none" />
                  </div>

                  {/* Sort */}
                  <button
                    onClick={() => {
                      if (sortKey === 'date') { setSortKey('views') }
                      else if (sortKey === 'views') { setSortKey('title') }
                      else { setSortKey('date') }
                    }}
                    className="flex items-center gap-2 px-4 py-2.5 bg-dark-400 border border-white/10 rounded-xl text-gray-400 text-sm hover:text-white transition-all"
                  >
                    <ArrowUpDown className="w-4 h-4" />
                    {sortKey === 'date' ? 'Date' : sortKey === 'views' ? 'Views' : 'Title'}
                  </button>

                  <button
                    onClick={() => setSortDir(d => d === 'asc' ? 'desc' : 'asc')}
                    className="px-3 py-2.5 bg-dark-400 border border-white/10 rounded-xl text-gray-400 text-sm hover:text-white transition-all"
                  >
                    {sortDir === 'desc' ? 'DESC' : 'ASC'}
                  </button>
                </div>
              </div>

              {/* Posts Table */}
              <div className="bg-dark-300 border border-white/5 rounded-2xl overflow-hidden">
                {/* Header (desktop) */}
                <div className="hidden lg:grid grid-cols-12 gap-4 px-5 py-3 bg-dark-400/50 border-b border-white/5 text-xs font-medium text-gray-500 uppercase tracking-wider">
                  <div className="col-span-5">Title</div>
                  <div className="col-span-2">Status</div>
                  <div className="col-span-2">Category</div>
                  <div className="col-span-1 text-center">Views</div>
                  <div className="col-span-2 text-right">Actions</div>
                </div>

                <div className="divide-y divide-white/5">
                  {filteredPosts.map(post => (
                    <div key={post.id} className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-4 items-center px-5 py-4 hover:bg-white/[0.02] transition-colors">
                      {/* Title & Date */}
                      <div className="lg:col-span-5 min-w-0">
                        <h3 className="text-white font-medium truncate">{post.title}</h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs text-gray-600 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            {new Date(post.updatedAt || post.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                          </span>
                          {post.featured && (
                            <span className="text-xs text-saffron-400 bg-saffron-500/10 px-1.5 py-0.5 rounded">Featured</span>
                          )}
                        </div>
                      </div>

                      {/* Status */}
                      <div className="lg:col-span-2">
                        <StatusBadge status={post.status || 'published'} />
                      </div>

                      {/* Category */}
                      <div className="lg:col-span-2">
                        <span className="text-sm text-gray-400">{post.category}</span>
                      </div>

                      {/* Views */}
                      <div className="lg:col-span-1 text-center">
                        <span className="text-sm text-gray-400 flex items-center justify-center gap-1">
                          <Eye className="w-3.5 h-3.5" />
                          {post.viewCount || 0}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="lg:col-span-2 flex items-center justify-end gap-2">
                        <Link
                          href={`/blog/${post.id}`}
                          target="_blank"
                          className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                          title="View"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => openEditForm(post)}
                          className="p-2 rounded-lg text-gray-500 hover:text-saffron-400 hover:bg-saffron-500/10 transition-all"
                          title="Edit"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(post)}
                          className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                          title="Delete"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>

                {filteredPosts.length === 0 && (
                  <div className="p-12 text-center text-gray-600">
                    <Search className="w-10 h-10 mx-auto mb-3 opacity-50" />
                    <p>No posts match your filters.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* ═══ Create / Edit Form ═══ */}
          {activeView === 'form' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">{editingPost ? 'Edit Post' : 'Create New Post'}</h1>
                  <p className="text-gray-500">{editingPost ? `Editing: ${editingPost.title}` : 'Write and publish a new blog post'}</p>
                </div>
                <button
                  onClick={() => { setActiveView('posts'); setEditingPost(null); setFormData(emptyForm) }}
                  className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition-all"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Title & Slug */}
                <div className="bg-dark-300 border border-white/5 rounded-2xl p-6 space-y-5">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <FileText className="w-5 h-5 text-saffron-400" />
                    Basic Info
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Title *</label>
                      <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all"
                        placeholder="Enter post title"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Slug</label>
                      <input
                        type="text"
                        name="slug"
                        value={formData.slug}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all font-mono text-sm"
                        placeholder="auto-generated-from-title"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Excerpt *</label>
                    <textarea
                      name="excerpt"
                      value={formData.excerpt}
                      onChange={handleInputChange}
                      required
                      rows={3}
                      className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all resize-none"
                      placeholder="Brief description of the post"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Content *</label>
                    <RichTextEditor
                      value={formData.content}
                      onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                      placeholder="Write your blog post content here..."
                    />
                  </div>
                </div>

                {/* Category, Tags, Meta */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="bg-dark-300 border border-white/5 rounded-2xl p-6 space-y-5">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      <Tag className="w-5 h-5 text-violet-400" />
                      Organization
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Category *</label>
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        required
                        className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white appearance-none cursor-pointer focus:border-saffron-500/50 focus:outline-none transition-all"
                      >
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Tags (comma-separated)</label>
                      <input
                        type="text"
                        name="tags"
                        value={formData.tags}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all"
                        placeholder="DDD, .NET, Architecture"
                      />
                      {parsedTags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-3">
                          {parsedTags.map((tag, i) => (
                            <span key={i} className="px-2.5 py-1 bg-violet-500/10 text-violet-400 text-xs rounded-full border border-violet-500/20">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Read Time</label>
                        <input
                          type="text"
                          name="readTime"
                          value={formData.readTime}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all"
                          placeholder="8 min read"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Author</label>
                        <input
                          type="text"
                          name="author"
                          value={formData.author}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all"
                          placeholder="Bhavya Duneja"
                        />
                      </div>
                    </div>

                    <label className="flex items-center gap-3 cursor-pointer group">
                      <div className="relative">
                        <input
                          type="checkbox"
                          name="featured"
                          checked={formData.featured}
                          onChange={handleInputChange}
                          className="sr-only peer"
                        />
                        <div className="w-10 h-6 bg-dark-400 border border-white/10 rounded-full peer-checked:bg-saffron-500/20 peer-checked:border-saffron-500/40 transition-all" />
                        <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-gray-600 rounded-full peer-checked:translate-x-4 peer-checked:bg-saffron-400 transition-all" />
                      </div>
                      <span className="text-sm font-medium text-gray-400 group-hover:text-white transition-colors">Featured Post</span>
                    </label>
                  </div>

                  {/* Publishing Settings */}
                  <div className="bg-dark-300 border border-white/5 rounded-2xl p-6 space-y-5">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Publishing
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">Status</label>
                      <div className="grid grid-cols-3 gap-2">
                        {(['draft', 'published', 'scheduled'] as PostStatus[]).map(s => (
                          <button
                            key={s}
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, status: s }))}
                            className={`px-3 py-2.5 rounded-xl text-sm font-medium border transition-all capitalize ${
                              formData.status === s
                                ? s === 'published' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                                : s === 'draft' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400'
                                : 'bg-blue-500/10 border-blue-500/30 text-blue-400'
                                : 'bg-dark-400 border-white/10 text-gray-500 hover:text-white hover:border-white/20'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>

                    {formData.status === 'scheduled' && (
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-2">Scheduled Date</label>
                        <input
                          type="datetime-local"
                          name="scheduledDate"
                          value={formData.scheduledDate}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white focus:border-saffron-500/50 focus:outline-none transition-all [color-scheme:dark]"
                        />
                      </div>
                    )}

                    {/* SEO Section */}
                    <div className="pt-4 border-t border-white/5">
                      <h4 className="text-sm font-semibold text-gray-300 mb-4 uppercase tracking-wider">SEO</h4>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-400">Meta Title</label>
                            <span className={`text-xs ${(formData.metaTitle?.length || 0) > 60 ? 'text-red-400' : 'text-gray-600'}`}>
                              {formData.metaTitle?.length || 0}/60
                            </span>
                          </div>
                          <input
                            type="text"
                            name="metaTitle"
                            value={formData.metaTitle}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all text-sm"
                            placeholder="SEO title (defaults to post title)"
                          />
                        </div>
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <label className="text-sm font-medium text-gray-400">Meta Description</label>
                            <span className={`text-xs ${(formData.metaDescription?.length || 0) > 160 ? 'text-red-400' : 'text-gray-600'}`}>
                              {formData.metaDescription?.length || 0}/160
                            </span>
                          </div>
                          <textarea
                            name="metaDescription"
                            value={formData.metaDescription}
                            onChange={handleInputChange}
                            rows={3}
                            className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all resize-none text-sm"
                            placeholder="SEO description (defaults to excerpt)"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Media */}
                <div className="bg-dark-300 border border-white/5 rounded-2xl p-6 space-y-5">
                  <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-saffron-400" />
                    Media
                  </h3>

                  <div className="grid md:grid-cols-2 gap-5">
                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-400">Cover Image</label>

                      {/* Upload Zone */}
                      <div
                        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all ${
                          uploading
                            ? 'border-saffron-500/50 bg-saffron-500/5'
                            : 'border-white/10 hover:border-saffron-500/30 hover:bg-white/[0.02]'
                        }`}
                        onDragOver={(e) => { e.preventDefault(); e.stopPropagation() }}
                        onDrop={(e) => {
                          e.preventDefault(); e.stopPropagation()
                          const file = e.dataTransfer.files[0]
                          if (file && file.type.startsWith('image/')) handleImageUpload(file)
                        }}
                        onClick={() => document.getElementById('image-upload-input')?.click()}
                      >
                        <input
                          id="image-upload-input"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) handleImageUpload(file)
                            e.target.value = ''
                          }}
                        />
                        {uploading ? (
                          <div className="flex flex-col items-center gap-2">
                            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-saffron-500" />
                            <span className="text-sm text-saffron-400">Uploading...</span>
                          </div>
                        ) : (
                          <div className="flex flex-col items-center gap-2">
                            <Upload className="w-8 h-8 text-gray-600" />
                            <span className="text-sm text-gray-500">Drag & drop or click to upload</span>
                            <span className="text-xs text-gray-600">JPG, PNG, WebP, GIF (max 5MB)</span>
                          </div>
                        )}
                      </div>

                      {/* Or paste URL */}
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-px bg-white/10" />
                        <span className="text-xs text-gray-600">or paste URL</span>
                        <div className="flex-1 h-px bg-white/10" />
                      </div>
                      <input
                        type="text"
                        name="imageUrl"
                        value={formData.imageUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all text-sm"
                        placeholder="https://... or /uploads/image.png"
                      />
                      {formData.imageUrl && (
                        <div className="rounded-xl overflow-hidden border border-white/10 relative group">
                          <img
                            src={getGoogleDriveImageUrl(formData.imageUrl)}
                            alt="Preview"
                            className="w-full h-40 object-cover"
                            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none' }}
                          />
                          <button
                            type="button"
                            onClick={() => setFormData(prev => ({ ...prev, imageUrl: '' }))}
                            className="absolute top-2 right-2 w-7 h-7 rounded-full bg-red-500/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                      {formData.imageUrl && (
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">Image Alt Text</label>
                          <input
                            type="text"
                            name="imageAlt"
                            value={formData.imageAlt}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all text-sm"
                            placeholder="Describe the image for SEO"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-3">
                      <label className="block text-sm font-medium text-gray-400">Video URL (YouTube)</label>
                      <input
                        type="url"
                        name="videoUrl"
                        value={formData.videoUrl}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 bg-dark-400 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:border-saffron-500/50 focus:outline-none transition-all text-sm"
                        placeholder="https://www.youtube.com/watch?v=..."
                      />
                      {formData.videoUrl && (
                        <div className="rounded-xl overflow-hidden border border-white/10">
                          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                            <iframe
                              src={getYouTubeEmbedUrl(formData.videoUrl)}
                              className="absolute top-0 left-0 w-full h-full"
                              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                              allowFullScreen
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Submit */}
                <div className="flex items-center justify-between bg-dark-300 border border-white/5 rounded-2xl p-6">
                  <button
                    type="button"
                    onClick={() => { setActiveView('posts'); setEditingPost(null); setFormData(emptyForm) }}
                    className="px-6 py-3 rounded-xl bg-white/5 border border-white/10 text-gray-300 hover:bg-white/10 transition-all font-medium"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-8 py-3 bg-gradient-to-r from-saffron-500 to-saffron-600 text-dark-950 rounded-xl hover:from-saffron-400 hover:to-saffron-500 transition-all font-semibold flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {editingPost ? 'Update Post' : 'Create Post'}
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* ═══ Meetings View ═══ */}
          {activeView === 'meetings' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Meetings</h1>
                  <p className="text-gray-500">Consultations booked via Sutra chatbot</p>
                </div>
                <button onClick={loadMeetings} className="px-4 py-2 rounded-xl bg-dark-400/50 border border-dark-300/50 text-gray-400 hover:text-white hover:border-saffron-500/30 transition-all text-sm">
                  Refresh
                </button>
              </div>

              {meetingsLoading ? (
                <div className="text-center py-20 text-gray-500">Loading meetings...</div>
              ) : meetings.length === 0 ? (
                <div className="text-center py-20">
                  <Calendar className="w-16 h-16 mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-500 text-lg">No meetings booked yet</p>
                  <p className="text-gray-600 text-sm mt-2">When visitors book via Sutra, meetings will appear here</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {meetings.map((m: any) => {
                    const isUpcoming = new Date(m.meeting_date) >= new Date(new Date().toDateString())
                    return (
                      <div key={m.id} className={`rounded-xl border p-5 transition-all ${
                        isUpcoming
                          ? 'bg-dark-400/30 border-saffron-500/20 hover:border-saffron-500/40'
                          : 'bg-dark-400/10 border-dark-300/30 opacity-60'
                      }`}>
                        <div className="flex items-start justify-between gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="text-white font-semibold text-lg">{m.name}</h3>
                              <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                                m.status === 'scheduled' ? 'bg-saffron-500/15 text-saffron-400 border border-saffron-500/20' :
                                m.status === 'completed' ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/20' :
                                m.status === 'rescheduled' ? 'bg-blue-500/15 text-blue-400 border border-blue-500/20' :
                                m.status === 'cancelled' ? 'bg-red-500/15 text-red-400 border border-red-500/20' :
                                'bg-gray-500/15 text-gray-400 border border-gray-500/20'
                              }`}>
                                {m.status}
                              </span>
                              {isUpcoming && m.status === 'scheduled' && (
                                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 animate-pulse">
                                  Upcoming
                                </span>
                              )}
                            </div>
                            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-400">
                              <span className="flex items-center gap-1.5">
                                <Calendar className="w-3.5 h-3.5 text-saffron-500" />
                                {m.meeting_date}
                              </span>
                              <span className="flex items-center gap-1.5">
                                <Clock className="w-3.5 h-3.5 text-violet-500" />
                                {m.meeting_time} ({m.timezone})
                              </span>
                              <a href={`mailto:${m.email}`} className="text-saffron-400 hover:text-saffron-300 transition-colors">
                                {m.email}
                              </a>
                              {m.phone && (
                                <a href={`tel:${m.phone}`} className="text-emerald-400 hover:text-emerald-300 transition-colors">
                                  {m.phone}
                                </a>
                              )}
                            </div>
                            {m.service_interest && m.service_interest !== 'General' && (
                              <div className="mt-2">
                                <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-400 border border-violet-500/20">
                                  {m.service_interest}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              onClick={() => {
                                setExpandedMeeting(expandedMeeting === m.id ? null : m.id)
                                if (!meetingNotes[m.id] && m.notes) setMeetingNotes(prev => ({ ...prev, [m.id]: m.notes }))
                              }}
                              className="px-3 py-1.5 rounded-lg bg-violet-500/10 text-violet-400 border border-violet-500/20 hover:bg-violet-500/20 transition-all text-xs font-medium"
                            >
                              {expandedMeeting === m.id ? 'Close' : 'Notes'}
                            </button>
                            <a
                              href="https://meet.google.com/riu-uofk-tsi"
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-3 py-1.5 rounded-lg bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 hover:bg-saffron-500/20 transition-all text-xs font-medium"
                            >
                              Join Meet
                            </a>
                          </div>
                        </div>

                        {/* Expanded Notes Section */}
                        {expandedMeeting === m.id && (
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            className="mt-4 pt-4 border-t border-dark-300/30"
                          >
                            <div className="flex flex-wrap items-center gap-2 mb-3">
                              <span className="text-xs text-gray-500 font-medium">Status:</span>
                              {['scheduled', 'completed', 'rescheduled', 'cancelled', 'no-show'].map(s => (
                                <button
                                  key={s}
                                  onClick={() => updateMeetingStatus(m.id, s)}
                                  className={`text-[10px] px-2 py-0.5 rounded-full transition-all ${
                                    m.status === s
                                      ? s === 'scheduled' ? 'bg-saffron-500/20 text-saffron-400 border border-saffron-500/30'
                                        : s === 'completed' ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                        : s === 'rescheduled' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                                        : s === 'cancelled' ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                                        : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                      : 'bg-dark-400/30 text-gray-600 border border-dark-300/30 hover:text-gray-400'
                                  }`}
                                >
                                  {s}
                                </button>
                              ))}
                            </div>
                            {/* Reschedule picker */}
                            {showReschedule === m.id && (
                              <div className="flex flex-wrap items-center gap-3 mb-3 p-3 rounded-xl bg-blue-500/5 border border-blue-500/15">
                                <span className="text-xs text-blue-400 font-medium">New date & time:</span>
                                <input
                                  type="date"
                                  value={rescheduleData[m.id]?.date || ''}
                                  onChange={(e) => setRescheduleData(prev => ({ ...prev, [m.id]: { ...prev[m.id], date: e.target.value } }))}
                                  className="bg-dark-400/30 border border-dark-300/30 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500/40"
                                />
                                <input
                                  type="time"
                                  value={rescheduleData[m.id]?.time || ''}
                                  onChange={(e) => setRescheduleData(prev => ({ ...prev, [m.id]: { ...prev[m.id], time: e.target.value } }))}
                                  className="bg-dark-400/30 border border-dark-300/30 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-blue-500/40"
                                />
                                <button
                                  onClick={() => confirmReschedule(m.id)}
                                  className="px-3 py-1.5 rounded-lg bg-blue-500/15 text-blue-400 border border-blue-500/25 hover:bg-blue-500/25 transition-all text-xs font-medium"
                                >
                                  Confirm Reschedule
                                </button>
                                <button
                                  onClick={() => setShowReschedule(null)}
                                  className="text-gray-500 hover:text-gray-400 text-xs"
                                >
                                  Cancel
                                </button>
                              </div>
                            )}
                            <textarea
                              value={meetingNotes[m.id] ?? m.notes ?? ''}
                              onChange={(e) => setMeetingNotes(prev => ({ ...prev, [m.id]: e.target.value }))}
                              placeholder="Add notes about this meeting... (discussion points, requirements, follow-ups)"
                              className="w-full bg-dark-400/20 border border-dark-300/30 rounded-xl p-3 text-sm text-gray-300 placeholder-gray-600 outline-none focus:border-saffron-500/30 resize-y min-h-[100px]"
                              rows={4}
                            />
                            <div className="flex items-center justify-between mt-3">
                              <span className="text-[11px] text-gray-600">
                                {m.notes ? 'Last saved' : 'No notes yet'}
                              </span>
                              <button
                                onClick={() => saveNotes(m.id)}
                                disabled={savingNotes === m.id}
                                className="px-4 py-1.5 rounded-lg bg-saffron-500/10 text-saffron-400 border border-saffron-500/20 hover:bg-saffron-500/20 transition-all text-xs font-medium disabled:opacity-50"
                              >
                                {savingNotes === m.id ? 'Saving...' : 'Save Notes'}
                              </button>
                            </div>

                            {/* Follow-up Meeting */}
                            <div className="mt-4 pt-4 border-t border-dark-300/20">
                              {showFollowUp !== m.id ? (
                                <button
                                  onClick={() => setShowFollowUp(m.id)}
                                  className="text-xs text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1.5"
                                >
                                  <Plus className="w-3.5 h-3.5" /> Schedule Follow-up Meeting
                                </button>
                              ) : (
                                <div className="p-3 rounded-xl bg-violet-500/5 border border-violet-500/15">
                                  <p className="text-xs text-violet-400 font-medium mb-3">Follow-up for {m.name}</p>
                                  <div className="flex flex-wrap gap-2 mb-3">
                                    {['Proposal Discussion', 'Budget & Pricing', 'Technical Deep-dive', 'Onboarding', 'Review & Feedback', 'Contract Signing'].map(a => (
                                      <button
                                        key={a}
                                        onClick={() => setFollowUpData(prev => ({ ...prev, [m.id]: { ...prev[m.id], agenda: a } }))}
                                        className={`text-[10px] px-2.5 py-1 rounded-full transition-all ${
                                          followUpData[m.id]?.agenda === a
                                            ? 'bg-violet-500/20 text-violet-300 border border-violet-500/30'
                                            : 'bg-dark-400/30 text-gray-500 border border-dark-300/30 hover:text-gray-400'
                                        }`}
                                      >
                                        {a}
                                      </button>
                                    ))}
                                  </div>
                                  {followUpData[m.id]?.agenda && (
                                    <div className="flex flex-wrap items-center gap-3">
                                      <input
                                        type="date"
                                        value={followUpData[m.id]?.date || ''}
                                        onChange={(e) => setFollowUpData(prev => ({ ...prev, [m.id]: { ...prev[m.id], date: e.target.value } }))}
                                        className="bg-dark-400/30 border border-dark-300/30 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500/40"
                                      />
                                      <input
                                        type="time"
                                        value={followUpData[m.id]?.time || ''}
                                        onChange={(e) => setFollowUpData(prev => ({ ...prev, [m.id]: { ...prev[m.id], time: e.target.value } }))}
                                        className="bg-dark-400/30 border border-dark-300/30 rounded-lg px-3 py-1.5 text-xs text-white outline-none focus:border-violet-500/40"
                                      />
                                      <button
                                        onClick={() => createFollowUp(m)}
                                        disabled={savingFollowUp}
                                        className="px-3 py-1.5 rounded-lg bg-violet-500/15 text-violet-400 border border-violet-500/25 hover:bg-violet-500/25 transition-all text-xs font-medium disabled:opacity-50"
                                      >
                                        {savingFollowUp ? 'Creating...' : 'Create & Send Invite'}
                                      </button>
                                      <button onClick={() => setShowFollowUp(null)} className="text-gray-500 hover:text-gray-400 text-xs">Cancel</button>
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          </motion.div>
                        )}

                        <div className="mt-3 text-[11px] text-gray-600">
                          Booked: {new Date(m.created_at).toLocaleString()}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ Calendar View ═══ */}
          {activeView === 'calendar' && (() => {
            const year = calendarMonth.getFullYear()
            const month = calendarMonth.getMonth()
            const firstDay = new Date(year, month, 1).getDay()
            const daysInMonth = new Date(year, month + 1, 0).getDate()
            const todayStr = new Date().toISOString().split('T')[0]
            const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

            const getMeetingsForDate = (day: number) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              return meetings.filter(m => m.meeting_date === dateStr)
            }

            const statusColors: Record<string, string> = {
              scheduled: 'bg-saffron-500',
              completed: 'bg-emerald-500',
              rescheduled: 'bg-blue-500',
              cancelled: 'bg-red-500',
              'no-show': 'bg-gray-500',
            }

            return (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h1 className="text-3xl font-bold text-white mb-1">Calendar</h1>
                    <p className="text-gray-500">Monthly meeting overview</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setCalendarMonth(new Date(year, month - 1))}
                      className="w-9 h-9 rounded-lg bg-dark-400/50 border border-dark-300/50 text-gray-400 hover:text-white hover:border-saffron-500/30 transition-all flex items-center justify-center"
                    >
                      &lt;
                    </button>
                    <span className="text-white font-semibold min-w-[160px] text-center">
                      {monthNames[month]} {year}
                    </span>
                    <button
                      onClick={() => setCalendarMonth(new Date(year, month + 1))}
                      className="w-9 h-9 rounded-lg bg-dark-400/50 border border-dark-300/50 text-gray-400 hover:text-white hover:border-saffron-500/30 transition-all flex items-center justify-center"
                    >
                      &gt;
                    </button>
                    <button
                      onClick={() => setCalendarMonth(new Date())}
                      className="px-3 py-1.5 rounded-lg bg-dark-400/50 border border-dark-300/50 text-gray-400 hover:text-white hover:border-saffron-500/30 transition-all text-xs"
                    >
                      Today
                    </button>
                  </div>
                </div>

                {/* Day headers */}
                <div className="grid grid-cols-7 gap-1 mb-1">
                  {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center text-xs text-gray-500 font-medium py-2">{d}</div>
                  ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-1">
                  {/* Empty cells before first day */}
                  {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="min-h-[100px] rounded-lg bg-dark-400/10 border border-dark-300/10" />
                  ))}

                  {/* Day cells */}
                  {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1
                    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
                    const isToday = dateStr === todayStr
                    const dayMeetings = getMeetingsForDate(day)
                    const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6

                    return (
                      <div
                        key={day}
                        className={`min-h-[100px] rounded-lg border p-1.5 transition-all ${
                          isToday
                            ? 'bg-saffron-500/5 border-saffron-500/30'
                            : dayMeetings.length > 0
                            ? 'bg-dark-400/20 border-dark-300/30 hover:border-saffron-500/20'
                            : isWeekend
                            ? 'bg-dark-400/5 border-dark-300/10'
                            : 'bg-dark-400/10 border-dark-300/15'
                        }`}
                      >
                        <div className={`text-xs font-medium mb-1 ${
                          isToday ? 'text-saffron-400' : 'text-gray-500'
                        }`}>
                          {isToday ? (
                            <span className="bg-saffron-500 text-dark-950 rounded-full w-5 h-5 inline-flex items-center justify-center text-[10px] font-bold">{day}</span>
                          ) : day}
                        </div>
                        <div className="space-y-0.5">
                          {dayMeetings.slice(0, 3).map((m: any) => (
                            <div
                              key={m.id}
                              className="rounded px-1 py-0.5 text-[9px] leading-tight truncate cursor-default group relative"
                              style={{ background: 'rgba(255,255,255,0.04)' }}
                              title={`${m.name} — ${m.meeting_time} — ${m.service_interest || 'General'}`}
                            >
                              <span className={`inline-block w-1.5 h-1.5 rounded-full mr-1 ${statusColors[m.status] || 'bg-gray-500'}`} />
                              <span className="text-gray-300">{m.meeting_time}</span>
                              <span className="text-gray-500 ml-1">{m.name.split(' ')[0]}</span>
                            </div>
                          ))}
                          {dayMeetings.length > 3 && (
                            <div className="text-[9px] text-gray-600 pl-1">+{dayMeetings.length - 3} more</div>
                          )}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 mt-6 justify-center">
                  {Object.entries({ scheduled: 'Scheduled', completed: 'Completed', rescheduled: 'Rescheduled', cancelled: 'Cancelled', 'no-show': 'No-show' }).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <span className={`w-2 h-2 rounded-full ${statusColors[k]}`} />
                      {v}
                    </div>
                  ))}
                </div>
              </motion.div>
            )
          })()}
        </div>
      </main>
    </div>
  )
}

export default AdminPanel
