// Test signup functionality
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env file
const envPath = join(__dirname, '.env');
const envContent = readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim();
        value = value.replace(/^["']|["']$/g, '');
        envVars[key.trim()] = value;
    }
});

const SUPABASE_URL = envVars.VITE_SUPABASE_URL;
const SUPABASE_ANON_KEY = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('🧪 Testing Signup Flow...\n');

// Test signup with a test email
const testEmail = `test${Date.now()}@example.com`;
const testPassword = 'Test123456!';

console.log('Test credentials:');
console.log('Email:', testEmail);
console.log('Password:', testPassword);
console.log('');

try {
    const { data, error } = await supabase.auth.signUp({
        email: testEmail,
        password: testPassword,
        options: {
            data: {
                name: 'Test User',
                username: 'testuser',
            }
        }
    });

    console.log('📊 Signup Response:');
    console.log('');

    if (error) {
        console.error('❌ Error:', error.message);
        console.error('Error details:', JSON.stringify(error, null, 2));
    } else {
        console.log('✅ Signup successful!');
        console.log('');
        console.log('User created:', data.user ? 'Yes' : 'No');
        console.log('User ID:', data.user?.id);
        console.log('Email:', data.user?.email);
        console.log('Email confirmed:', data.user?.email_confirmed_at ? 'Yes' : 'No');
        console.log('Session created:', data.session ? 'Yes' : 'No');
        console.log('');

        if (!data.session) {
            console.log('⚠️  Email confirmation is REQUIRED');
            console.log('The user needs to confirm their email before they can sign in.');
        } else {
            console.log('✅ User is automatically signed in (no email confirmation required)');
        }
    }
} catch (err) {
    console.error('❌ Unexpected error:', err.message);
}
