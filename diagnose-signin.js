// Check auth configuration and test sign in
import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const envPath = join(__dirname, '.env');
const envContent = readFileSync(envPath, 'utf8');
const envVars = {};

envContent.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
        let value = valueParts.join('=').trim().replace(/^["']|["']$/g, '');
        envVars[key.trim()] = value;
    }
});

const supabase = createClient(envVars.VITE_SUPABASE_URL, envVars.VITE_SUPABASE_ANON_KEY);

console.log('🔍 Diagnosing Sign In Issue...\n');

// Test with the email you just tried
const testEmail = 'testuser123@gmail.com';
const testPassword = 'Test123456!';

console.log('Testing credentials:');
console.log('Email:', testEmail);
console.log('Password:', testPassword);
console.log('');

try {
    const { data, error } = await supabase.auth.signInWithPassword({
        email: testEmail,
        password: testPassword
    });

    if (error) {
        console.log('❌ Sign In Failed\n');
        console.log('Error Message:', error.message);
        console.log('Error Status:', error.status);
        console.log('');

        if (error.message.includes('Email not confirmed')) {
            console.log('🔴 ISSUE: Email confirmation is STILL ENABLED in Supabase');
            console.log('');
            console.log('SOLUTION:');
            console.log('1. Go to: https://supabase.com/dashboard/project/pbphgfsjezgamukcgjpv/auth/providers');
            console.log('2. Click on "Email" provider');
            console.log('3. Scroll down to "Confirm email" toggle');
            console.log('4. Turn it OFF');
            console.log('5. Click Save');
            console.log('6. Try signing in again');
        } else if (error.message.includes('Invalid login credentials')) {
            console.log('🔴 POSSIBLE CAUSES:');
            console.log('');
            console.log('1. Email confirmation is required but not completed');
            console.log('   → Disable email confirmation in Supabase Dashboard');
            console.log('');
            console.log('2. Wrong password');
            console.log('   → Make sure you are using the same password you signed up with');
            console.log('');
            console.log('3. User account may not exist or was not created properly');
            console.log('   → Try signing up again with a different email');
            console.log('');
            console.log('RECOMMENDED ACTION:');
            console.log('→ Disable email confirmation in Supabase (see instructions above)');
            console.log('→ Then try signing up with a NEW email address');
        }
    } else {
        console.log('✅ Sign In Successful!\n');
        console.log('User ID:', data.user?.id);
        console.log('Email:', data.user?.email);
        console.log('Session created:', data.session ? 'Yes' : 'No');
    }
} catch (err) {
    console.error('❌ Unexpected error:', err.message);
}

console.log('\n' + '='.repeat(60));
console.log('QUICK FIX FOR DEVELOPMENT:');
console.log('='.repeat(60));
console.log('');
console.log('1. Disable email confirmation in Supabase Dashboard');
console.log('2. Sign up with a NEW email (e.g., yourname+test@gmail.com)');
console.log('3. You should be able to sign in immediately');
console.log('');
