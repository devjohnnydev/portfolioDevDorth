import { useEffect, lazy, Suspense } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useThemeStore } from './stores';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import CustomCursor from './components/shared/CustomCursor';

// Lazy load sections for performance
const Hero = lazy(() => import('./sections/Hero'));
const About = lazy(() => import('./sections/About'));
const Projects = lazy(() => import('./sections/Projects'));
const Skills = lazy(() => import('./sections/Skills'));
const Certifications = lazy(() => import('./sections/Certifications'));
const Dashboard = lazy(() => import('./sections/Dashboard'));
const ResumeGenerator = lazy(() => import('./sections/ResumeGenerator'));
const Contact = lazy(() => import('./sections/Contact'));

// Admin pages (lazy)
const AdminLogin = lazy(() => import('./pages/Admin/Login'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AllProjects = lazy(() => import('./pages/AllProjects'));
const AllCertifications = lazy(() => import('./pages/AllCertifications'));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function SectionLoader() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="w-8 h-8 border-2 border-[var(--color-primary)] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function PortfolioHome() {
  return (
    <>
      <Navbar />
      <main>
        <Suspense fallback={<SectionLoader />}>
          <Hero />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <About />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Skills />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Certifications />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Dashboard />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ResumeGenerator />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  const { initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <CustomCursor />
        <Routes>
          <Route path="/" element={<PortfolioHome />} />
          <Route
            path="/admin/login"
            element={
              <Suspense fallback={<SectionLoader />}>
                <AdminLogin />
              </Suspense>
            }
          />
          <Route
            path="/admin/*"
            element={
              <Suspense fallback={<SectionLoader />}>
                <AdminDashboard />
              </Suspense>
            }
          />
          <Route
            path="/projects"
            element={
              <Suspense fallback={<SectionLoader />}>
                <AllProjects />
              </Suspense>
            }
          />
          <Route
            path="/certifications"
            element={
              <Suspense fallback={<SectionLoader />}>
                <AllCertifications />
              </Suspense>
            }
          />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
