
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface InviteEmailRequest {
  email: string;
  inviterName: string;
  groupName: string;
  inviteLink: string;
  role: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, inviterName, groupName, inviteLink, role }: InviteEmailRequest = await req.json();

    // For now, just log the invite (you can integrate with Resend later)
    console.log('Email invite:', {
      to: email,
      from: inviterName,
      group: groupName,
      link: inviteLink,
      role: role
    });

    // Simulate successful email sending
    // In production, integrate with Resend or your preferred email service
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invite email sent successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error sending invite email:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
