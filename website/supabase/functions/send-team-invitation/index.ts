import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import nodemailer from 'npm:nodemailer@6.9.7'

const GMAIL_USER = Deno.env.get('GMAIL_USER')
// Remove any spaces from the app password just in case
const GMAIL_APP_PASSWORD = Deno.env.get('GMAIL_APP_PASSWORD')?.replace(/\s/g, '')
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface InvitationRequest {
  teamId: string
  teamName: string
  emails: string[]
  inviterName: string
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Get the authorization header
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL!, SUPABASE_SERVICE_ROLE_KEY!)

    // Verify the user
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: userError } = await supabase.auth.getUser(token)
    
    if (userError || !user) {
      throw new Error('Unauthorized')
    }

    // Parse request body
    const { teamId, teamName, emails, inviterName }: InvitationRequest = await req.json()

    if (!teamId || !teamName || !emails || emails.length === 0) {
      throw new Error('Missing required fields')
    }

    // Verify user owns the team
    const { data: team, error: teamError } = await supabase
      .from('teams')
      .select('*')
      .eq('id', teamId)
      .eq('owner_id', user.id)
      .single()

    if (teamError || !team) {
      throw new Error('Team not found or unauthorized')
    }

    // Create Nodemailer transporter
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: GMAIL_USER,
        pass: GMAIL_APP_PASSWORD,
      },
    });

    const results = []

    // Process each email
    for (const email of emails) {
      try {
        // Generate invitation token
        const token = crypto.randomUUID()
        const expiresAt = new Date()
        expiresAt.setDate(expiresAt.getDate() + 7) // 7 days expiry

        // Create invitation in database
        const { data: invitation, error: invError } = await supabase
          .from('team_invitations')
          .insert({
            team_id: teamId,
            email: email,
            token: token,
            invited_by: user.id,
            expires_at: expiresAt.toISOString(),
          })
          .select()
          .single()

        if (invError) {
          console.error('Error creating invitation:', invError)
          results.push({ email, success: false, error: invError.message })
          continue
        }

        // Also add to team_members with pending status
        await supabase
          .from('team_members')
          .insert({
            team_id: teamId,
            email: email,
            invited_by: user.id,
            status: 'pending',
            role: 'member',
          })

        // Send email via Gmail
        const invitationLink = `${req.headers.get('origin') || 'https://getcq.netlify.app'}/invite/${token}`
        
        await transporter.sendMail({
          from: `"${inviterName} (via Code Quality)" <${GMAIL_USER}>`,
          to: email,
          replyTo: user.email, // Replies go directly to the manager
          subject: `${inviterName} invited you to join ${teamName} on Code Quality`,
          html: `
              <!DOCTYPE html>
              <html>
                <head>
                  <meta charset="utf-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>Join the team on Code Quality</title>
                </head>
                <body style="font-family: 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; background-color: #f4f7fa; margin: 0; padding: 0;">
                  <div style="max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.05);">
                    
                    <!-- Header with Logo -->
                    <div style="background: #0f172a; padding: 30px 40px; text-align: center;">
                      <img src="https://getcq.netlify.app/logo.png" alt="Code Quality" style="height: 40px; margin-bottom: 10px;">
                      <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 600; letter-spacing: 0.5px;">Code Quality</h1>
                    </div>
                    
                    <!-- Main Content -->
                    <div style="padding: 40px 40px 30px;">
                      <h2 style="color: #1e293b; margin-top: 0; font-size: 22px; text-align: center;">You've been invited!</h2>
                      
                      <p style="font-size: 16px; color: #475569; text-align: center; margin-bottom: 30px;">
                        <strong>${inviterName}</strong> has invited you to join the team <strong style="color: #3b82f6;">${teamName}</strong>.
                      </p>
                      
                      <div style="background-color: #f8fafc; border: 1px solid #e2e8f0; border-radius: 8px; padding: 20px; margin-bottom: 30px; text-align: center;">
                        <p style="margin: 0; color: #64748b; font-size: 14px;">
                          Collaborate on code reviews, track quality metrics, and ship better software faster.
                        </p>
                      </div>
                      
                      <div style="text-align: center; margin-bottom: 40px;">
                        <a href="${invitationLink}" 
                           style="background: linear-gradient(135deg, #3b82f6 0%, #2563eb 100%); 
                                  color: white; 
                                  padding: 14px 32px; 
                                  text-decoration: none; 
                                  border-radius: 8px; 
                                  font-weight: 600;
                                  font-size: 16px;
                                  display: inline-block;
                                  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
                                  transition: transform 0.2s;">
                          Accept Invitation
                        </a>
                      </div>
                      
                      <p style="font-size: 14px; color: #94a3b8; text-align: center; margin-top: 0;">
                        This invitation link will expire in 7 days.
                      </p>
                    </div>
                    
                    <!-- Footer -->
                    <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e2e8f0;">
                      <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                        © ${new Date().getFullYear()} Code Quality. All rights reserved.<br>
                        If you didn't expect this invitation, you can safely ignore this email.
                      </p>
                    </div>
                  </div>
                </body>
              </html>
            `,
        });

        results.push({ email, success: true })

      } catch (error) {
        console.error(`Error processing ${email}:`, error)
        results.push({ email, success: false, error: error.message })
      }
    }

    return new Response(
      JSON.stringify({ success: true, results }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    )
  }
})
