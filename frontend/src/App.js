import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from './components/ui/toaster';
import ErrorBoundary from './ErrorBoundary.jsx';

import LoadingSpinner from './LoadingSpinner.jsx';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import './App.css';

// Lazy load pages for better performance
const HomePage = lazy(() => import('./pages/HomePage'));
const CalculatorPage = lazy(() => import('./pages/CalculatorPage'));
const ResultsPage = lazy(() => import('./pages/ResultsPage'));
const TestConnection = lazy(() => import('./pages/TestConnection'));

// Loading component for page transitions
const PageLoadingFallback = () => (
  <div className="min-h-screen bg-gradient-to-br from-sky-50 to-amber-50 flex items-center justify-center">
    <div className="text-center">
      <LoadingSpinner size="lg" />
      <div className="mt-4 text-lg font-medium text-gray-700">Loading Solar Calculator...</div>
      <div className="text-sm text-gray-500 mt-2">Preparing Lebanese solar analysis tools</div>
    </div>
  </div>
);

// Error fallback component
const ErrorFallback = ({ error, resetError }) => (
  <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-50 flex items-center justify-center px-4">
    <div className="text-center max-w-md">
      <div className="text-red-600 mb-4">
        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" 
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h1 className="text-2xl font-bold text-gray-900 mb-4">Something went wrong</h1>
      <p className="text-gray-600 mb-6">
        We encountered an error while loading the solar calculator. Please try refreshing the page.
      </p>
      <div className="space-y-3">
        <button 
          onClick={resetError}
          className="btn-solar w-full"
        >
          Try Again
        </button>
        <button 
          onClick={() => window.location.reload()}
          className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Refresh Page
        </button>
      </div>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-6 text-left">
          <summary className="text-sm text-gray-500 cursor-pointer">Error Details</summary>
          <pre className="text-xs text-red-600 mt-2 p-2 bg-red-50 rounded overflow-auto">
            {error?.message}
          </pre>
        </details>
      )}
    </div>
  </div>
);

