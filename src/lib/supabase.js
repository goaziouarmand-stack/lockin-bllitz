import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
  import.meta.env.VITE_SUPABASE_URL?.trim()

const supabaseKey =
  import.meta.env.VITE_SUPABASE_ANON_KEY?.trim()

console.log('SUPABASE URL:', supabaseUrl)
console.log('SUPABASE KEY:', supabaseKey)

export const supabase = createClient(
  supabaseUrl,
  supabaseKey
)