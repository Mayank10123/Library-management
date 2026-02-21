import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LibraryProvider } from './context/LibraryContext';
import { ToastProvider } from './context/ToastContext';
import { ThemeProvider } from './context/ThemeContext';
import { ContextMenuProvider } from './components/ui/ContextMenu';
import ErrorBoundary from './components/ui/ErrorBoundary';
import LoadingSkeleton from './components/ui/LoadingSkeleton';
import CommandPalette from './components/ui/CommandPalette';
import ThemePanel from './components/ui/ThemePanel';
import OnboardingTour from './components/ui/OnboardingTour';
import Layout from './components/layout/Layout';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import BooksPage from './pages/BooksPage';
import AddBookPage from './pages/AddBookPage';
import IssuePage from './pages/IssuePage';
import ReturnPage from './pages/ReturnPage';
import MembersPage from './pages/MembersPage';
import AddMemberPage from './pages/AddMemberPage';
import MemberProfilePage from './pages/MemberProfilePage';
import ReservationsPage from './pages/ReservationsPage';
import FinesPage from './pages/FinesPage';
import ReportsPage from './pages/ReportsPage';
import NotificationsPage from './pages/NotificationsPage';
import CalendarPage from './pages/CalendarPage';
import TimelinePage from './pages/TimelinePage';
import EbookStorePage from './pages/EbookStorePage';
import SettingsPage from './pages/SettingsPage';

const ProtectedRoute: React.FC<{ children: React.ReactNode; roles?: string[] }> = ({ children, roles }) => {
  const { isAuthenticated, user } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (roles && user && !roles.includes(user.role)) return <Navigate to="/" replace />;
  return <>{children}</>;
};

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <>
      <CommandPalette />
      <ThemePanel />
      <OnboardingTour />
      <AnimatePresence mode="wait">
        <Routes>
          <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <LoginPage />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<DashboardPage />} />
            <Route path="books" element={<BooksPage />} />
            <Route path="books/add" element={<ProtectedRoute roles={['admin', 'librarian']}><AddBookPage /></ProtectedRoute>} />
            <Route path="issue" element={<ProtectedRoute roles={['admin', 'librarian']}><IssuePage /></ProtectedRoute>} />
            <Route path="return" element={<ProtectedRoute roles={['admin', 'librarian']}><ReturnPage /></ProtectedRoute>} />
            <Route path="members" element={<ProtectedRoute roles={['admin', 'librarian']}><MembersPage /></ProtectedRoute>} />
            <Route path="members/add" element={<ProtectedRoute roles={['admin', 'librarian']}><AddMemberPage /></ProtectedRoute>} />
            <Route path="members/:id" element={<ProtectedRoute roles={['admin', 'librarian']}><MemberProfilePage /></ProtectedRoute>} />
            <Route path="reservations" element={<ReservationsPage />} />
            <Route path="fines" element={<ProtectedRoute roles={['admin', 'librarian']}><FinesPage /></ProtectedRoute>} />
            <Route path="reports" element={<ProtectedRoute roles={['admin']}><ReportsPage /></ProtectedRoute>} />
            <Route path="notifications" element={<NotificationsPage />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route path="timeline" element={<TimelinePage />} />
            <Route path="ebooks" element={<EbookStorePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AnimatePresence>
    </>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 900);
    return () => clearTimeout(timer);
  }, []);

  if (loading) return <LoadingSkeleton />;

  return (
    <ErrorBoundary>
      <BrowserRouter>
        <ThemeProvider>
          <AuthProvider>
            <LibraryProvider>
              <ToastProvider>
                <ContextMenuProvider>
                  <AppRoutes />
                </ContextMenuProvider>
              </ToastProvider>
            </LibraryProvider>
          </AuthProvider>
        </ThemeProvider>
      </BrowserRouter>
    </ErrorBoundary>
  );
};

export default App;
