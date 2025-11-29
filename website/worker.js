// Available models configuration
const MODELS = {
    // OpenRouter models
    'gpt-oss-20b': { provider: 'openrouter', id: 'openai/gpt-oss-20b:free' },
    'kat-coder-pro': { provider: 'openrouter', id: 'kwaipilot/kat-coder-pro:free' },
    'kimi-k2': { provider: 'openrouter', id: 'moonshotai/kimi-k2:free' },
    'deepseek-v3.1': { provider: 'openrouter', id: 'deepseek/deepseek-chat-v3.1:free' },

    // Google Gemini models
    'gemini-2.5-flash': { provider: 'google', id: 'gemini-2.5-flash' },
    'gemini-2.5-pro': { provider: 'google', id: 'gemini-2.5-pro' },
};

export default {
    async fetch(request, env, ctx) {
        // Handle CORS preflight
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                },
            });
        }

        // Only accept POST requests
        if (request.method !== 'POST') {
            return errorResponse('Method not allowed. Use POST.', 405);
        }

        try {
            const body = await request.json();
            const {
                model = 'gpt-oss-20b',
                messages,
                reasoning = false,
                stream = false,
                temperature,
                max_tokens,
                top_p,
                system_instruction,
                telemetry
            } = body;

            // Validate messages
            if (!messages || !Array.isArray(messages)) {
                return errorResponse('Messages array is required', 400);
            }

            // Get model configuration
            const modelConfig = MODELS[model];
            if (!modelConfig) {
                return errorResponse(`Unknown model: ${model}`, 400);
            }

            // Route to appropriate provider
            if (modelConfig.provider === 'google') {
                return await handleGoogleRequest(body, modelConfig, env, telemetry, ctx);
            } else if (modelConfig.provider === 'openrouter') {
                return await handleOpenRouterRequest(body, modelConfig, env, telemetry, ctx);
            }

            return errorResponse('Invalid provider configuration', 500);

        } catch (error) {
            console.error('Request error:', error);
            return errorResponse(error.message, 500);
        }
    },
};

