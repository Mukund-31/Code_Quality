# Code Quality - AI-Powered Code Review Platform

A modern, full-stack web application for AI-powered code reviews with team collaboration features. Built with React, Vite, GSAP animations, and Supabase backend.

## 🚀 Quick Start

### Prerequisites
- Node.js v16+ 
- npm or yarn
- Supabase account
- Cloudflare Worker (for AI features)

### Installation

```bash
# Clone the repository
git clone https://github.com/Mukund-31/Code_Quality.git
cd Code_Quality

# Install dependencies
npm install

# Create environment file
cp .env.example .env
```

### Environment Setup

Create a `.env` file in the root directory:

```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### Database Setup

Run the following SQL in your Supabase SQL Editor:

```sql
-- Create profiles table
CREATE TABLE profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  name TEXT,
  avatar_url TEXT,
  company TEXT,
  role TEXT,
  plan TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Public profiles viewable" ON profiles FOR SELECT USING (true);
CREATE POLICY "Users insert own profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users update own profile" ON profiles FOR UPDATE USING (auth.uid() = id);

-- Create work sessions table
CREATE TABLE work_sessions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  session_date DATE NOT NULL,
  started_at TIMESTAMPTZ DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  CONSTRAINT work_sessions_user_date_unique UNIQUE (user_id, session_date)
);

