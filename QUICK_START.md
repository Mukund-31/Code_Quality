# Quick Start Guide 🚀

## Get Your App Running in 3 Steps

### Step 1: Verify Environment Variables ✅

Check that your `.env` file exists and has:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Step 2: Set Up Database 🗄️

Go to your Supabase SQL Editor and run:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);
```

### Step 3: Start Development Server 🎯

```bash
npm run dev
```

Visit `http://localhost:3000`

## Test the Flow

1. **Click "Get Started"** → Sign up page
2. **Create account** → Auto-redirects to dashboard
3. **Explore dashboard** → See your profile and stats
4. **Click "Sign Out"** → Returns to home page
5. **Click "Sign In"** → Login with your account

## Button Map 🗺️

### Home Page
- **Sign In** (header) → `/signin`
- **Get Started** (header) → `/signup`
- **Start Free Trial** (hero) → `/signup`
- **Watch Demo** (hero) → Scrolls to How It Works
- **Get Started** (pricing cards) → `/signup`

### When Logged In
- **Dashboard** (header) → `/dashboard`
- **Go to Dashboard** (hero) → `/dashboard`
- **Sign Out** (dashboard) → Logs out, returns to `/`

## OAuth Setup (Optional) 🔐

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com)
2. Create OAuth 2.0 credentials
3. Add redirect URI: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase Dashboard
5. Enable Google provider in Supabase → Authentication → Providers

### GitHub OAuth

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Create new OAuth App
3. Set callback URL: `https://your-project.supabase.co/auth/v1/callback`
4. Copy Client ID and Secret to Supabase Dashboard
5. Enable GitHub provider in Supabase → Authentication → Providers

## File Structure 📁

```
src/
├── pages/
│   ├── SignIn.jsx          # Login page
│   ├── SignUp.jsx          # Registration page
│   └── Dashboard.jsx       # User dashboard
├── contexts/
│   └── AuthContext.jsx     # Auth state management
├── lib/
│   └── supabase.js         # Supabase client
├── components/
│   ├── layout/
│   │   ├── Header.jsx      # Nav with auth buttons
│   │   └── Footer.jsx      # Footer
│   ├── sections/
│   │   ├── Hero.jsx        # Hero with CTA
│   │   ├── Features.jsx    # Features section
│   │   ├── HowItWorks.jsx  # How it works
│   │   └── Pricing.jsx     # Pricing cards
│   └── ui/
│       ├── Button.jsx      # Button component
│       ├── Card.jsx        # Card component
│       └── ...             # Other UI components
└── App.jsx                 # Main app with routes
```

## Common Issues & Fixes 🔧

### Issue: "Missing Supabase env vars"
**Fix:** Restart dev server after creating `.env` file

### Issue: Can't sign up
**Fix:** Check Supabase email provider is enabled

### Issue: OAuth not working
**Fix:** Verify redirect URLs match exactly in OAuth provider settings

### Issue: Dashboard shows loading forever
**Fix:** Check browser console for errors, verify Supabase connection

## What's Working ✅

- ✅ User registration (email + password)
- ✅ User login (email + password)
- ✅ OAuth (Google, GitHub) - if configured
- ✅ Session persistence
- ✅ Protected routes
- ✅ Sign out
- ✅ Profile auto-creation
- ✅ All button navigation
- ✅ Responsive design
- ✅ GSAP animations

## What's Next 🎯

Build these features:
1. Edit profile page
2. Settings page
3. Code review creation
4. GitHub/GitLab integration
5. Team management
6. Subscription management

## Need Help? 📚

- **Full Setup:** See `SUPABASE_SETUP.md`
- **Integration Details:** See `BACKEND_INTEGRATION.md`
- **Components:** See `COMPONENT_INDEX.md`
- **Animations:** See `ANIMATIONS_GUIDE.md`

## Ready to Go! 🎉

Your app is fully functional with:
- Beautiful UI with animations
- Complete authentication
- User dashboard
- Supabase backend
- All buttons connected

Start building your features! 🚀
