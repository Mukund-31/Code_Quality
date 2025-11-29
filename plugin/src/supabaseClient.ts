import { createClient } from "@supabase/supabase-js";

// TODO: Set these to your Supabase project values.
// These are NOT exposed to end users; they are bundled in the extension.
const SUPABASE_URL = "https://pbphgfsjezgamukcgjpv.supabase.co";
const SUPABASE_SERVICE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBicGhnZnNqZXpnYW11a2NnanB2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2MTc2MzQwNywiZXhwIjoyMDc3MzM5NDA3fQ.vpJAAF-DRCJYklcdMp6gd_FHb_YmDlhVOiX2iKMWxNQ";

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.warn("Supabase client is not fully configured. Set SUPABASE_URL and SUPABASE_SERVICE_KEY in supabaseClient.ts");
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        persistSession: false,
        autoRefreshToken: false
    }
});
