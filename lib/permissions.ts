// Role-based access control for the admin panel.
// Two layers: which TABS a role can open, and which ACTIONS a role can perform.
// NOTE: this gates the UI. For hard security, mirror these checks in the API routes too.

export type Role = 'admin' | 'editor' | 'writer'

export type AdminTab = 'dashboard' | 'posts' | 'meetings' | 'calendar' | 'documents' | 'seo' | 'users'

// Tabs each role may open
const TAB_ACCESS: Record<Role, AdminTab[]> = {
  admin: ['dashboard', 'posts', 'meetings', 'calendar', 'documents', 'seo', 'users'],
  editor: ['dashboard', 'posts', 'meetings', 'calendar', 'documents', 'seo'],
  writer: ['dashboard', 'posts', 'calendar', 'documents'],
}

// Named actions gated beyond simple viewing
// posts.delete, posts.publish, docs.delete, docs.editLinks, meetings.manage, users.manage
const ACTIONS: Record<Role, string[]> = {
  admin: ['*'],
  editor: ['posts.delete', 'posts.publish', 'docs.delete', 'docs.editLinks', 'meetings.manage'],
  writer: [], // writers can create/edit posts & documents, but no delete/publish/links/meetings
}

export const canTab = (role: Role | undefined | null, tab: AdminTab): boolean => {
  if (!role) return false
  return TAB_ACCESS[role]?.includes(tab) ?? false
}

export const can = (role: Role | undefined | null, action: string): boolean => {
  if (!role) return false
  const list = ACTIONS[role] || []
  return list.includes('*') || list.includes(action)
}

export const ROLE_LABEL: Record<Role, string> = {
  admin: 'Admin', editor: 'Editor', writer: 'Writer',
}
