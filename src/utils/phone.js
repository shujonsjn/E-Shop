// Customer accounts sign in with a mobile number, so every comparison uses the
// same normalized form: 01XXXXXXXXX (11 digits, Bangladeshi format).
//
// Admins keep signing in with their email through Supabase Auth.

export const normalizePhone = (value) => {
  let digits = String(value || '').replace(/\D/g, '')
  if (digits.startsWith('880')) digits = `0${digits.slice(3)}`
  else if (digits.startsWith('88')) digits = `0${digits.slice(2)}`
  else if (digits.length === 10 && digits.startsWith('1')) digits = `0${digits}`
  return digits
}

export const isValidBdPhone = (value) => /^01[3-9]\d{8}$/.test(normalizePhone(value))

export const samePhone = (left, right) => {
  const a = normalizePhone(left)
  return a.length >= 10 && a === normalizePhone(right)
}

export default normalizePhone
