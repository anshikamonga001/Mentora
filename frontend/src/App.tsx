import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider } from 'styled-components';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './contexts/AuthContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { theme } from './styles/theme';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import NewsletterPopup from './components/common/NewsletterPopup';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import AskZone from './pages/AskZone';
import Sessions from './pages/Sessions';
import AnswerZone from './pages/AnswerZone';
import Mentors from './pages/Mentors';
import Freelance from './pages/Freelance';
import Admin from './pages/Admin';
import ContactUs from './pages/ContactUs';
import ProtectedRoute from './components/common/ProtectedRoute';
import { GoogleOAuthProvider } from '@react-oauth/google';

// Create a client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID!}>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <Router>
            <GlobalStyles />
            <div className="App">
              <Navbar />
              <main style={{ minHeight: '100vh' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/contact" element={<ContactUs />} />
                  <Route
                    path="/dashboard"
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/profile"
                    element={
                      <ProtectedRoute>
                        <Profile />
                      </ProtectedRoute>
                    }
                  />
                  {/* Ask Zone - Available to students and tutors */}
                  <Route
                    path="/ask-zone"
                    element={
                      <ProtectedRoute>
                        <AskZone />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/answer-zone"
                    element={
                      <ProtectedRoute requiredRole="tutor">
                        <AnswerZone />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/ask-zone/question/:id"
                    element={
                      <ProtectedRoute>
                        <AskZone />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Mentors - Available to students and tutors */}
                  <Route
                    path="/mentors"
                    element={
                      <ProtectedRoute>
                        <Mentors />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/mentors/:id"
                    element={
                      <ProtectedRoute>
                        <Mentors />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Freelance - Available to freelancers and clients */}
                  <Route
                    path="/freelance"
                    element={
                      <ProtectedRoute>
                        <Freelance />
                      </ProtectedRoute>
                    }
                  />
                  <Route
                    path="/freelance/project/:id"
                    element={
                      <ProtectedRoute>
                        <Freelance />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Messages - Available to all authenticated users */}
                  <Route
                    path="/messages"
                    element={
                      <ProtectedRoute>
                        <div>Messages Component - Coming Soon</div>
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Sessions - Available to students and tutors */}
                  <Route
                    path="/sessions"
                    element={
                      <ProtectedRoute>
                        <Sessions />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Unauthorized page */}
                  <Route
                    path="/unauthorized"
                    element={
                      <div style={{ 
                        display: 'flex', 
                        justifyContent: 'center', 
                        alignItems: 'center', 
                        height: '100vh',
                        flexDirection: 'column',
                        gap: '20px'
                      }}>
                        <h1>Unauthorized Access</h1>
                        <p>You don't have permission to access this page.</p>
                        <button onClick={() => window.history.back()}>Go Back</button>
                      </div>
                    }
                  />
                  <Route
                    path="/admin"
                    element={
                      <ProtectedRoute requiredRole="admin">
                        <Admin />
                      </ProtectedRoute>
                    }
                  />
                  
                  {/* Catch all route */}
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <Footer />
              <NewsletterPopup />
              <Toaster
                position="top-right"
                toastOptions={{
                  duration: 4000,
                  style: {
                    background: '#1e293b',
                    color: '#f8fafc',
                    borderRadius: '0.75rem',
                    border: '1px solid #334155',
                    fontSize: '0.9rem',
                    fontFamily: "'Plus Jakarta Sans', sans-serif",
                    fontWeight: 500,
                    boxShadow: '0 8px 32px rgba(0,0,0,0.2)',
                  },
                  success: {
                    iconTheme: { primary: '#6366f1', secondary: '#fff' },
                  },
                }}
              />
            </div>
            </Router>
      </AuthProvider>
    </ThemeProvider>
  </GoogleOAuthProvider>
</QueryClientProvider>
  );
}

export default App;
