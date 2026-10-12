// Defence in depth for article HTML that the marketing automation publishes. The HTML is generated from
// markdown on the founder's PC, so this is not a general-purpose sanitiser: it removes what can run script,
// embed other documents or restyle the page, and keeps everything else as written.
//
// The input is split into tags, comments and text the way a browser's tokenizer does it, and the output is
// rebuilt from those pieces: comments are dropped, attribute values are re-quoted with ", < and > escaped,
// and a "<" that doesn't start a tag becomes &lt;. A browser therefore reads the output exactly as it is
// checked here, with no comment or attribute value that could hide markup.

/** Removed together with everything inside them. */
const DROP_WITH_CONTENT = new Set(['script', 'style'])

/** Removed, keeping what is inside (which is sanitised like everything else). */
const DROP_TAG = new Set([
  'iframe', 'object', 'embed', 'form', 'input', 'button', 'textarea', 'select',
  'link', 'meta', 'base', 'svg', 'math',
  // Not needed in an article either: raw-text elements, frames, plugins and document-level tags
  'noscript', 'noembed', 'noframes', 'xmp', 'plaintext', 'title',
  'frame', 'frameset', 'applet', 'param', 'html', 'head', 'body',
])

/** Attributes that hold a URL: dropped when the URL uses one of BLOCKED_SCHEMES. */
const URL_ATTRIBUTES = new Set([
  'href', 'src', 'action', 'formaction', 'xlink:href', 'poster', 'background', 'srcset',
  'data', 'cite', 'longdesc', 'lowsrc', 'dynsrc', 'codebase', 'ping',
])
const BLOCKED_SCHEMES = ['javascript:', 'vbscript:', 'data:']

/** Named character references that can matter for a URL scheme (a scheme check only needs these). */
const NAMED_REFERENCES: Record<string, string> = {
  colon: ':', tab: '\t', newline: '\n', nbsp: '\xa0', amp: '&', sol: '/', semi: ';', period: '.',
  comma: ',', lpar: '(', rpar: ')', quot: '"', apos: "'", lt: '<', gt: '>', equals: '=',
}

