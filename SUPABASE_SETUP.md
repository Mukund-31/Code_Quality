# Supabase Integration Guide

Complete guide to set up and use Supabase with your Code Quality website.

## 📋 Prerequisites

1. A Supabase account ([sign up here](https://supabase.com))
2. Node.js and npm installed
3. This project set up locally

## 🚀 Step-by-Step Setup

### 1. Create a Supabase Project

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Click "New Project"
3. Fill in:
   - **Name**: Code Quality
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to your users
4. Click "Create new project"
5. Wait for the project to be provisioned (~2 minutes)

### 2. Get Your API Credentials

1. In your Supabase project dashboard, go to **Settings** → **API**
2. Copy these values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (under "Project API keys")

### 3. Configure Environment Variables

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

⚠️ **Important**: Never commit `.env` to version control!

### 4. Install Dependencies

```bash
npm install
```

This will install `@supabase/supabase-js` along with other dependencies.

### 5. Set Up Database Tables

Go to **SQL Editor** in your Supabase dashboard and run these SQL commands:

#### Users Profile Table
```sql
-- Create profiles table (extends auth.users)
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can insert their own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);
```

#### Code Reviews Table (Example)
```sql
-- Create code_reviews table
CREATE TABLE code_reviews (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  repository_name TEXT NOT NULL,
  pull_request_number INTEGER NOT NULL,
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
  result JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE code_reviews ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own reviews"
  ON code_reviews FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own reviews"
  ON code_reviews FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON code_reviews FOR UPDATE
  USING (auth.uid() = user_id);
```

#### Subscriptions Table (Example)
```sql
-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'professional', 'enterprise')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'expired')),
  current_period_start TIMESTAMP WITH TIME ZONE,
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view their own subscription"
  ON subscriptions FOR SELECT
  USING (auth.uid() = user_id);
```

### 6. Set Up Authentication

#### Enable Email Authentication

1. Go to **Authentication** → **Providers**
2. Enable **Email** provider
3. Configure email templates (optional)

#### Enable OAuth Providers (Optional)

1. Go to **Authentication** → **Providers**
2. Enable providers you want (Google, GitHub, etc.)
3. Follow the setup instructions for each provider

**For Google:**
- Go to [Google Cloud Console](https://console.cloud.google.com)
- Create OAuth 2.0 credentials
- Add authorized redirect URI: `https://your-project-id.supabase.co/auth/v1/callback`

**For GitHub:**
- Go to GitHub Settings → Developer settings → OAuth Apps
- Create new OAuth App
- Add callback URL: `https://your-project-id.supabase.co/auth/v1/callback`

### 7. Configure Storage (Optional)

If you need file uploads (avatars, documents, etc.):

1. Go to **Storage** in Supabase dashboard
2. Create a new bucket (e.g., "avatars")
3. Set policies:

```sql
-- Allow authenticated users to upload
CREATE POLICY "Authenticated users can upload avatars"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'avatars' AND auth.role() = 'authenticated');

-- Allow public read access
CREATE POLICY "Anyone can view avatars"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');
```

## 💻 Usage Examples

### Authentication

#### Sign Up
```javascript
import { useAuth } from './contexts/AuthContext';

function SignUpComponent() {
  const { signUp } = useAuth();
  
  const handleSignUp = async () => {
    const { data, error } = await signUp(
      'user@example.com',
      'password123',
      { name: 'John Doe' }
    );
  };
}
```

#### Sign In
```javascript
const { signIn } = useAuth();

const handleSignIn = async () => {
  const { data, error } = await signIn('user@example.com', 'password123');
};
```

#### OAuth Sign In
```javascript
const { signInWithOAuth } = useAuth();

const handleGoogleSignIn = async () => {
  await signInWithOAuth('google');
};
```

#### Sign Out
```javascript
const { signOut } = useAuth();

const handleSignOut = async () => {
  await signOut();
};
```

### Data Operations

#### Fetch Data
```javascript
import { useSupabaseQuery } from './hooks/useSupabase';

function MyComponent() {
  const { data, loading, error } = useSupabaseQuery('code_reviews', {
    filters: { status: 'completed' },
    orderBy: { column: 'created_at', ascending: false },
    limit: 10,
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      {data?.map(review => (
        <div key={review.id}>{review.repository_name}</div>
      ))}
    </div>
  );
}
```

#### Insert Data
```javascript
import { useSupabaseMutation } from './hooks/useSupabase';

function CreateReview() {
  const { insert, loading } = useSupabaseMutation('code_reviews');

  const handleCreate = async () => {
    const { data, error } = await insert({
      repository_name: 'my-repo',
      pull_request_number: 123,
      status: 'pending',
    });
  };
}
```

#### Update Data
```javascript
const { update } = useSupabaseMutation('code_reviews');

const handleUpdate = async (id) => {
  const { data, error } = await update(id, {
    status: 'completed',
    result: { score: 95 },
  });
};
```

#### Delete Data
```javascript
const { remove } = useSupabaseMutation('code_reviews');

const handleDelete = async (id) => {
  const { error } = await remove(id);
};
```

### Real-time Subscriptions

```javascript
import { useSupabaseSubscription } from './hooks/useSupabase';

function RealtimeComponent() {
  useSupabaseSubscription(
    'code_reviews',
    (payload) => {
      console.log('Change received!', payload);
      // Update your UI based on the change
    },
    { event: 'INSERT' } // Listen for inserts only
  );
}
```

## 🔒 Security Best Practices

### Row Level Security (RLS)

Always enable RLS on your tables:

```sql
ALTER TABLE your_table ENABLE ROW LEVEL SECURITY;
```

### Policies

Create specific policies for each operation:

```sql
-- Read policy
CREATE POLICY "Users can read their own data"
  ON your_table FOR SELECT
  USING (auth.uid() = user_id);

-- Write policy
CREATE POLICY "Users can insert their own data"
  ON your_table FOR INSERT
  WITH CHECK (auth.uid() = user_id);
```

### Environment Variables

- Never commit `.env` files
- Use different credentials for development and production
- Rotate keys regularly

## 📊 Database Schema Design Tips

1. **Use UUIDs for primary keys**
   ```sql
   id UUID DEFAULT uuid_generate_v4() PRIMARY KEY
   ```

2. **Add timestamps**
   ```sql
   created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
   updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW())
   ```

3. **Use foreign keys**
   ```sql
   user_id UUID REFERENCES auth.users ON DELETE CASCADE
   ```

4. **Add indexes for performance**
   ```sql
   CREATE INDEX idx_reviews_user_id ON code_reviews(user_id);
   CREATE INDEX idx_reviews_created_at ON code_reviews(created_at DESC);
   ```

## 🧪 Testing

### Test Authentication
```bash
# Start dev server
npm run dev

# Navigate to /signin or /signup
# Test sign up, sign in, and sign out flows
```

### Test Database Operations
```javascript
// In your component
console.log('User:', user);
console.log('Data:', data);
```

## 🚀 Deployment

### Environment Variables on Vercel/Netlify

1. Add environment variables in your hosting platform:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`

2. Redeploy your application

### Production Checklist

- [ ] RLS enabled on all tables
- [ ] Policies tested and working
- [ ] Environment variables set
- [ ] OAuth redirect URLs configured
- [ ] Email templates customized
- [ ] Storage policies configured
- [ ] Database indexes added
- [ ] Backup strategy in place

## 📚 Additional Resources

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase JavaScript Client](https://supabase.com/docs/reference/javascript)
- [Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth](https://supabase.com/docs/guides/auth)

## 🐛 Troubleshooting

### "Invalid API key" error
- Check your `.env` file has correct values
- Restart dev server after changing `.env`

### Authentication not working
- Verify email provider is enabled in Supabase dashboard
- Check OAuth redirect URLs match exactly

### RLS blocking queries
- Check your policies allow the operation
- Use Supabase SQL Editor to test policies
- Ensure user is authenticated

### Real-time not working
- Check if Realtime is enabled for your table
- Verify your subscription code is correct
- Check browser console for errors

## 💡 Next Steps

1. Customize database schema for your needs
2. Add more authentication providers
3. Implement user profiles
4. Add file upload functionality
5. Set up email notifications
6. Implement subscription management
7. Add analytics and monitoring

Need help? Check the [Supabase Discord](https://discord.supabase.com) or [GitHub Discussions](https://github.com/supabase/supabase/discussions)!
