
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
    const reqBody = await req.json()
    console.log('Received Request Body:', JSON.stringify(reqBody))
    const { order_amount, customer_details, return_url } = reqBody

    const clientId = Deno.env.get('CASHFREE_CLIENT_ID')?.trim()
    const clientSecret = Deno.env.get('CASHFREE_CLIENT_SECRET')?.trim()
    const mode = Deno.env.get('CASHFREE_MODE') || 'sandbox'

    console.log(`Using Cashfree mode: ${mode}`)
    console.log(`Client ID exists: ${!!clientId}, length: ${clientId?.length || 0}`)
    console.log(`Client Secret exists: ${!!clientSecret}, length: ${clientSecret?.length || 0}`)
    console.log(`Client ID first 4 chars: ${clientId?.substring(0, 4)}...`)

    if (!clientId || !clientSecret) {
      console.error('Missing Cashfree credentials!')
      throw new Error('Missing Cashfree credentials')
    }

    const baseUrl = mode === 'production' 
      ? 'https://api.cashfree.com/pg/orders' 
      : 'https://sandbox.cashfree.com/pg/orders'

    const payload = {
      order_amount: order_amount,
      order_currency: "INR",
      customer_details: customer_details,
      order_meta: {
        return_url: return_url
      }
    }

    console.log('Sending request to:', baseUrl)
    console.log('Payload:', JSON.stringify(payload))

    const response = await fetch(baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-version': '2022-09-01',
        'x-client-id': clientId,
        'x-client-secret': clientSecret
      },
      body: JSON.stringify(payload)
    })

    const data = await response.json()

    if (!response.ok) {
      console.error('Cashfree Error:', data)
      console.error('Response Status:', response.status)
      console.error('Response Headers:', Object.fromEntries(response.headers.entries()))
      return new Response(
        JSON.stringify({ 
          error: data.message || 'Failed to create order',
          details: data,
          hint: 'Please verify your Cashfree API credentials are correct for sandbox mode'
        }),
        { 
          status: response.status,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log('Cashfree Success Response:', data)
    console.log('Payment Session ID from Cashfree:', data.payment_session_id)

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
