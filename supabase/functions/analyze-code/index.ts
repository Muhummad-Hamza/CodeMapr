const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { code } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `You are a code analysis expert. Analyze the provided code and generate:
1. A flowchart structure in JSON format with nodes and edges
2. A step-by-step algorithm breakdown

For the flowchart:
- Create nodes with types: 'input' (start), 'default' (process), 'output' (end)
- Each node should have: id, type, position {x, y}, data {label}
- Create edges connecting nodes with: id, source, target
- Use clear, descriptive labels
- Position nodes in a vertical flow with good spacing

For the algorithm:
- Break down the code logic into clear, numbered steps
- Explain what each major operation does
- Include control flow (loops, conditionals)
- Keep steps concise but informative

Return JSON with this exact structure:
{
  "flowchart": {
    "nodes": [{"id": "1", "type": "input", "position": {"x": 250, "y": 0}, "data": {"label": "Start"}}],
    "edges": [{"id": "e1-2", "source": "1", "target": "2"}]
  },
  "algorithm": ["Step 1: ...", "Step 2: ...", "Step 3: ..."]
}`;

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Analyze this code:\n\n${code}` }
        ],
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('AI Gateway error:', response.status, errorText);
      throw new Error(`AI Gateway error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices?.[0]?.message?.content;
    
    if (!content) {
      throw new Error('No response from AI');
    }

    const result = JSON.parse(content);

    return new Response(
      JSON.stringify(result),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error in analyze-code function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
