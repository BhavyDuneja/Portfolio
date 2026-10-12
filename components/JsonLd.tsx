interface JsonLdProps {
  data: Record<string, unknown>
}

// Written into a <script> element as is, so "<" and ">" (as in "</script>" in a post title) and "&" become
// \u escapes: the text can't end the element or start a comment, and JSON.parse still reads the same data.
// U+2028 and U+2029 are escaped too, as JavaScript string literals didn't allow them before ES2019.
const scriptSafeJson = (data: Record<string, unknown>): string =>
  JSON.stringify(data)
    .replace(/</g, '\\u003c')
    .replace(/>/g, '\\u003e')
    .replace(/&/g, '\\u0026')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

export default function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: scriptSafeJson(data) }}
    />
  )
}
