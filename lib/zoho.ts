// Zoho CRM lead sync — server-side only (reads secret env vars, never import from client code)

// Data center of the Zoho account: 'in' (crm.zoho.in), 'com' (crm.zoho.com), 'eu', 'au', 'jp'
const DC = process.env.ZOHO_DC || 'in'
const ACCOUNTS_URL = `https://accounts.zoho.${DC}`
const API_URL = `https://www.zohoapis.${DC}/crm/v2`

// Access tokens last 1h; cache one per server instance so we don't hit the token endpoint on every lead
let cachedToken: { token: string; expiresAt: number } | null = null

export const isZohoConfigured = (): boolean =>
  !!(process.env.ZOHO_CLIENT_ID && process.env.ZOHO_CLIENT_SECRET && process.env.ZOHO_REFRESH_TOKEN)

const getAccessToken = async (): Promise<string> => {
  if (cachedToken && Date.now() < cachedToken.expiresAt) return cachedToken.token

  const params = new URLSearchParams({
    refresh_token: process.env.ZOHO_REFRESH_TOKEN!,
    client_id: process.env.ZOHO_CLIENT_ID!,
    client_secret: process.env.ZOHO_CLIENT_SECRET!,
    grant_type: 'refresh_token',
  })
  const res = await fetch(`${ACCOUNTS_URL}/oauth/v2/token?${params.toString()}`, { method: 'POST' })
  const json = await res.json()
  if (!json.access_token) {
    throw new Error(`Zoho token refresh failed: ${JSON.stringify(json)}`)
  }

  cachedToken = { token: json.access_token, expiresAt: Date.now() + 50 * 60 * 1000 }
  return json.access_token
}

export interface ZohoLeadInput {
  name: string
  email: string
  phone?: string | null
  company?: string | null
  service?: string | null
  budget?: string | null
  timeline?: string | null
  message: string
}

/**
 * Creates a Lead in Zoho CRM from a website enquiry.
 * Returns the Zoho record id, or null if Zoho is not configured or the call failed — never throws,
 * so a CRM hiccup can never block the contact form.
 */
export const createZohoLead = async (input: ZohoLeadInput): Promise<string | null> => {
  if (!isZohoConfigured()) return null

  try {
    const token = await getAccessToken()

    // Zoho requires Last_Name; treat the final word as the surname
    const parts = input.name.trim().split(/\s+/)
    const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0]
    const firstName = parts.length > 1 ? parts.slice(0, -1).join(' ') : ''

    const description = [
      input.message,
      '',
      `Project type: ${input.service || 'Not specified'}`,
      `Budget: ${input.budget || 'Not specified'}`,
      `Timeline: ${input.timeline || 'Not specified'}`,
    ].join('\n')

    // Company is mandatory on Zoho's default Leads layout, so it always needs a value
    const record: Record<string, string> = {
      Last_Name: lastName,
      Company: input.company || 'Individual',
      Email: input.email,
      Lead_Source: process.env.ZOHO_LEAD_SOURCE || 'Website Contact Form',
      Description: description,
    }
    if (firstName) record.First_Name = firstName
    if (input.phone) record.Phone = input.phone

    const post = async (data: Record<string, string>) => {
      const res = await fetch(`${API_URL}/Leads`, {
        method: 'POST',
        headers: {
          Authorization: `Zoho-oauthtoken ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ data: [data], trigger: ['workflow'] }),
      })
      return res.json()
    }

    let json = await post(record)
    let result = json?.data?.[0]

    // If "Website Contact Form" isn't in the Lead Source picklist yet, still create the lead rather than lose it
    if (result?.code !== 'SUCCESS' && /Lead_Source/i.test(JSON.stringify(json))) {
      const { Lead_Source: _unused, ...withoutSource } = record
      void _unused
      json = await post(withoutSource)
      result = json?.data?.[0]
    }

    if (result?.code === 'SUCCESS') {
      return String(result.details.id)
    }

    console.error('Zoho lead create failed:', JSON.stringify(json))
    return null
  } catch (err) {
    console.error('Zoho lead sync error:', err)
    return null
  }
}
