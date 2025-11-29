
import "jsr:@supabase/functions-js/edge-runtime.d.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { order_id } = await req.json()

    if (!order_id) {
      throw new Error('Missing order_id')
    }

    const clientId = Deno.env.get('CASHFREE_CLIENT_ID')?.trim()
    const clientSecret = Deno.env.get('CASHFREE_CLIENT_SECRET')?.trim()
    const mode = Deno.env.get('CASHFREE_MODE') || 'sandbox'

    console.log(`Using Cashfree mode: ${mode}`)

    if (!clientId || !clientSecret) {
      throw new Error('Missing Cashfree credentials')
    }

    const baseUrl = mode === 'production' 
      ? `https://api.cashfree.com/pg/orders/${order_id}` 
      : `https://sandbox.cashfree.com/pg/orders/${order_id}`

    const response = await fetch(baseUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2023-08-01',
        'x-client-id': clientId,
        'x-client-secret': clientSecret
      }
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cashfree Error:', data)
      return new Response(
        JSON.stringify({ error: data.message || 'Failed to fetch order' }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    return new Response(
      JSON.stringify(data),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
