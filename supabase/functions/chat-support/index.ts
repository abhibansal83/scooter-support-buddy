import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const predefinedKnowledge = `
You are a helpful customer support assistant for ElectroScoot, an electric scooter company. Here is your knowledge base:

BATTERY QUESTIONS:
- Battery life: 25-30 km range on single charge, 4-6 hours charging time
- Charging: Use original charger, charge in dry ventilated area, avoid direct sunlight, LED turns green when full
- Battery maintenance: Avoid complete discharge, charge regularly, store in cool dry place

PERFORMANCE QUESTIONS:
- Speed issues: Check battery charge, tire pressure, clean scooter regularly
- Maximum weight: 100 kg rider limit, 5 kg additional cargo
- Range factors: Rider weight, terrain, weather, riding style affect range

MAINTENANCE:
- Service interval: Every 3 months or 1000 km
- Regular maintenance: Weekly tire pressure check, monthly cleaning
- Tire care: Maintain proper pressure, check for wear, replace when needed

SAFETY:
- Required gear: Always wear helmet, knee/elbow pads recommended
- Lighting: Ensure working lights and reflectors
- Weather: Avoid riding in heavy rain
- Traffic: Follow local traffic rules

WARRANTY:
- Coverage: 12 months manufacturing defects, 6 months battery
- Exclusions: Normal wear, accidental damage, misuse
- Claims: Contact service center with purchase receipt

LEGAL:
- License: Usually not required for scooters under 25 km/h
- Age restrictions: Check local regulations
- Where to ride: Follow local laws for bike lanes vs roads

Always be helpful, friendly, and provide accurate information based on this knowledge. If a question is outside your knowledge base, politely direct them to contact human support.
`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, conversationId, userId } = await req.json();

    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    // Get user's auth header for Supabase client
    const authHeader = req.headers.get('Authorization');
    const supabaseUrl = Deno.env.get('SUPABASE_URL') ?? '';
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY') ?? '';
    
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Get conversation history for context
    let conversationHistory = [];
    if (conversationId) {
      const { data: messages } = await supabase
        .from('messages')
        .select('content, role')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
        .limit(10); // Last 10 messages for context

      if (messages) {
        conversationHistory = messages.map(msg => ({
          role: msg.role,
          content: msg.content
        }));
      }
    }

    // Create OpenAI messages array
    const messages = [
      { role: 'system', content: predefinedKnowledge },
      ...conversationHistory,
      { role: 'user', content: message }
    ];

    // Call OpenAI API
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.statusText}`);
    }

    const data = await response.json();
    const assistantMessage = data.choices[0].message.content;

    // Save both user and assistant messages to database
    if (conversationId && userId) {
      // Save user message
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        user_id: userId,
        content: message,
        role: 'user'
      });

      // Save assistant message
      await supabase.from('messages').insert({
        conversation_id: conversationId,
        user_id: userId,
        content: assistantMessage,
        role: 'assistant'
      });

      // Update conversation timestamp
      await supabase
        .from('conversations')
        .update({ updated_at: new Date().toISOString() })
        .eq('id', conversationId);
    }

    return new Response(JSON.stringify({ 
      message: assistantMessage,
      success: true 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in chat-support function:', error);
    return new Response(JSON.stringify({ 
      error: error.message,
      success: false 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});