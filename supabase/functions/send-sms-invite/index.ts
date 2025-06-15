
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface SMSInviteRequest {
  phoneNumber: string;
  inviterName: string;
  groupName: string;
  inviteLink: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { phoneNumber, inviterName, groupName, inviteLink }: SMSInviteRequest = await req.json();

    // For now, just log the SMS invite (you can integrate with SMS service later)
    console.log('SMS invite:', {
      to: phoneNumber,
      from: inviterName,
      group: groupName,
      link: inviteLink,
      message: `${inviterName} invited you to join ${groupName} on iChanga! Join here: ${inviteLink}`
    });

    // Simulate successful SMS sending
    // In production, integrate with Twilio, Africa's Talking, or your preferred SMS service
    
    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Invite SMS sent successfully' 
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  } catch (error: any) {
    console.error('Error sending invite SMS:', error);
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
