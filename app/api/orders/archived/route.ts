// app/api/admin/orders/archived/route.ts
import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET() {
  try {
    const supabase = await createClient()
    
    const { data, error } = await supabase
      .from('orders')
      .select(`
        *,
        customers(*)
      `)
      .eq('archived', true)
      .order('completed_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data)
  } catch (error) {
    console.error('Error fetching archived orders:', error)
    return NextResponse.json({ error: 'Failed to fetch archived orders' }, { status: 500 })
  }
}