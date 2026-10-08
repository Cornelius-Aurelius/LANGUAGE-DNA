import { createClient } from 'npm:@supabase/supabase-js@2.110.8'

// No privileged credential is ever shipped in browser JavaScript.
// Supabase supplies SUPABASE_SERVICE_ROLE_KEY to hosted Edge Functions.
const allowedOrigins = new Set(['https://cornelius-aurelius.github.io'])
const jsonHeaders = {'Content-Type': 'application/json'}

Deno.serve(async (req: Request) => {
  const origin = req.headers.get('Origin')
  const cors = origin && allowedOrigins.has(origin) ?
    {'Access-Control-Allow-Origin': origin, 'Access-Control-Allow-Headers': 'authorization, apikey, x-client-info, content-type', 'Access-Control-Allow-Methods': 'POST, OPTIONS', 'Vary': 'Origin'} : {'Vary': 'Origin'}
  const reply = (status: number, payload: object) =>
    new Response(JSON.stringify(payload), {status, headers: {...jsonHeaders, ...cors}})

  if (origin && !allowedOrigins.has(origin)) return reply(403, {error: 'Origin not allowed'})
  if (req.method === 'OPTIONS') return new Response(null, {status: 204, headers: cors})
  if (req.method !== 'POST') return reply(405, {error: 'Method not allowed'})

  const authorization = req.headers.get('Authorization') || ''
  if (!/^Bearer\s+\S+$/.test(authorization)) return reply(401, {error: 'Unauthorized'})

  let body: {confirm?: unknown, password?: unknown}
  try { body = await req.json() } catch { return reply(400, {error: 'Invalid request'}) }
  if (body.confirm !== 'DELETE' || typeof body.password !== 'string' || !body.password) {
    return reply(400, {error: 'Explicit confirmation and password required'})
  }

  const url = Deno.env.get('SUPABASE_URL')
  const publicKey = Deno.env.get('SUPABASE_ANON_KEY')
  const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
  if (!url || !publicKey || !serviceKey) return reply(503, {error: 'Deletion is temporarily unavailable'})

  try {
    const userClient = createClient(url, publicKey, {auth: {persistSession: false}})
    const token = authorization.replace(/^Bearer\s+/, '')
    const verified = await userClient.auth.getUser(token)
    const user = verified.data.user
    if (verified.error || !user || !user.email) return reply(401, {error: 'Unauthorized'})

    // Re-check knowledge of the current account password immediately before deletion.
    const passwordCheck = await userClient.auth.signInWithPassword({email: user.email, password: body.password})
    if (passwordCheck.error || passwordCheck.data.user?.id !== user.id) {
      return reply(403, {error: 'Password verification failed'})
    }

    const admin = createClient(url, serviceKey, {auth: {persistSession: false}})
    const deleted = await admin.auth.admin.deleteUser(user.id)
    if (deleted.error) return reply(503, {error: 'Could not delete account'})
    // The learner_progress row is deleted through ON DELETE CASCADE.
    return reply(200, {deleted: true})
  } catch {
    return reply(503, {error: 'Deletion is temporarily unavailable'})
  }
})
