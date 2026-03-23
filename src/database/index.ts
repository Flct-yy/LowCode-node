import { createClient, SupabaseClient } from '@supabase/supabase-js'

/**
 * 创建Supabase客户端
 * @returns SupabaseClient实例
 */
export function createSupabaseClient(): SupabaseClient {
  // 获取环境变量并去除多余的引号和空白字符
  const supabaseUrl = (process.env.SUPABASE_URL || '').replace(/^[\s\'\"]+|[\s\'\"]+$/g, '')
  const supabaseKey = (process.env.SUPABASE_ANON_KEY || '').replace(/^[\s\'\"]+|[\s\'\"]+$/g, '')

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