// Handle Google Gemini API requests
async function handleGoogleRequest(body, modelConfig, env, telemetry, ctx) {
    const { messages, stream, temperature, max_tokens, top_p, system_instruction } = body;

    // Convert OpenAI-style messages to Google format
    const contents = messages.map(msg => ({
        role: msg.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: msg.content }]
    }));

    // Build generation config
    const generationConfig = {};
    if (temperature !== undefined) generationConfig.temperature = temperature;
    if (max_tokens !== undefined) generationConfig.maxOutputTokens = max_tokens;
    if (top_p !== undefined) generationConfig.topP = top_p;

    const payload = { contents };

    if (Object.keys(generationConfig).length > 0) {
        payload.generationConfig = generationConfig;
    }

    if (system_instruction) {
        payload.system_instruction = {
            parts: [{ text: system_instruction }]
        };
    }

    const endpoint = stream
        ? `https://generativelanguage.googleapis.com/v1beta/models/${modelConfig.id}:streamGenerateContent?alt=sse`
        : `https://generativelanguage.googleapis.com/v1beta/models/${modelConfig.id}:generateContent`;

    const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
            'x-goog-api-key': env.GEMINI_API_KEY,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('Google API error:', error);
        return errorResponse(`Google API Error: ${error}`, response.status);
    }

    // Handle streaming
    if (stream) {
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

    // Handle regular response - convert to OpenAI format
    const result = await response.json();
    const text = result.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Log telemetry asynchronously (don't block response)
    if (telemetry?.userId) {
        ctx.waitUntil(logTelemetryToSupabase(telemetry, 'review', text, env));
    }

    return new Response(JSON.stringify({
        success: true,
        data: result,
        message: {
            role: 'assistant',
            content: text
        },
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
}

// Handle OpenRouter API requests
async function handleOpenRouterRequest(body, modelConfig, env, telemetry, ctx) {
    const { messages, reasoning, stream, temperature, max_tokens, top_p } = body;

    const payload = {
        model: modelConfig.id,
        messages: messages,
    };

    if (reasoning) {
        payload.reasoning = { enabled: true };
    }
    if (stream) {
        payload.stream = true;
    }
    if (temperature !== undefined) payload.temperature = temperature;
    if (max_tokens !== undefined) payload.max_tokens = max_tokens;
    if (top_p !== undefined) payload.top_p = top_p;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': env.APP_URL || 'https://your-app.com',
            'X-Title': env.APP_NAME || 'AI Agent',
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.text();
        console.error('OpenRouter API error:', error);
        return errorResponse(`OpenRouter API Error: ${error}`, response.status);
    }

    // Handle streaming
    if (stream) {
        return new Response(response.body, {
            headers: {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
            },
        });
    }

    // Handle regular response
    const result = await response.json();
    const text = result.choices?.[0]?.message?.content || '';

    // Log telemetry asynchronously (don't block response)
    if (telemetry?.userId) {
        ctx.waitUntil(logTelemetryToSupabase(telemetry, 'review', text, env));
    }

    return new Response(JSON.stringify({
        success: true,
        data: result,
        message: result.choices?.[0]?.message,
    }), {
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
}

// Log telemetry to Supabase
async function logTelemetryToSupabase(telemetry, eventType, resultSummary, env) {
    try {
        console.log('Telemetry: logTelemetryToSupabase called with:', { telemetry, eventType });
        const { userId, userEmail, eventType: telemetryEventType, eventPayload } = telemetry;
        if (!userId) {
            console.log('Telemetry: No userId provided, skipping');
            return;
        }
        
        console.log('Telemetry: Supabase URL:', env.SUPABASE_URL);
        console.log('Telemetry: Service key exists:', !!env.SUPABASE_SERVICE_KEY);
        console.log('Telemetry: Event type from telemetry:', telemetryEventType);
        console.log('Telemetry: Event payload:', eventPayload);

        // Get or create work session
        const today = new Date().toISOString().slice(0, 10);
        
        // First, try to get existing session
        let sessionId;
        try {
            const sessionResponse = await fetch(
                `${env.SUPABASE_URL}/rest/v1/work_sessions?user_id=eq.${userId}&session_date=eq.${today}&select=id`,
                {
                    method: 'GET',
                    headers: {
                        'apikey': env.SUPABASE_SERVICE_KEY,
                        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                        'Content-Type': 'application/json',
                    },
                }
            );

            if (sessionResponse.ok) {
                const sessions = await sessionResponse.json();
                if (sessions.length > 0) {
                    sessionId = sessions[0].id;
                }
            }
        } catch (e) {
            console.error('Telemetry: Failed to fetch existing session', e);
        }

        // If no session exists, create one
        if (!sessionId) {
            try {
                const createResponse = await fetch(
                    `${env.SUPABASE_URL}/rest/v1/work_sessions`,
                    {
                        method: 'POST',
                        headers: {
                            'apikey': env.SUPABASE_SERVICE_KEY,
                            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                            'Content-Type': 'application/json',
                            'Prefer': 'return=representation',
                        },
                        body: JSON.stringify({
                            user_id: userId,
                            session_date: today,
                            started_at: new Date().toISOString(),
                        }),
                    }
                );

                if (createResponse.ok) {
                    const created = await createResponse.json();
                    sessionId = created[0]?.id;
                } else {
                    console.error('Telemetry: Failed to create session', await createResponse.text());
                    return;
                }
            } catch (e) {
                console.error('Telemetry: Failed to create session', e);
                return;
            }
        }

        // Insert review event
        if (sessionId) {
            // Store full result without truncation
            const fullResult = resultSummary || undefined;
            try {
                const eventResponse = await fetch(
                    `${env.SUPABASE_URL}/rest/v1/review_events`,
                    {
                        method: 'POST',
                        headers: {
                            'apikey': env.SUPABASE_SERVICE_KEY,
                            'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            session_id: sessionId,
                            event_type: telemetry.eventType || eventType,
                            payload: {
                                userEmail,
                                ...telemetry.eventPayload
                            },
                            result_summary: fullResult,
                        }),
                    }
                );

                if (!eventResponse.ok) {
                    console.error('Telemetry: Failed to insert event', await eventResponse.text());
                } else {
                    console.log('Telemetry: Event logged successfully with payload:', telemetry.eventPayload);
                }
            } catch (e) {
                console.error('Telemetry: Failed to insert event', e);
            }
        }
    } catch (error) {
        console.error('Telemetry: Unexpected error', error);
    }
}

// Helper function for error responses
function errorResponse(message, status = 500) {
    return new Response(JSON.stringify({
        success: false,
        error: message,
    }), {
        status,
        headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
        },
    });
}