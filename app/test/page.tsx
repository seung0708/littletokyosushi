import { createClient } from '@/lib/supabase/client'
import { redirect } from 'next/navigation'

export default async function TestPage() {
  const supabase = createClient()
  
  // Check auth state
  const { data: { session } } = await supabase.auth.getSession()
  
  // Require authentication
  if (!session) {
    redirect('/login')
  }

  console.log('Auth session:', {
    hasSession: !!session,
    user: session?.user?.email
  })

  // Try direct table query first
  const { data: directData, error: directError } = await supabase
    .from('menu_items')
    .select('*')
    .limit(1)
  
  console.log('Direct query:', { directData, directError })

  // Now try RPC
  const { data, error } = await supabase.rpc('get_items', {
    query: '',
    items_per_page: 10,
    offset_val: 0
  })

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Test Page</h1>
      <div className="space-y-4">
        <div>
          <h2 className="font-bold">Auth State:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({ 
              hasSession: !!session, 
              user: session?.user?.email,
              role: session?.user?.role
            }, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="font-bold">Direct Query:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({ directData, directError }, null, 2)}
          </pre>
        </div>
        <div>
          <h2 className="font-bold">RPC Result:</h2>
          <pre className="bg-gray-100 p-4 rounded">
            {JSON.stringify({ data, error }, null, 2)}
          </pre>
        </div>
      </div>
    </div>
  )
}