function App() {
  return (
    <HelmetProvider>
      <Router>
        <ErrorBoundary fallback={ErrorFallback}>
          <div className="App">
            {/* Global SEO and metadata */}
            <Helmet>
              <title>SolarCalc Lebanon - Professional Solar System Calculator</title>
              <meta name="description" content="Design your perfect solar system for Lebanon with professional-grade calculations. Get accurate equipment specifications, cost analysis, and installation guidance based on real Lebanese solar data." />
              <meta name="keywords" content="solar calculator Lebanon, solar system design, Lebanese solar energy, solar panels Lebanon, solar cost calculator, renewable energy Lebanon" />
              <meta name="author" content="SolarCalc Lebanon" />
              <meta name="viewport" content="width=device-width, initial-scale=1.0" />
              
              {/* Open Graph tags for social sharing */}
              <meta property="og:title" content="SolarCalc Lebanon - Professional Solar System Calculator" />
              <meta property="og:description" content="Design your perfect solar system for Lebanon with professional-grade calculations using real Lebanese solar data." />
              <meta property="og:type" content="website" />
              <meta property="og:locale" content="en_US" />
              <meta property="og:site_name" content="SolarCalc Lebanon" />
              
              {/* Twitter Card tags */}
              <meta name="twitter:card" content="summary_large_image" />
              <meta name="twitter:title" content="SolarCalc Lebanon - Solar System Calculator" />
              <meta name="twitter:description" content="Professional solar system design for Lebanon with real data and accurate calculations." />
              
              {/* Favicon and app icons */}
              <link rel="icon" type="image/svg+xml" href="/solar-icon.svg" />
              <link rel="apple-touch-icon" href="/solar-icon-192.png" />
              <meta name="theme-color" content="#f59e0b" />
              
              {/* Preconnect to external domains for performance */}
              <link rel="preconnect" href="https://fonts.googleapis.com" />
              <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
              
              {/* Load Inter font for better typography */}
              <link 
                href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" 
                rel="stylesheet" 
              />
            </Helmet>

            <Suspense fallback={<PageLoadingFallback />}>
              <Routes>
                {/* Home page - Lebanese solar calculator landing */}
                <Route 
                  path="/" 
                  element={
                    <>
                      <Helmet>
                        <title>SolarCalc Lebanon - Professional Solar System Calculator</title>
                        <meta name="description" content="Design your perfect solar system for Lebanon. Get professional specifications, equipment recommendations, and installation guidance based on real Lebanese solar irradiance data and market conditions." />
                        <link rel="canonical" href="https://solarcalc-lebanon.com/" />
                      </Helmet>
                      <HomePage />
                    </>
                  } 
                />

                {/* Solar calculator page */}
                <Route 
                  path="/calculator" 
                  element={
                    <>
                      <Helmet>
                        <title>Solar System Calculator - SolarCalc Lebanon</title>
                        <meta name="description" content="Calculate your exact solar system requirements for Lebanon. Input your location, appliances, and preferences to get professional equipment specifications and cost estimates." />
                        <link rel="canonical" href="https://solarcalc-lebanon.com/calculator" />
                      </Helmet>
                      <CalculatorPage />
                    </>
                  } 
                />

                {/* Results page */}
                <Route 
                  path="/results" 
                  element={
                    <>
                      <Helmet>
                        <title>Solar System Design Results - SolarCalc Lebanon</title>
                        <meta name="description" content="Your professional solar system specifications for Lebanon including equipment details, installation guide, economic analysis, and technical documentation." />
                        <meta name="robots" content="noindex, nofollow" /> {/* Results are user-specific */}
                        <link rel="canonical" href="https://solarcalc-lebanon.com/results" />
                      </Helmet>
                      <ResultsPage />
                    </>
                  } 
                />

                {/* Backend Connection Test page - Development/Testing */}
                <Route 
                  path="/test" 
                  element={
                    <>
                      <Helmet>
                        <title>Backend Connection Test - SolarCalc Lebanon</title>
                        <meta name="robots" content="noindex, nofollow" />
                      </Helmet>
                      <TestConnection />
                    </>
                  } 
                />

                {/* Redirect old URLs or handle 404s */}
                <Route path="/home" element={<Navigate to="/" replace />} />
                <Route path="/calc" element={<Navigate to="/calculator" replace />} />
                <Route path="/design" element={<Navigate to="/calculator" replace />} />
                <Route path="/test-connection" element={<Navigate to="/test" replace />} />
                <Route path="/api-test" element={<Navigate to="/test" replace />} />
                
                {/* 404 fallback */}
                <Route 
                  path="*" 
                  element={
                    <div className="min-h-screen bg-gradient-to-br from-sky-50 to-amber-50 flex items-center justify-center px-4">
                      <div className="text-center max-w-md">
                        <Helmet>
                          <title>Page Not Found - SolarCalc Lebanon</title>
                          <meta name="description" content="The page you're looking for doesn't exist. Return to the Lebanese solar calculator homepage." />
                        </Helmet>
                        
                        <div className="text-amber-500 mb-6">
                          <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" 
                                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                        <p className="text-gray-600 mb-8">
                          The page you're looking for doesn't exist. Let's get you back to designing your solar system.
                        </p>
                        
                        <div className="space-y-3">
                          <button 
                            onClick={() => window.location.href = '/'}
                            className="btn-solar w-full"
                          >
                            Back to Homepage
                          </button>
                          <button 
                            onClick={() => window.location.href = '/calculator'}
                            className="w-full px-4 py-2 text-amber-600 hover:text-amber-700 font-medium transition-colors"
                          >
                            Start Solar Calculator
                          </button>
                        </div>
                      </div>
                    </div>
                  }
                />
              </Routes>
            </Suspense>

            {/* Global toast notifications */}
            <Toaster 
              position="bottom-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: '#ffffff',
                  color: '#1f2937',
                  border: '1px solid #e5e7eb',
                  borderRadius: '0.75rem',
                  fontSize: '0.875rem',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                },
                success: {
                  iconTheme: {
                    primary: '#10b981',
                    secondary: '#ffffff',
                  },
                  style: {
                    borderLeft: '4px solid #10b981',
                  },
                },
                error: {
                  iconTheme: {
                    primary: '#ef4444',
                    secondary: '#ffffff',
                  },
                  style: {
                    borderLeft: '4px solid #ef4444',
                  },
                },
                loading: {
                  iconTheme: {
                    primary: '#f59e0b',
                    secondary: '#ffffff',
                  },
                  style: {
                    borderLeft: '4px solid #f59e0b',
                  },
                },
              }}
            />

            {/* Service Worker Registration for offline functionality */}
            {process.env.NODE_ENV === 'production' && (
              <script
                dangerouslySetInnerHTML={{
                  __html: `
                    if ('serviceWorker' in navigator) {
                      window.addEventListener('load', () => {
                        navigator.serviceWorker.register('/sw.js')
                          .then((registration) => {
                            console.log('SW registered: ', registration);
                          })
                          .catch((registrationError) => {
                            console.log('SW registration failed: ', registrationError);
                          });
                      });
                    }
                  `,
                }}
              />
            )}

            {/* Analytics and performance monitoring */}
            {process.env.NODE_ENV === 'production' && (
              <>
                {/* Google Analytics or other analytics can be added here */}
                <script
                  dangerouslySetInnerHTML={{
                    __html: `
                      // Basic performance monitoring
                      window.addEventListener('load', () => {
                        if (window.performance) {
                          const loadTime = window.performance.timing.loadEventEnd - window.performance.timing.navigationStart;
                          console.log('Page load time:', loadTime + 'ms');
                          
                          // Report Core Web Vitals if needed
                          if ('PerformanceObserver' in window) {
                            const observer = new PerformanceObserver((list) => {
                              list.getEntries().forEach((entry) => {
                                if (entry.entryType === 'largest-contentful-paint') {
                                  console.log('LCP:', entry.startTime);
                                }
                              });
                            });
                            observer.observe({entryTypes: ['largest-contentful-paint']});
                          }
                        }
                      });
                    `,
                  }}
                />
              </>
            )}
          </div>
        </ErrorBoundary>
      </Router>
    </HelmetProvider>
  );
}

export default App;