// Helpers that keep leftover template artwork and placeholder links off the
// live storefront.

// Anything served from /images/... is bundled demo art from the original
// grocery template. Real content is uploaded to Supabase Storage (https://...)
// or stored inline as a data URL, so those are never treated as demo.
export const isDemoAsset = (src) =>
  typeof src === 'string' && /^\/?images\//i.test(src.trim())

const GENERIC_SOCIAL =
  /^(?:https?:\/\/)?(?:www\.)?(?:facebook|instagram|youtube|twitter|x|tiktok|linkedin)\.com\/?$/i

// The template shipped https://facebook.com/ etc. as placeholders. Those links
// look active but send customers to the network home page, so hide them.
export const isRealSocialUrl = (url) =>
  typeof url === 'string' && url.trim() !== '' && !GENERIC_SOCIAL.test(url.trim())
