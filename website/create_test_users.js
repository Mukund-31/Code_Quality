import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';

// Load .env file
const envPath = path.resolve(process.cwd(), '.env');
if (fs.existsSync(envPath)) {
    dotenv.config({ path: envPath });
} else {
    console.log('Warning: .env file not found. Relying on process.env');
}

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error('Error: VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are required.');
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

const users = [
    { email: 'shashidhars.cd22@rvce.edu.in', password: '123456', plan: 'free' }, // Changed password to meet min length usually
    { email: 'ishashisarvi@gmail.com', password: '123456', plan: 'pro' },
    { email: 'billy973171@gmail.com', password: '123456', plan: 'elite' }
];

async function createUsers() {
    console.log('Creating test users...');

    for (const user of users) {
        console.log(`\nProcessing ${user.email}...`);

        // 1. Sign Up
        const { data, error } = await supabase.auth.signUp({
            email: user.email,
            password: user.password,
            options: {
                data: {
                    name: user.email.split('@')[0],
                    plan: user.plan // Pass plan in metadata initially
                }
            }
        });

        if (error) {
            console.error(`Error creating ${user.email}:`, error.message);
        } else if (data.user) {
            if (data.user.identities && data.user.identities.length === 0) {
                console.log(`User ${user.email} already exists.`);
            } else {
                console.log(`User ${user.email} created successfully!`);
            }
        }
    }

    console.log('\nDone! Now run the SQL script to ensure plans are set in the profiles table.');
}

createUsers();
