import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Hero from './components/sections/Hero';
import Features from './components/sections/Features';
import HowItWorks from './components/sections/HowItWorks';
import Pricing from './components/sections/Pricing';
import SignIn from './pages/SignIn';
import SignUp from './pages/SignUp';
import Dashboard from './pages/Dashboard';

// Landing Page Component
const LandingPage = () => (
  <>
    <Hero />
    <Features />
    <HowItWorks />
    <Pricing />
  </>
);

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-dark-950">
          <Header />
          <main>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/signin" element={<SignIn />} />
              <Route path="/signup" element={<SignUp />} />
              <Route path="/dashboard" element={<Dashboard />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
