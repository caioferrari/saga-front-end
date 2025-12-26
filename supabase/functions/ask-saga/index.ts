import { createClient } from 'npm:@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Client-Info, Apikey',
};

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const { question } = await req.json();

    if (!question || question.trim() === '') {
      return new Response(
        JSON.stringify({ error: 'Question is required' }),
        {
          status: 400,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const searchTerms = question.toLowerCase().trim();

    const { data: results, error } = await supabase
      .from('knowledge_base')
      .select('*')
      .or(`question.ilike.%${searchTerms}%,answer.ilike.%${searchTerms}%,title.ilike.%${searchTerms}%`)
      .limit(5);

    if (error) {
      console.error('Database error:', error);
      return new Response(
        JSON.stringify({ error: 'Failed to search knowledge base' }),
        {
          status: 500,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    if (!results || results.length === 0) {
      return new Response(
        JSON.stringify({
          answer: 'I apologize, but I could not find any information about that in my knowledge base. Please try rephrasing your question or contact the SME team for assistance.',
          confidence: 'none',
          sources: [],
        }),
        {
          status: 200,
          headers: {
            ...corsHeaders,
            'Content-Type': 'application/json',
          },
        }
      );
    }

    const bestMatch = results[0];
    const additionalSources = results.slice(1, 3);

    return new Response(
      JSON.stringify({
        answer: bestMatch.answer,
        title: bestMatch.title,
        category: bestMatch.category,
        confidence: 'high',
        sources: additionalSources.map((s: any) => ({
          title: s.title,
          id: s.id,
        })),
      }),
      {
        status: 200,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    console.error('Error processing request:', error);
    return new Response(
      JSON.stringify({ error: 'An unexpected error occurred' }),
      {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json',
        },
      }
    );
  }
});