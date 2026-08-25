'use client'

import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Plus, Edit, Trash2, Save, X, Lock, LogOut, Image as ImageIcon,
  Video, LayoutDashboard, FileText, Eye, BarChart3, Search,
  ChevronDown, Calendar, Clock, Tag, Filter, ArrowUpDown,
  CheckCircle2, AlertCircle, Timer, Upload, Download, Database,
  FolderOpen, ExternalLink, Link2, Users, UserPlus, Shield, KeyRound
} from 'lucide-react'
import Link from 'next/link'
import {
  getAllPosts, addPost, updatePost, deletePost,
  BlogPost, PostStatus, generateSlug, getPostStats,
  uploadImage
} from '@/lib/storage'
import { EVENTS_CALENDAR, EVENTS_TBA, EVENT_CATEGORY_META, EventCategory } from '@/lib/eventsCalendar'
import { DOCUMENTS, DOCUMENT_CATEGORIES } from '@/lib/documents'
import { getAllDocs, createDoc, updateDocById, deleteDocById, DocRecord } from '@/lib/documentsStore'
import { canTab, can, type AdminTab } from '@/lib/permissions'
import { getMyEvents, addUserEvent, deleteUserEvent, UserEvent } from '@/lib/userEvents'
import { getSeoDaily, SeoDaily } from '@/lib/seoStore'
import {
  isAuthenticated, loginUser, logoutUser, getAuthUser,
  getAllUsers, registerUser, updateUser, deleteUser, changePassword, type AuthUser
} from '@/lib/auth'
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
        <p className="text-gray-300 mb-6">
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
  const [activeView, setActiveView] = useState<'dashboard' | 'posts' | 'form' | 'meetings' | 'calendar' | 'documents' | 'seo' | 'users'>('dashboard')
  const [seoDaily, setSeoDaily] = useState<SeoDaily[]>([])
  const [seoLoading, setSeoLoading] = useState(false)
  const [expandedSeo, setExpandedSeo] = useState<string | null>(null)
  const [docLinks, setDocLinks] = useState<Record<string, string>>({})
  const [docSearch, setDocSearch] = useState('')
  const [editingDocLink, setEditingDocLink] = useState<string | null>(null)
  // In-app document editor (Supabase-backed, shared)
  const [savedDocs, setSavedDocs] = useState<DocRecord[]>([])
  const [docsLoading, setDocsLoading] = useState(false)
  const [docEditorOpen, setDocEditorOpen] = useState(false)
  const [editorDoc, setEditorDoc] = useState<{ id?: string; title: string; content: string; category: string }>({ title: '', content: '', category: 'General' })
  const [savingDoc, setSavingDoc] = useState(false)
  // Personal (private) calendar events
  const [myEvents, setMyEvents] = useState<UserEvent[]>([])
  const [showPersonalForm, setShowPersonalForm] = useState(false)
  const [personalForm, setPersonalForm] = useState({ event_date: '', title: '', note: '' })
  // User management
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(null)
  const [usersList, setUsersList] = useState<(AuthUser & { createdAt?: string })[]>([])
  const [usersLoading, setUsersLoading] = useState(false)
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'writer' })
  const [addingUser, setAddingUser] = useState(false)
  const [pwUserId, setPwUserId] = useState<string | null>(null)
  const [pwValue, setPwValue] = useState('')
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

  // load saved document links (Drive URLs the user pastes)
  useEffect(() => {
    try {
      const saved = localStorage.getItem('anantasutra_doc_links')
      if (saved) setDocLinks(JSON.parse(saved))
    } catch { /* ignore */ }
  }, [])

  // ── In-app documents ──
  const loadDocs = useCallback(async () => {
    setDocsLoading(true)
    try { setSavedDocs(await getAllDocs()) } catch { setSavedDocs([]) }
    setDocsLoading(false)
  }, [])

  useEffect(() => {
    if (activeView === 'documents') loadDocs()
  }, [activeView, loadDocs])

  // ── SEO / GEO daily log ──
  const loadSeo = useCallback(async () => {
    setSeoLoading(true)
    try { setSeoDaily(await getSeoDaily()) } catch { setSeoDaily([]) }
    setSeoLoading(false)
  }, [])

  useEffect(() => { if (activeView === 'seo') loadSeo() }, [activeView, loadSeo])

  // load current user's private calendar events
  const loadMyEvents = useCallback(async () => {
    if (!currentUser?.id) return
    try { setMyEvents(await getMyEvents(currentUser.id)) } catch { setMyEvents([]) }
  }, [currentUser?.id])

  useEffect(() => {
    if (activeView === 'calendar' && currentUser?.id) loadMyEvents()
  }, [activeView, currentUser?.id, loadMyEvents])

  const addMyPersonalEvent = async () => {
    if (!currentUser?.id) return
    if (!personalForm.event_date || !personalForm.title.trim()) { showToast('Pick a date and add a title', 'error'); return }
    const ok = await addUserEvent({ user_id: currentUser.id, title: personalForm.title.trim(), event_date: personalForm.event_date, note: personalForm.note.trim() })
    if (ok) { showToast('Personal event added'); setPersonalForm({ event_date: '', title: '', note: '' }); setShowPersonalForm(false); loadMyEvents() }
    else showToast('Failed — is the "user_events" table created in Supabase?', 'error')
  }

  const removeMyPersonalEvent = async (id: string, title: string) => {
    if (!window.confirm(`Delete your private event "${title}"?`)) return
    const ok = await deleteUserEvent(id)
    if (ok) { showToast('Removed'); loadMyEvents() } else showToast('Failed to remove', 'error')
  }

  const openNewDoc = () => { setEditorDoc({ title: '', content: '', category: 'General' }); setDocEditorOpen(true) }
  const openEditDoc = (d: DocRecord) => { setEditorDoc({ id: d.id, title: d.title, content: d.content, category: d.category }); setDocEditorOpen(true) }

  const saveDocument = async () => {
    if (!editorDoc.title.trim()) { showToast('Give the document a title', 'error'); return }
    setSavingDoc(true)
    let ok = false
    if (editorDoc.id) {
      ok = await updateDocById(editorDoc.id, { title: editorDoc.title.trim(), content: editorDoc.content, category: editorDoc.category.trim() || 'General' })
    } else {
      ok = !!(await createDoc({ title: editorDoc.title.trim(), content: editorDoc.content, category: editorDoc.category.trim() || 'General', author_name: currentUser?.name || 'Admin' }))
    }
    setSavingDoc(false)
    if (ok) { showToast(editorDoc.id ? 'Document updated' : 'Document created'); setDocEditorOpen(false); loadDocs() }
    else showToast('Save failed — is the "documents" table created in Supabase?', 'error')
  }

  const removeDocument = async (id: string, title: string) => {
    if (!window.confirm(`Delete "${title}"? This cannot be undone.`)) return
    const ok = await deleteDocById(id)
    if (ok) { showToast('Document deleted'); loadDocs() } else showToast('Delete failed', 'error')
  }

  const saveDocLink = (id: string, url: string) => {
    setDocLinks(prev => {
      const next = { ...prev }
      if (url.trim()) next[id] = url.trim(); else delete next[id]
      try { localStorage.setItem('anantasutra_doc_links', JSON.stringify(next)) } catch { /* ignore */ }
      return next
    })
  }

  // ── User management ──
  useEffect(() => { setCurrentUser(getAuthUser()) }, [])

  // Guard: bounce a user off any tab their role can't access
  useEffect(() => {
    if (currentUser && activeView !== 'form' && !canTab(currentUser.role, activeView as AdminTab)) {
      setActiveView('dashboard')
    }
  }, [currentUser, activeView])

  const loadUsers = useCallback(async () => {
    setUsersLoading(true)
    try { setUsersList((await getAllUsers()) as (AuthUser & { createdAt?: string })[]) } catch { setUsersList([]) }
    setUsersLoading(false)
  }, [])

  useEffect(() => {
    if (activeView === 'users' && usersList.length === 0) loadUsers()
  }, [activeView, usersList.length, loadUsers])

  const handleAddUser = async () => {
    if (!newUser.name.trim() || !newUser.email.trim() || !newUser.password) {
      showToast('Fill name, email and password', 'error'); return
    }
    if (newUser.password.length < 6) { showToast('Password must be at least 6 characters', 'error'); return }
    setAddingUser(true)
    const u = await registerUser(newUser.email.trim(), newUser.password, newUser.name.trim(), newUser.role)
    setAddingUser(false)
    if (u) { showToast('User added'); setNewUser({ name: '', email: '', password: '', role: 'writer' }); loadUsers() }
    else showToast('Failed to add user (email may already exist)', 'error')
  }

  const handleRoleChange = async (id: string, role: string) => {
    const ok = await updateUser(id, { role })
    if (ok) { showToast('Role updated'); loadUsers() } else showToast('Failed to update role', 'error')
  }

  const handleDeleteUser = async (id: string, email: string) => {
    if (id === currentUser?.id) { showToast("You can't delete your own account", 'error'); return }
    if (!window.confirm(`Delete user "${email}"? This cannot be undone.`)) return
    const ok = await deleteUser(id)
    if (ok) { showToast('User deleted'); loadUsers() } else showToast('Failed to delete user', 'error')
  }

  const handleChangePassword = async (id: string) => {
    if (pwValue.length < 6) { showToast('Password must be at least 6 characters', 'error'); return }
    const ok = await changePassword(id, pwValue)
    if (ok) { showToast('Password changed'); setPwUserId(null); setPwValue('') } else showToast('Failed to change password', 'error')
  }

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
        setCurrentUser(user)
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
              <p className="text-gray-400 text-sm">Enter your credentials to access the dashboard</p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
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
                <label className="block text-sm font-medium text-gray-300 mb-2">Password</label>
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
  const allNavItems = [
    { key: 'dashboard' as const, label: 'Dashboard', icon: LayoutDashboard },
    { key: 'posts' as const, label: 'Posts', icon: FileText },
    { key: 'meetings' as const, label: 'Meetings', icon: Calendar },
    { key: 'calendar' as const, label: 'Calendar', icon: Eye },
    { key: 'documents' as const, label: 'Documents', icon: FolderOpen },
    { key: 'seo' as const, label: 'SEO / GEO', icon: BarChart3 },
    { key: 'users' as const, label: 'Users', icon: Users },
  ]
  const navItems = allNavItems.filter(item => canTab(currentUser?.role as ('admin' | 'editor' | 'writer') | undefined, item.key))

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
                  <p className="text-gray-400">Overview of your blog</p>
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
                      <p className="text-gray-400 text-sm">{card.label}</p>
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
                  <p className="text-gray-400">{filteredPosts.length} of {posts.length} posts</p>
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
                        {can(currentUser?.role, 'posts.delete') && (
                          <button
                            onClick={() => setDeleteTarget(post)}
                            className="p-2 rounded-lg text-gray-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
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
                  <p className="text-gray-400">{editingPost ? `Editing: ${editingPost.title}` : 'Write and publish a new blog post'}</p>
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">Title *</label>
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">Slug</label>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Excerpt *</label>
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
                    <label className="block text-sm font-medium text-gray-300 mb-2">Content *</label>
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">Category *</label>
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
                      <label className="block text-sm font-medium text-gray-300 mb-2">Tags (comma-separated)</label>
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">Read Time</label>
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">Author</label>
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
                      <span className="text-sm font-medium text-gray-300 group-hover:text-white transition-colors">Featured Post</span>
                    </label>
                  </div>

                  {/* Publishing Settings */}
                  <div className="bg-dark-300 border border-white/5 rounded-2xl p-6 space-y-5">
                    <h3 className="text-white font-semibold text-lg flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      Publishing
                    </h3>

                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
                      <div className="grid grid-cols-3 gap-2">
                        {((can(currentUser?.role, 'posts.publish') ? ['draft', 'published', 'scheduled'] : ['draft']) as PostStatus[]).map(s => (
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
                        <label className="block text-sm font-medium text-gray-300 mb-2">Scheduled Date</label>
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
                            <label className="text-sm font-medium text-gray-300">Meta Title</label>
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
                            <label className="text-sm font-medium text-gray-300">Meta Description</label>
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
                      <label className="block text-sm font-medium text-gray-300">Cover Image</label>

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
                            <span className="text-sm text-gray-400">Drag & drop or click to upload</span>
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
                          <label className="block text-sm font-medium text-gray-300 mb-2">Image Alt Text</label>
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
                      <label className="block text-sm font-medium text-gray-300">Video URL (YouTube)</label>
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
                  <p className="text-gray-400">Consultations booked via Sutra chatbot</p>
                </div>
                <button onClick={loadMeetings} className="px-4 py-2 rounded-xl bg-dark-400/50 border border-dark-300/50 text-gray-400 hover:text-white hover:border-saffron-500/30 transition-all text-sm">
                  Refresh
                </button>
              </div>

              {meetingsLoading ? (
                <div className="text-center py-20 text-gray-400">Loading meetings...</div>
              ) : meetings.length === 0 ? (
                <div className="text-center py-20">
                  <Calendar className="w-16 h-16 mx-auto text-gray-700 mb-4" />
                  <p className="text-gray-400 text-lg">No meetings booked yet</p>
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

            const getEventsForDate = (day: number) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              return EVENTS_CALENDAR.filter(ev => ev.date === dateStr)
            }

            const getPersonalForDate = (day: number) => {
              const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
              return myEvents.filter(ev => ev.event_date === dateStr)
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
                    <p className="text-gray-400">Meetings + festivals, marketing, tech &amp; exhibition events</p>
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
                    <button
                      onClick={() => { setShowPersonalForm(v => !v); setPersonalForm(f => ({ ...f, event_date: f.event_date || new Date().toISOString().split('T')[0] })) }}
                      className="px-3 py-1.5 rounded-lg bg-saffron-500 text-dark-950 text-xs font-medium hover:bg-saffron-400 transition-all"
                    >
                      + Personal event
                    </button>
                  </div>
                </div>

                {showPersonalForm && (
                  <div className="mb-4 rounded-xl border border-saffron-500/25 bg-saffron-500/5 p-3 flex flex-wrap items-center gap-2">
                    <span className="text-xs text-gray-400 flex items-center gap-1">🔒 Private to you:</span>
                    <input type="date" value={personalForm.event_date} onChange={e => setPersonalForm({ ...personalForm, event_date: e.target.value })} className="px-2 py-1.5 rounded-lg bg-dark-400/60 border border-dark-300/50 text-xs text-white outline-none focus:border-saffron-500/40" />
                    <input value={personalForm.title} onChange={e => setPersonalForm({ ...personalForm, title: e.target.value })} placeholder="Title (e.g. Follow up Dr. Sharma)" className="flex-1 min-w-[180px] px-3 py-1.5 rounded-lg bg-dark-400/60 border border-dark-300/50 text-xs text-white placeholder-gray-500 outline-none focus:border-saffron-500/40" />
                    <input value={personalForm.note} onChange={e => setPersonalForm({ ...personalForm, note: e.target.value })} placeholder="Note (optional)" className="flex-1 min-w-[140px] px-3 py-1.5 rounded-lg bg-dark-400/60 border border-dark-300/50 text-xs text-white placeholder-gray-500 outline-none focus:border-saffron-500/40" />
                    <button onClick={addMyPersonalEvent} className="text-xs px-3 py-1.5 rounded-lg bg-saffron-500 text-dark-950 font-medium">Add</button>
                    <button onClick={() => setShowPersonalForm(false)} className="text-xs px-3 py-1.5 rounded-lg bg-dark-300/40 text-gray-400">Cancel</button>
                  </div>
                )}

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
                    const dayEvents = getEventsForDate(day)
                    const dayPersonal = getPersonalForDate(day)
                    const isWeekend = new Date(year, month, day).getDay() === 0 || new Date(year, month, day).getDay() === 6

                    return (
                      <div
                        key={day}
                        className={`min-h-[100px] rounded-lg border p-1.5 transition-all ${
                          isToday
                            ? 'bg-saffron-500/5 border-saffron-500/30'
                            : (dayMeetings.length > 0 || dayEvents.length > 0 || dayPersonal.length > 0)
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
                          {dayEvents.slice(0, 3).map((ev, idx) => {
                            const meta = EVENT_CATEGORY_META[ev.category]
                            return (
                              <div
                                key={`ev-${idx}`}
                                className="rounded px-1 py-0.5 text-[9px] leading-tight truncate cursor-default"
                                style={{ background: `${meta.color}1f` }}
                                title={`${ev.name} — ${meta.label}`}
                              >
                                <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle" style={{ background: meta.color }} />
                                <span className="text-gray-300">{ev.name}</span>
                              </div>
                            )
                          })}
                          {dayEvents.length > 3 && (
                            <div className="text-[9px] text-gray-600 pl-1">+{dayEvents.length - 3} event(s)</div>
                          )}
                          {dayPersonal.map((pe) => (
                            <div
                              key={pe.id}
                              onClick={() => removeMyPersonalEvent(pe.id, pe.title)}
                              title={`Private: ${pe.title}${pe.note ? ' — ' + pe.note : ''} (click to remove)`}
                              className="rounded px-1 py-0.5 text-[9px] leading-tight truncate cursor-pointer"
                              style={{ background: '#E8A31726' }}
                            >
                              <span className="inline-block w-1.5 h-1.5 rounded-full mr-1 align-middle bg-saffron-500" />
                              <span className="text-saffron-300">🔒 {pe.title}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>

                {/* Legend — meetings */}
                <div className="flex items-center gap-4 mt-6 justify-center flex-wrap">
                  {Object.entries({ scheduled: 'Scheduled', completed: 'Completed', rescheduled: 'Rescheduled', cancelled: 'Cancelled', 'no-show': 'No-show' }).map(([k, v]) => (
                    <div key={k} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <span className={`w-2 h-2 rounded-full ${statusColors[k]}`} />
                      {v}
                    </div>
                  ))}
                </div>

                {/* Legend — event categories */}
                <div className="flex items-center gap-4 mt-2 justify-center flex-wrap">
                  {(Object.keys(EVENT_CATEGORY_META) as EventCategory[]).map((k) => (
                    <div key={k} className="flex items-center gap-1.5 text-[10px] text-gray-500">
                      <span className="w-2 h-2 rounded-full" style={{ background: EVENT_CATEGORY_META[k].color }} />
                      {EVENT_CATEGORY_META[k].label}
                    </div>
                  ))}
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-500">
                    <span className="w-2 h-2 rounded-full bg-saffron-500" /> 🔒 My private event
                  </div>
                </div>

                {/* Approximate / TBA events (no fixed date yet) */}
                {EVENTS_TBA.length > 0 && (
                  <div className="mt-8 rounded-xl border border-dark-300/30 bg-dark-400/20 p-4">
                    <h3 className="text-sm font-semibold text-white mb-1">Approximate / TBA events</h3>
                    <p className="text-[11px] text-gray-500 mb-3">Recurring events whose exact 2027 date wasn&apos;t confirmed yet — verify nearer the time.</p>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                      {EVENTS_TBA.map((ev, idx) => {
                        const meta = EVENT_CATEGORY_META[ev.category]
                        return (
                          <div key={`tba-${idx}`} className="rounded-lg bg-dark-400/30 border border-dark-300/20 px-2.5 py-1.5" title={ev.note}>
                            <div className="flex items-center gap-1.5">
                              <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: meta.color }} />
                              <span className="text-[11px] text-gray-200 font-medium truncate">{ev.name}</span>
                            </div>
                            <div className="text-[10px] text-gray-500 pl-3">{ev.whenText}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </motion.div>
            )
          })()}

          {/* ═══ Documents View ═══ */}
          {activeView === 'documents' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">Documents</h1>
                  <p className="text-gray-400">All AnantaSutra documents in one place — legal, proposals, content, research &amp; more</p>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  <input
                    value={docSearch}
                    onChange={e => setDocSearch(e.target.value)}
                    placeholder="Search documents..."
                    className="pl-9 pr-3 py-2 rounded-lg bg-dark-400/50 border border-dark-300/50 text-sm text-white placeholder-gray-500 focus:border-saffron-500/40 outline-none w-64"
                  />
                </div>
              </div>

              {/* In-app documents — write & edit here, shared across your team (Supabase) */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                    <FileText className="w-4 h-4 text-saffron-500" /> Your Documents
                    <span className="text-gray-600 font-normal">({savedDocs.length})</span>
                  </h2>
                  <button onClick={openNewDoc} className="inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg bg-saffron-500 text-dark-950 font-medium hover:bg-saffron-400 transition-all">
                    <Plus className="w-3.5 h-3.5" /> New Document
                  </button>
                </div>
                {docsLoading ? (
                  <div className="text-xs text-gray-500 py-3">Loading…</div>
                ) : savedDocs.length === 0 ? (
                  <div className="text-xs text-gray-500 rounded-lg border border-dashed border-dark-300/40 py-5 text-center">No documents yet — click <span className="text-saffron-400">New Document</span> to write one.</div>
                ) : (
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-2">
                    {savedDocs.map(d => (
                      <div key={d.id} className="rounded-lg bg-dark-400/20 border border-dark-300/25 p-3">
                        <div className="text-sm text-white font-medium truncate">{d.title}</div>
                        <div className="text-[11px] text-gray-500 mb-2">{d.category} · updated {new Date(d.updated_at).toLocaleDateString()}{d.author_name ? ` · ${d.author_name}` : ''}</div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditDoc(d)} className="text-xs px-2 py-1 rounded bg-dark-300/40 text-gray-300 hover:text-white inline-flex items-center gap-1"><Edit className="w-3 h-3" /> Edit</button>
                          {can(currentUser?.role, 'docs.delete') && (
                            <button onClick={() => removeDocument(d.id, d.title)} className="text-xs px-2 py-1 rounded bg-red-500/10 text-red-400 border border-red-500/20 inline-flex items-center gap-1"><Trash2 className="w-3 h-3" /> Delete</button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mb-5 rounded-lg border border-saffron-500/20 bg-saffron-500/5 px-4 py-3 text-xs text-gray-400 flex items-start gap-2">
                <Lock className="w-4 h-4 text-saffron-500 shrink-0 mt-0.5" />
                <span>Below: your external document library. Sensitive files (legal contracts, leads, proposals) are not hosted on the website — paste each document&apos;s private Google Drive share link to open it from here.</span>
              </div>

              {DOCUMENT_CATEGORIES.map(cat => {
                const q = docSearch.toLowerCase()
                const docs = DOCUMENTS.filter(d => d.category === cat && (!q || `${d.name} ${d.category} ${d.source}`.toLowerCase().includes(q)))
                if (docs.length === 0) return null
                return (
                  <div key={cat} className="mb-6">
                    <h2 className="text-sm font-semibold text-saffron-400 uppercase tracking-wide mb-2">
                      {cat} <span className="text-gray-600 normal-case">({docs.length})</span>
                    </h2>
                    <div className="space-y-1.5">
                      {docs.map(d => {
                        const link = docLinks[d.id] || d.link || ''
                        return (
                          <div key={d.id} className="rounded-lg bg-dark-400/20 border border-dark-300/25 px-3 py-2.5">
                            <div className="flex items-center gap-3 flex-wrap">
                              <span className="text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-dark-300/60 text-gray-400 w-11 text-center shrink-0">{d.type}</span>
                              <div className="flex-1 min-w-[220px]">
                                <div className="text-sm text-white leading-snug">{d.name}</div>
                                <div className="text-[11px] text-gray-500">{d.source}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                {link ? (
                                  <a href={link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-saffron-500/10 border border-saffron-500/30 text-saffron-400 hover:bg-saffron-500/20 transition-all">
                                    <ExternalLink className="w-3.5 h-3.5" /> Open
                                  </a>
                                ) : (
                                  <span className="text-[11px] text-gray-600">no link yet</span>
                                )}
                                {can(currentUser?.role, 'docs.editLinks') && (
                                  <button
                                    onClick={() => setEditingDocLink(editingDocLink === d.id ? null : d.id)}
                                    className="inline-flex items-center gap-1 text-xs px-2 py-1.5 rounded-lg bg-dark-300/40 border border-dark-300/40 text-gray-400 hover:text-white transition-all"
                                  >
                                    <Link2 className="w-3.5 h-3.5" /> {link ? 'Edit' : 'Add link'}
                                  </button>
                                )}
                              </div>
                            </div>
                            {editingDocLink === d.id && (
                              <div className="flex items-center gap-2 mt-2">
                                <input
                                  id={`doclink-${d.id}`}
                                  defaultValue={docLinks[d.id] || ''}
                                  placeholder="Paste Google Drive share link..."
                                  onKeyDown={e => { if (e.key === 'Enter') { saveDocLink(d.id, (e.target as HTMLInputElement).value); setEditingDocLink(null) } }}
                                  className="flex-1 px-3 py-1.5 rounded-lg bg-dark-500/60 border border-dark-300/50 text-xs text-white placeholder-gray-600 outline-none focus:border-saffron-500/40"
                                />
                                <button
                                  onClick={() => { const el = document.getElementById(`doclink-${d.id}`) as HTMLInputElement; saveDocLink(d.id, el.value); setEditingDocLink(null) }}
                                  className="text-xs px-3 py-1.5 rounded-lg bg-saffron-500 text-dark-950 font-medium"
                                >
                                  Save
                                </button>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )
              })}

              {/* Document editor modal */}
              {docEditorOpen && (
                <div className="fixed inset-0 z-[60] bg-black/60 flex items-start justify-center p-4 overflow-y-auto" onClick={() => setDocEditorOpen(false)}>
                  <div className="bg-dark-500 rounded-xl border border-dark-300/40 w-full max-w-3xl mt-8 mb-8 p-5" onClick={e => e.stopPropagation()}>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-white">{editorDoc.id ? 'Edit Document' : 'New Document'}</h3>
                      <button onClick={() => setDocEditorOpen(false)} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                    <div className="flex gap-2 mb-3 flex-wrap">
                      <input value={editorDoc.title} onChange={e => setEditorDoc({ ...editorDoc, title: e.target.value })} placeholder="Document title" className="flex-1 min-w-[200px] px-3 py-2 rounded-lg bg-dark-400/60 border border-dark-300/50 text-sm text-white placeholder-gray-500 outline-none focus:border-saffron-500/40" />
                      <input value={editorDoc.category} onChange={e => setEditorDoc({ ...editorDoc, category: e.target.value })} placeholder="Category" className="w-40 px-3 py-2 rounded-lg bg-dark-400/60 border border-dark-300/50 text-sm text-white placeholder-gray-500 outline-none focus:border-saffron-500/40" />
                    </div>
                    <RichTextEditor value={editorDoc.content} onChange={v => setEditorDoc({ ...editorDoc, content: v })} placeholder="Write your document…" />
                    <div className="flex items-center justify-end gap-2 mt-4">
                      <button onClick={() => setDocEditorOpen(false)} className="text-sm px-4 py-2 rounded-lg bg-dark-300/40 text-gray-400 hover:text-white">Cancel</button>
                      <button onClick={saveDocument} disabled={savingDoc} className="text-sm px-4 py-2 rounded-lg bg-saffron-500 text-dark-950 font-medium disabled:opacity-50">{savingDoc ? 'Saving…' : (editorDoc.id ? 'Update' : 'Create')}</button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ SEO / AEO / GEO View ═══ */}
          {activeView === 'seo' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h1 className="text-3xl font-bold text-white mb-1">SEO / AEO / GEO</h1>
                  <p className="text-gray-400">Daily search + AI-answer-engine work — articles, audits, SERP watch &amp; GEO actions</p>
                </div>
                <button onClick={loadSeo} className="text-xs px-3 py-1.5 rounded-lg bg-dark-400/50 border border-dark-300/50 text-gray-400 hover:text-white">Refresh</button>
              </div>

              {seoLoading ? (
                <div className="text-center text-gray-500 py-10">Loading…</div>
              ) : seoDaily.length === 0 ? (
                <div className="rounded-xl border border-dashed border-dark-300/40 py-10 text-center text-gray-500 text-sm">
                  No SEO / GEO entries yet.
                  <div className="text-[12px] text-gray-600 mt-1">The daily pipeline pushes one summary here each morning (once the <code className="text-saffron-400">seo_daily</code> table exists in Supabase).</div>
                </div>
              ) : (
                <div className="space-y-2">
                  {seoDaily.map(s => {
                    const open = expandedSeo === s.id
                    return (
                      <div key={s.id} className="rounded-xl border border-dark-300/25 bg-dark-400/20 overflow-hidden">
                        <button onClick={() => setExpandedSeo(open ? null : s.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left">
                          <span className="text-xs font-mono text-saffron-400 shrink-0">{s.day}</span>
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white font-medium truncate">{s.article_title || s.target || 'Daily SEO / GEO'}</div>
                            {s.target && <div className="text-[11px] text-gray-500 truncate">Target: {s.target}</div>}
                          </div>
                          <div className="flex items-center gap-1 shrink-0">
                            {s.audit_text && <span className="text-[9px] px-1.5 py-0.5 rounded bg-blue-500/15 text-blue-300">Audit</span>}
                            {s.serp_text && <span className="text-[9px] px-1.5 py-0.5 rounded bg-violet-500/15 text-violet-300">SERP</span>}
                            {s.geo_text && <span className="text-[9px] px-1.5 py-0.5 rounded bg-pink-500/15 text-pink-300">GEO</span>}
                            <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`} />
                          </div>
                        </button>
                        {open && (
                          <div className="px-4 pb-4 space-y-4 border-t border-dark-300/20 pt-3">
                            {s.article_content && (
                              <div>
                                <h4 className="text-xs font-semibold text-saffron-400 uppercase mb-1">Article</h4>
                                {s.meta_description && <p className="text-[11px] text-gray-500 mb-1 italic">Meta: {s.meta_description}</p>}
                                <div className="text-sm text-gray-300 whitespace-pre-wrap max-h-72 overflow-y-auto rounded-lg bg-dark-500/40 p-3">{s.article_content}</div>
                                {s.article_link && <a href={s.article_link} target="_blank" rel="noopener noreferrer" className="text-xs text-saffron-400 inline-flex items-center gap-1 mt-1"><ExternalLink className="w-3 h-3" /> Open in Drive</a>}
                              </div>
                            )}
                            {s.audit_text && <div><h4 className="text-xs font-semibold text-blue-400 uppercase mb-1">On-page Audit</h4><div className="text-sm text-gray-300 whitespace-pre-wrap max-h-56 overflow-y-auto rounded-lg bg-dark-500/40 p-3">{s.audit_text}</div></div>}
                            {s.serp_text && <div><h4 className="text-xs font-semibold text-violet-400 uppercase mb-1">SERP / Competitor Watch</h4><div className="text-sm text-gray-300 whitespace-pre-wrap max-h-56 overflow-y-auto rounded-lg bg-dark-500/40 p-3">{s.serp_text}</div></div>}
                            {s.geo_text && <div><h4 className="text-xs font-semibold text-pink-400 uppercase mb-1">GEO / AI-Answer Actions</h4><div className="text-sm text-gray-300 whitespace-pre-wrap max-h-56 overflow-y-auto rounded-lg bg-dark-500/40 p-3">{s.geo_text}</div></div>}
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}

          {/* ═══ Users View (admin only) ═══ */}
          {activeView === 'users' && currentUser?.role === 'admin' && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <div className="mb-6">
                <h1 className="text-3xl font-bold text-white mb-1">Users</h1>
                <p className="text-gray-400">Manage who can access the admin panel and their roles</p>
              </div>

              {/* Add user */}
              <div className="rounded-xl border border-dark-300/30 bg-dark-400/20 p-4 mb-6">
                <h2 className="text-sm font-semibold text-white mb-3 flex items-center gap-2"><UserPlus className="w-4 h-4 text-saffron-500" /> Add a new user</h2>
                <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  <input value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} placeholder="Full name" className="px-3 py-2 rounded-lg bg-dark-500/60 border border-dark-300/50 text-sm text-white placeholder-gray-500 outline-none focus:border-saffron-500/40" />
                  <input value={newUser.email} onChange={e => setNewUser({ ...newUser, email: e.target.value })} placeholder="Email" type="email" className="px-3 py-2 rounded-lg bg-dark-500/60 border border-dark-300/50 text-sm text-white placeholder-gray-500 outline-none focus:border-saffron-500/40" />
                  <input value={newUser.password} onChange={e => setNewUser({ ...newUser, password: e.target.value })} placeholder="Password (min 6)" type="password" className="px-3 py-2 rounded-lg bg-dark-500/60 border border-dark-300/50 text-sm text-white placeholder-gray-500 outline-none focus:border-saffron-500/40" />
                  <div className="flex gap-2">
                    <select value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })} className="flex-1 px-3 py-2 rounded-lg bg-dark-500/60 border border-dark-300/50 text-sm text-white outline-none focus:border-saffron-500/40">
                      <option value="admin">Admin</option>
                      <option value="editor">Editor</option>
                      <option value="writer">Writer</option>
                    </select>
                    <button onClick={handleAddUser} disabled={addingUser} className="px-4 py-2 rounded-lg bg-saffron-500 text-dark-950 text-sm font-medium disabled:opacity-50">{addingUser ? '…' : 'Add'}</button>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 mt-2 flex items-center gap-1"><Shield className="w-3 h-3" /> <b className="text-gray-400">Admin</b>: full access incl. user management · <b className="text-gray-400">Editor</b>: manage content · <b className="text-gray-400">Writer</b>: create posts.</p>
              </div>

              {/* Users list */}
              {usersLoading ? (
                <div className="text-center text-gray-500 py-10">Loading users…</div>
              ) : usersList.length === 0 ? (
                <div className="text-center text-gray-500 py-10">No users found.</div>
              ) : (
                <div className="space-y-2">
                  {usersList.map(u => {
                    const roleColor = u.role === 'admin'
                      ? 'text-red-400 border-red-500/30'
                      : u.role === 'editor'
                      ? 'text-blue-400 border-blue-500/30'
                      : 'text-emerald-400 border-emerald-500/30'
                    const isMe = u.id === currentUser?.id
                    return (
                      <div key={u.id} className="rounded-xl border border-dark-300/25 bg-dark-400/20 px-4 py-3">
                        <div className="flex items-center gap-3 flex-wrap">
                          <div className="w-9 h-9 rounded-full bg-saffron-500/15 border border-saffron-500/30 flex items-center justify-center text-saffron-400 font-semibold text-sm shrink-0">{(u.name || u.email || '?')[0]?.toUpperCase()}</div>
                          <div className="flex-1 min-w-[180px]">
                            <div className="text-sm text-white font-medium flex items-center gap-2">{u.name || '—'} {isMe && <span className="text-[10px] text-saffron-400 border border-saffron-500/30 rounded px-1.5 py-0.5">You</span>}</div>
                            <div className="text-[12px] text-gray-500">{u.email}</div>
                          </div>
                          <select value={u.role} onChange={e => handleRoleChange(u.id, e.target.value)} disabled={isMe} title={isMe ? "You can't change your own role" : ''} className={`text-xs px-2 py-1 rounded-lg border bg-transparent outline-none disabled:opacity-60 ${roleColor}`}>
                            <option value="admin" className="bg-dark-500">Admin</option>
                            <option value="editor" className="bg-dark-500">Editor</option>
                            <option value="writer" className="bg-dark-500">Writer</option>
                          </select>
                          <button onClick={() => { setPwUserId(pwUserId === u.id ? null : u.id); setPwValue('') }} className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-dark-300/40 border border-dark-300/40 text-gray-400 hover:text-white transition-all"><KeyRound className="w-3.5 h-3.5" /> Password</button>
                          <button onClick={() => handleDeleteUser(u.id, u.email)} disabled={isMe} className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 transition-all disabled:opacity-40"><Trash2 className="w-3.5 h-3.5" /> Delete</button>
                        </div>
                        {pwUserId === u.id && (
                          <div className="flex items-center gap-2 mt-3">
                            <input value={pwValue} onChange={e => setPwValue(e.target.value)} placeholder="New password (min 6)" type="password" className="flex-1 px-3 py-1.5 rounded-lg bg-dark-500/60 border border-dark-300/50 text-xs text-white placeholder-gray-600 outline-none focus:border-saffron-500/40" />
                            <button onClick={() => handleChangePassword(u.id)} className="text-xs px-3 py-1.5 rounded-lg bg-saffron-500 text-dark-950 font-medium">Set password</button>
                            <button onClick={() => { setPwUserId(null); setPwValue('') }} className="text-xs px-3 py-1.5 rounded-lg bg-dark-300/40 text-gray-400">Cancel</button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              )}
            </motion.div>
          )}
        </div>
      </main>
    </div>
  )
}

export default AdminPanel
