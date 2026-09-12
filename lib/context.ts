import fs from 'node:fs'
import path from 'node:path'

const CONTEXT_DIR = path.join(process.cwd(), 'raven-labs-context')

/** Reads a Raven Labs context file (master spec §11). Returns '' if missing. */
export function readContext(file: string): string {
  try {
    return fs.readFileSync(path.join(CONTEXT_DIR, file), 'utf-8')
  } catch {
    return ''
  }
}

/**
 * True once a human has added at least one real entry to approved-claims.md
 * (i.e. the file no longer only contains the placeholder scaffold). Gates
 * whether the generation engine is allowed to render a real Proof section
 * or must fall back to an honest "no approved proof yet" placeholder.
 */
export function hasApprovedClaims(): boolean {
  const content = readContext('approved-claims.md')
  if (/No approved stats, testimonials/.test(content)) return false
  return /^##\s+/m.test(content)
}
