import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * 创建Supabase客户端
 * @returns SupabaseClient实例
 */
export function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is required')
  }

  if (!supabaseKey) {
    throw new Error('SUPABASE_ANON_KEY is required')
  }

  return createClient(supabaseUrl, supabaseKey)
}

