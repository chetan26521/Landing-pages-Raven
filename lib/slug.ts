/** URL-safe slug helpers — master spec §42 (campaign URL safety). */

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80)
    .replace(/-+$/g, '') || 'campaign'
}

/** Appends -2, -3, ... until `taken(candidate)` returns false. Never overwrites an existing slug. */
export function uniqueSlug(base: string, taken: (candidate: string) => boolean): string {
  const root = slugify(base)
  if (!taken(root)) return root
  let n = 2
  while (taken(`${root}-${n}`)) n++
  return `${root}-${n}`
}
