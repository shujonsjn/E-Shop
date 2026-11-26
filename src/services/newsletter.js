import { supabase } from '../lib/supabase'

// Footer newsletter signup. Rows live in public.newsletter_subscribers (see
// supabase/newsletter.sql). Guests may only insert; the admin panel reads and
// deletes the list with its authenticated session.
//
// If the SQL has not been run yet the insert fails and the caller shows an
// honest error instead of pretending the address was saved.

const warn = (what, error) => {
  if (error) console.warn(`[supabase] ${what}: ${error.message}`)
}

const TABLE = 'newsletter_subscribers'

export const subscribeNewsletter = async (email, source = 'footer') => {
  const normalized = String(email || '').trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)) {
    return { ok: false, reason: 'invalid' }
  }
  if (!supabase) return { ok: false, reason: 'offline' }
  const { error } = await supabase.from(TABLE).insert({ email: normalized, source })
  if (!error) return { ok: true }
  // 23505 = duplicate key (the same address already subscribed)
  if (error.code === '23505') return { ok: true, already: true }
  warn('subscribe newsletter', error)
  return { ok: false, reason: 'failed' }
}

export const fetchNewsletterSubscribers = async () => {
  if (!supabase) return { ok: false, rows: [] }
  const { data, error } = await supabase
    .from(TABLE)
    .select('id,email,source,created_at')
    .order('created_at', { ascending: false })
    .limit(1000)
  if (error) {
    warn('fetch newsletter', error)
    return { ok: false, rows: [] }
  }
  return { ok: true, rows: Array.isArray(data) ? data : [] }
}

export const deleteNewsletterSubscriber = async (id) => {
  if (!supabase) return { ok: false }
  const { error } = await supabase.from(TABLE).delete().eq('id', id)
  if (error) {
    warn('delete newsletter', error)
    return { ok: false }
  }
  return { ok: true }
}