const SAFE_TAG_NAME = /^[a-z][a-z0-9-]*$/
const SAFE_ATTRIBUTE_NAME = /^[a-z_:][a-z0-9_:.-]*$/
// C0/C1 control characters except tab, line feed, form feed and carriage return
const CONTROL_CHARACTERS = /[\x00-\x08\x0b\x0e-\x1f\x7f-\x9f]/g
const CHARACTER_REFERENCE = /&(#x[0-9a-f]+|#[0-9]+|[a-z][a-z0-9]*);?/gi
const COMMENT_END = /--!?>/g
const REPLACEMENT_CHARACTER = String.fromCharCode(0xfffd)

interface ParsedTag {
  name: string
  closing: boolean
  attributes: Array<[string, string | null]>
  /** Index just past the tag's ">" */
  end: number
}

const isSpace = (ch: string): boolean => ch === ' ' || ch === '\n' || ch === '\t' || ch === '\r' || ch === '\f'

const isAsciiLetter = (ch: string): boolean => (ch >= 'a' && ch <= 'z') || (ch >= 'A' && ch <= 'Z')

// HTML lower-cases ASCII letters only in tag and attribute names
const asciiLower = (value: string): string => value.replace(/[A-Z]+/g, (letters) => letters.toLowerCase())

/** Parses the tag that starts at `start` ("<name" or "</name"). Null when the input ends inside the tag. */
function parseTag(html: string, start: number): ParsedTag | null {
  let i = start + 1
  const closing = html.charAt(i) === '/'
  if (closing) i += 1

  const nameStart = i
  while (i < html.length && !isSpace(html.charAt(i)) && html.charAt(i) !== '/' && html.charAt(i) !== '>') i += 1
  const name = asciiLower(html.slice(nameStart, i))

  const attributes: Array<[string, string | null]> = []
  for (;;) {
    while (i < html.length && (isSpace(html.charAt(i)) || html.charAt(i) === '/')) i += 1
    if (i >= html.length) return null
    if (html.charAt(i) === '>') return { name, closing, attributes, end: i + 1 }

    // Attribute name. Its first character can be anything (even "="), as in the HTML spec.
    const nameFrom = i
    i += 1
    while (i < html.length && !isSpace(html.charAt(i)) && '/>='.indexOf(html.charAt(i)) === -1) i += 1
    const attribute = asciiLower(html.slice(nameFrom, i))

    while (i < html.length && isSpace(html.charAt(i))) i += 1
    if (html.charAt(i) !== '=') {
      attributes.push([attribute, null])
      continue
    }
    i += 1
    while (i < html.length && isSpace(html.charAt(i))) i += 1

    const quote = html.charAt(i)
    if (quote === '"' || quote === "'") {
      const close = html.indexOf(quote, i + 1)
      if (close === -1) return null
      attributes.push([attribute, html.slice(i + 1, close)])
      i = close + 1
    } else {
      const valueFrom = i
      while (i < html.length && !isSpace(html.charAt(i)) && html.charAt(i) !== '>') i += 1
      attributes.push([attribute, html.slice(valueFrom, i)])
    }
  }
}

/** Index just past a comment, doctype, CDATA section, processing instruction or "</" bogus comment. */
function skipComment(html: string, start: number): number {
  if (html.startsWith('<!--', start)) {
    if (html.startsWith('<!-->', start)) return start + 5
    if (html.startsWith('<!--->', start)) return start + 6
    COMMENT_END.lastIndex = start + 4
    const end = COMMENT_END.exec(html)
    return end ? end.index + end[0].length : html.length
  }
  const close = html.indexOf('>', start + 2)
  return close === -1 ? html.length : close + 1
}

/** Index just past the end tag that closes a script or style element (or the end of the input). */
function skipRawText(html: string, from: number, name: string): number {
  const endTag = new RegExp(`</${name}[\\t\\n\\f\\r />]`, 'gi')
  endTag.lastIndex = from
  const match = endTag.exec(html)
  if (!match) return html.length
  const tag = parseTag(html, match.index)
  return tag ? tag.end : html.length
}

/** Characters a URL parser skips (controls and spaces) plus invisible ones: ignored by the scheme check. */
const isIgnoredInUrl = (code: number): boolean =>
  code <= 0x20 ||
  (code >= 0x7f && code <= 0xa0) ||
  code === 0xad ||
  (code >= 0x200b && code <= 0x200f) ||
  code === 0x2028 ||
  code === 0x2029 ||
  code === 0xfeff

function decodeReferences(value: string): string {
  return value.replace(CHARACTER_REFERENCE, (match: string, ref: string) => {
    if (ref.charAt(0) !== '#') {
      const named = NAMED_REFERENCES[ref.toLowerCase()]
      return named === undefined ? match : named
    }
    const hex = ref.charAt(1) === 'x' || ref.charAt(1) === 'X'
    const code = parseInt(ref.slice(hex ? 2 : 1), hex ? 16 : 10)
    if (!(code > 0 && code <= 0x10ffff) || (code >= 0xd800 && code <= 0xdfff)) return REPLACEMENT_CHARACTER
    return String.fromCodePoint(code)
  })
}

/** True for javascript:, vbscript: and data: URLs, however they are encoded or padded. */
function isBlockedUrl(value: string): boolean {
  const decoded = decodeReferences(value)
  let compact = ''
  for (let i = 0; i < decoded.length && compact.length < 16; i += 1) {
    if (!isIgnoredInUrl(decoded.charCodeAt(i))) compact += decoded.charAt(i).toLowerCase()
  }
  return BLOCKED_SCHEMES.some((scheme) => compact.indexOf(scheme) === 0)
}

const escapeAttribute = (value: string): string =>
  value.replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;')

function openingTag(tag: ParsedTag): string {
  const seen = new Set<string>()
  let out = `<${tag.name}`
  tag.attributes.forEach(([name, value]) => {
    if (!SAFE_ATTRIBUTE_NAME.test(name) || seen.has(name)) return
    seen.add(name) // a browser keeps the first of two attributes with the same name
    const localName = name.slice(name.lastIndexOf(':') + 1)
    if (localName.indexOf('on') === 0 || name === 'style') return
    if (value !== null && URL_ATTRIBUTES.has(name) && isBlockedUrl(value)) return
    out += value === null ? ` ${name}` : ` ${name}="${escapeAttribute(value)}"`
  })
  return `${out}>`
}

/**
 * Removes script, style, iframe, object, embed, form controls, link, meta, base, svg and math elements
 * (script and style with their content), every on*= and style= attribute, and javascript:, vbscript: and
 * data: URLs. Comments are dropped too.
 */
export function sanitizeHtml(input: string): string {
  const html = input.replace(CONTROL_CHARACTERS, '')
  let out = ''
  let i = 0
  while (i < html.length) {
    const lt = html.indexOf('<', i)
    if (lt === -1) {
      out += html.slice(i)
      break
    }
    out += html.slice(i, lt)

    const next = html.charAt(lt + 1)
    const startsTag = isAsciiLetter(next) || (next === '/' && isAsciiLetter(html.charAt(lt + 2)))
    if (!startsTag) {
      if (next === '!' || next === '?' || next === '/') {
        i = skipComment(html, lt)
      } else {
        out += '&lt;'
        i = lt + 1
      }
      continue
    }

    const tag = parseTag(html, lt)
    if (!tag) break // the input ends inside a tag: a browser drops that tag, and so does this
    i = tag.end
    if (DROP_WITH_CONTENT.has(tag.name)) {
      if (!tag.closing) i = skipRawText(html, i, tag.name)
      continue
    }
    if (DROP_TAG.has(tag.name) || !SAFE_TAG_NAME.test(tag.name)) continue
    out += tag.closing ? `</${tag.name}>` : openingTag(tag)
  }
  return out
}
