import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * 创建Supabase客户端
 * @returns SupabaseClient实例
 */
export function createSupabaseClient(): SupabaseClient {
  const supabaseUrl = process.env.SUPABASE_URL || ''
  const supabaseKey = process.env.SUPABASE_ANON_KEY || ''

  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Key length:', supabaseKey ? supabaseKey.length : 0)

  if (!supabaseUrl) {
    throw new Error('SUPABASE_URL is required')
  }

  if (!supabaseKey) {
    throw new Error('SUPABASE_ANON_KEY is required')
  }

  // 验证URL格式
  try {
    new URL(supabaseUrl)
  } catch (error) {
    throw new Error(`Invalid SUPABASE_URL format: ${supabaseUrl}`)
  }

  return createClient(supabaseUrl, supabaseKey)
}