ALTER TABLE work_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own sessions" ON work_sessions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own sessions" ON work_sessions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create review events table
CREATE TABLE review_events (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id UUID NOT NULL REFERENCES work_sessions(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  payload JSONB NOT NULL DEFAULT '{}'::jsonb,
  result_summary TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE review_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own review events" ON review_events 
  FOR SELECT USING (
    session_id IN (SELECT id FROM work_sessions WHERE user_id = auth.uid())
  );

-- Create teams table
CREATE TABLE teams (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  owner_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  visibility TEXT DEFAULT 'private',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE teams ENABLE ROW LEVEL SECURITY;

-- Create team members table
CREATE TABLE team_members (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member',
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(team_id, user_id)
);

ALTER TABLE team_members ENABLE ROW LEVEL SECURITY;

-- Create team tasks table
CREATE TABLE team_tasks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  team_id UUID NOT NULL REFERENCES teams(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  assigned_to UUID REFERENCES auth.users(id),
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status TEXT DEFAULT 'todo',
  priority TEXT DEFAULT 'medium',
  due_date DATE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE team_tasks ENABLE ROW LEVEL SECURITY;
```

### Run the Application

```bash
# Development mode
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

Visit `http://localhost:3000` to see the application.

---

## 📁 Project Structure

```
Code_Quality/
├── public/                 # Static assets
├── src/
│   ├── components/
│   │   ├── animations/    # Reusable animation components
│   │   │   ├── AnimatedCard.jsx
│   │   │   ├── ParallaxSection.jsx
│   │   │   └── ScrollReveal.jsx
│   │   ├── layout/        # Layout components
│   │   │   ├── Header.jsx
│   │   │   └── Footer.jsx
│   │   ├── sections/      # Main page sections
│   │   │   ├── Hero.jsx
│   │   │   ├── Features.jsx
│   │   │   ├── HowItWorks.jsx
│   │   │   └── Pricing.jsx
│   │   └── ui/            # Reusable UI components
│   │       ├── Badge.jsx
│   │       ├── Button.jsx
│   │       ├── Card.jsx
│   │       ├── Container.jsx
│   │       └── GradientText.jsx
│   ├── contexts/          # React contexts
│   │   └── AuthContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useGSAP.js
│   │   ├── useMagneticEffect.js
│   │   └── useScrollAnimation.js
│   ├── lib/               # Libraries and utilities
│   │   └── supabase.js
│   ├── pages/             # Page components
│   │   ├── Dashboard.jsx
│   │   ├── SignIn.jsx
│   │   └── SignUp.jsx
│   ├── utils/             # Utility functions
│   │   └── animations.js
│   ├── styles/            # Global styles
│   │   └── index.css
│   ├── App.jsx            # Main app component
│   └── main.jsx           # Entry point
├── supabase/              # Supabase migrations and functions
├── .env.example           # Environment variables template
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

---

## ✨ Features

### 🎨 Frontend Features
- **Modern UI/UX**: Built with React 18 and TailwindCSS
- **Advanced Animations**: GSAP 3 with ScrollTrigger for smooth, professional animations
- **Responsive Design**: Mobile-first approach, works on all devices
- **Dark Mode Ready**: Designed with dark theme aesthetics
- **Component Library**: Reusable UI components (Button, Card, Badge, etc.)
- **Magnetic Effects**: Interactive hover effects on buttons
- **Parallax Scrolling**: Smooth parallax backgrounds
- **3D Card Transforms**: Interactive card tilt effects

### 🔐 Authentication
- **Email/Password**: Standard authentication
- **OAuth Support**: Google and GitHub sign-in
- **Session Management**: Persistent sessions across page refreshes
- **Protected Routes**: Dashboard and user-specific pages
- **Profile Management**: Auto-created user profiles

### 💾 Backend Integration (Supabase)
- **PostgreSQL Database**: Robust relational database
- **Row Level Security**: Secure data access policies
- **Real-time Subscriptions**: Live data updates
- **File Storage**: Avatar and document uploads
- **Edge Functions**: Serverless functions for backend logic

### 🤖 AI-Powered Features
- **Code Review Analytics**: AI-powered insights on your review history
- **Gemini 2.5 Flash**: Advanced AI model for code analysis
- **Natural Language Queries**: Ask questions about your review data
- **Review Summaries**: Automatic summarization of code reviews

### 👥 Team Collaboration
- **Team Management**: Create and manage development teams
- **Task Board**: Kanban-style task management (To Do, In Progress, Review, Done)
- **Task Assignment**: Assign tasks to team members
- **Priority Levels**: Low, Medium, High priority tasks
- **Due Dates**: Track task deadlines
- **Team Roles**: Owner and member permissions

### 📊 Dashboard Features
- **Personal Review Dashboard**: View your code review history
- **Review Statistics**: Total sessions, reviews, local/GitHub reviews
- **Session Timeline**: Organized by date with expandable details
- **AI Analytics**: Query your review data with natural language
- **Team Task Board**: Manage team tasks and track progress
- **Quick Actions**: Fast access to common features

---

## 🎯 Tech Stack

### Frontend
- **React 18** - UI Framework
- **Vite** - Build tool and dev server
- **GSAP 3** - Advanced animations
- **TailwindCSS** - Utility-first CSS
- **React Router** - Client-side routing
- **Lucide React** - Beautiful icons

### Backend
- **Supabase** - Backend as a Service
  - PostgreSQL database
  - Authentication
  - Real-time subscriptions
  - Row Level Security
  - Storage

### AI Integration
- **Cloudflare Workers** - Serverless API
- **Google Gemini 2.5 Flash** - AI model for code analysis

---

## 🎬 Animation System

### Available Animation Utilities

#### Basic Animations
```javascript
import { fadeInUp, fadeInLeft, fadeInRight, scaleIn } from './utils/animations';

fadeInUp('.element', { y: 60, duration: 1 });
fadeInLeft('.element', { x: -60, duration: 1 });
scaleIn('.element', { scale: 0.8, duration: 0.8 });
```

#### Scroll-Triggered Animations
```javascript
import { scrollReveal, parallax } from './utils/animations';

scrollReveal('.element', {
  y: 100,
  opacity: 0,
  scrollTrigger: { trigger: '.element', start: 'top 80%' }
});

parallax('.background', { yPercent: -50 });
```

#### Interactive Effects
```javascript
import { magneticEffect, cardTilt } from './utils/animations';

const cleanup = magneticEffect(buttonElement, 0.5);
const cleanup2 = cardTilt(cardElement);
```

### Custom Hooks
```javascript
import { useGSAP, useScrollAnimation, useMagneticEffect } from './hooks';

// Auto-cleanup GSAP animations
useGSAP(() => {
  gsap.from('.element', { y: 50, opacity: 0 });
}, []);

// Scroll animation hook
const ref = useScrollAnimation({ y: 100, opacity: 0 });

// Magnetic effect hook
const buttonRef = useMagneticEffect(0.3);
```

---

## 🔧 Configuration

### Tailwind Configuration
Customize colors, fonts, and animations in `tailwind.config.js`:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: { /* Your colors */ },
        dark: { /* Your colors */ }
      },
      animation: {
        'gradient': 'gradient 8s linear infinite',
        'float': 'float 6s ease-in-out infinite'
      }
    }
  }
}
```

### Vite Configuration
Build settings in `vite.config.js`:

```javascript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
```

---

## 🚦 User Flow

### New User Journey
1. Visit landing page
2. Click "Get Started" → Sign up page
3. Create account (email/password or OAuth)
4. Auto-redirect to dashboard
5. Explore features and create reviews

### Existing User Journey
1. Click "Sign In" → Login page
2. Enter credentials or use OAuth
3. Redirect to dashboard
4. View review history and team tasks
5. Ask AI questions about reviews
6. Manage team tasks (if team owner)

---

## 📊 Database Schema

### Core Tables

#### profiles
- User profile information
- Links to auth.users
- Stores plan type (free, pro, elite)

#### work_sessions
- Code review sessions
- One per user per day
- Tracks start and end times

#### review_events
- Individual review events
- Links to work_sessions
- Stores review summaries and metadata

#### teams
- Team information
- Owner and visibility settings

#### team_members
- Team membership
- User roles (owner, member)

#### team_tasks
- Kanban board tasks
- Status, priority, assignments
- Due dates and descriptions

---

## 🔐 Security

### Row Level Security (RLS)
All tables have RLS policies:
- Users can only access their own data
- Team members can view team data
- Team owners can manage team tasks
- Public profiles are viewable by all

### Authentication
- Secure JWT tokens via Supabase
- OAuth integration with Google/GitHub
- Session persistence with secure cookies
- Protected routes with auth checks

---

## 🎨 UI Components

### Button Component
```jsx
<Button variant="primary" size="md" magnetic>
  Click Me
</Button>
```
Variants: primary, secondary, outline, ghost
Sizes: sm, md, lg

### Card Component
```jsx
<Card hover gradient>
  Content here
</Card>
```

### GradientText Component
```jsx
<GradientText 
  from="from-primary-400"
  via="via-purple-400"
  to="to-pink-400"
  animate
>
  Beautiful Text
</GradientText>
```

### Badge Component
```jsx
<Badge variant="success" size="md">
  Active
</Badge>
```
Variants: primary, success, warning, danger, info

---

## 🤖 AI Integration

### Cloudflare Worker Setup

The application uses a Cloudflare Worker for AI queries:

**Worker URL**: `https://sarvi.hi-codequality.workers.dev/`

**Environment Variables** (set in Cloudflare Dashboard):
```
GEMINI_API_KEY=your_gemini_api_key
SUPABASE_URL=your_supabase_url
SUPABASE_SERVICE_KEY=your_service_key
```

**Request Format**:
```javascript
{
  model: 'gemini-2.5-flash',
  messages: [
    {
      role: 'user',
      content: 'Your question about code reviews'
    }
  ],
  temperature: 0.7,
  max_tokens: 1000
}
```

### AI Query Examples
- "How many reviews did I do this week?"
- "What are my most common code issues?"
- "What files do I review most often?"
- "Show me my review patterns"

---

## 👥 Team Features

### For Team Owners (Elite Plan)
- Create and manage teams
- Invite team members
- Create, update, and delete tasks
- Assign tasks to members
- Set task priorities and due dates
- Full board management

### For Team Members (Pro/Elite Plan)
- View team tasks
- See task assignments
- Track task progress
- Monitor deadlines

### Task Board Columns
1. **To Do** - New tasks
2. **In Progress** - Active work
3. **Review** - Ready for review
4. **Done** - Completed tasks

---

## 🐛 Troubleshooting

### Common Issues

#### "Missing Supabase env vars" warning
- Check `.env` file exists in project root
- Verify variable names start with `VITE_`
- Restart dev server after changing `.env`

#### OAuth not working
- Verify OAuth providers enabled in Supabase
- Check redirect URLs match exactly
- Ensure client IDs and secrets are correct

#### Can't access dashboard
- Check if user is authenticated
- Look for errors in browser console
- Verify Supabase connection

#### Reviews not showing
- Ensure plugin is logging telemetry
- Check `work_sessions` and `review_events` tables
- Verify RLS policies allow data access

#### AI queries failing
- Verify Cloudflare Worker is deployed
- Check GEMINI_API_KEY is set
- Ensure review data exists in database

### Debug Checklist
- [ ] Environment variables set correctly
- [ ] Database tables created
- [ ] RLS policies applied
- [ ] Supabase connection working
- [ ] Authentication functioning
- [ ] No console errors
- [ ] Network requests succeeding

---

## 📱 Responsive Design

All components are mobile-first and fully responsive:
- **Mobile**: < 768px
- **Tablet**: 768px - 1024px
- **Desktop**: > 1024px

---

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

---

## ⚡ Performance

### Optimizations
- Hardware-accelerated animations (`transform-gpu`)
- Lazy loading for images and components
- Code splitting with React Router
- Optimized bundle size with Vite
- ScrollTrigger lifecycle management

### Best Practices
- Use `transform` and `opacity` for animations
- Batch animations with timelines
- Cleanup animations in useEffect
- Debounce resize events
- Monitor with Chrome DevTools

---

## 🎯 Roadmap

### Planned Features
- [ ] Task comments and activity log
- [ ] Task attachments
- [ ] Time tracking for tasks
- [ ] Sprint planning features
- [ ] Advanced review analytics with charts
- [ ] Export review data (CSV/PDF)
- [ ] Slack/Discord notifications
- [ ] Email notifications
- [ ] Dark mode toggle
- [ ] Custom themes
- [ ] API documentation
- [ ] Mobile app (React Native)

---

## 📚 Additional Resources

- [GSAP Documentation](https://gsap.com/docs/)
- [React Documentation](https://react.dev/)
- [Supabase Documentation](https://supabase.com/docs)
- [TailwindCSS Documentation](https://tailwindcss.com/)
- [Vite Documentation](https://vitejs.dev/)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 👨‍💻 Authors

- **Mukund** - [GitHub](https://github.com/Mukund-31)
- **Shashidhar Sarvi** - [GitHub](https://github.com/ShashidharSarvi)

---

## 🙏 Acknowledgments

- Inspired by CodeRabbit.ai
- Built with amazing open-source tools
- Community feedback and contributions

---

## 📞 Support

For support, please open an issue on GitHub or contact the maintainers.

---

**Happy Coding! 🚀**
