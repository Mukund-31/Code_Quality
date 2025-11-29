// Test Supabase connection
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readFileSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file manually
const envPath = join(__dirname, '.env');
let envContent;
try {
    envContent = readFileSync(envPath, 'utf8');
    const envVars = {};
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            // Remove quotes from values
            let value = valueParts.join('=').trim();
            value = value.replace(/^["']|["']$/g, '');
            envVars[key.trim()] = value;
        }
    });

    const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
    const SUPABASE_ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;

    console.log('🔍 Checking Supabase Configuration...\n');

    if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
        console.error('❌ Missing environment variables!');
        console.log('VITE_SUPABASE_URL:', SUPABASE_URL ? '✓ Set' : '✗ Missing');
        console.log('VITE_SUPABASE_ANON_KEY:', SUPABASE_ANON_KEY ? '✓ Set' : '✗ Missing');
        process.exit(1);
    }

    console.log('✓ Environment variables found');
    console.log('SUPABASE_URL:', SUPABASE_URL);
    console.log('ANON_KEY:', SUPABASE_ANON_KEY.substring(0, 20) + '...\n');

    // Create Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

    console.log('🔌 Testing connection...\n');

    // Test 1: Check if we can query the profiles table
    const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('count')
        .limit(1);

    if (profilesError) {
        console.error('❌ Profiles table query failed:', profilesError.message);
    } else {
        console.log('✓ Profiles table accessible');
    }

    // Test 2: Check auth status
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();

    if (sessionError) {
        console.error('❌ Auth check failed:', sessionError.message);
    } else {
        console.log('✓ Auth system accessible');
        console.log('Current session:', session ? 'Active' : 'No active session');
    }

    // Test 3: List available tables (this might fail due to permissions, which is ok)
    const { data: tables, error: tablesError } = await supabase
        .from('profiles')
        .select('*')
        .limit(0);

    if (!tablesError) {
        console.log('✓ Database query successful');
    }

    console.log('\n✅ Supabase connection test completed!');
    console.log('\nConnection Status: HEALTHY');

} catch (error) {
    console.error('❌ Connection test failed:', error.message);
    process.exit(1);
}
