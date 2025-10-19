import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";

// Performance monitoring setup
function reportWebVitals(metric) {
  if (process.env.NODE_ENV === 'production') {
    // Log Core Web Vitals for performance monitoring
    console.log(metric);
    
    // In a real app, you might send this to an analytics service:
    // analytics.track('Web Vitals', metric);
  }
}

// Error reporting for unhandled errors
window.addEventListener('error', (event) => {
  console.error('Unhandled error in Solar Calculator:', event.error);
  
  if (process.env.NODE_ENV === 'production') {
    // In production, you might want to send errors to a monitoring service
    // errorReporting.captureException(event.error);
  }
});

// Handle unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection in Solar Calculator:', event.reason);
  
  if (process.env.NODE_ENV === 'production') {
    // Log promise rejections in production
    // errorReporting.captureException(new Error(event.reason));
  }
});

// Initialize the React application
const root = ReactDOM.createRoot(document.getElementById("root"));

// Render with enhanced error handling
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Report web vitals for performance monitoring
if (process.env.NODE_ENV === 'production') {
  import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
    getCLS(reportWebVitals);
    getFID(reportWebVitals);
    getFCP(reportWebVitals);
    getLCP(reportWebVitals);
    getTTFB(reportWebVitals);
  }).catch(error => {
    console.warn('Web Vitals could not be loaded:', error);
  });
}

// Service Worker registration for offline functionality
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Solar Calculator SW registered:', registration.scope);
        
        // Handle updates to the service worker
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              // New content is available, notify the user
              if (window.confirm('New version available! Reload to get the latest features?')) {
                window.location.reload();
              }
            }
          });
        });
      })
      .catch((registrationError) => {
        console.log('Solar Calculator SW registration failed:', registrationError);
      });
  });
}

// Initialize application state and preferences
document.addEventListener('DOMContentLoaded', () => {
  // Set initial theme based on user preference or system setting
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const savedTheme = localStorage.getItem('solar-calc-theme');
  
  if (savedTheme) {
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  } else if (prefersDark) {
    document.documentElement.classList.add('dark');
  }
  
  // Listen for theme changes
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('solar-calc-theme')) {
      document.documentElement.classList.toggle('dark', e.matches);
    }
  });
  
  // Set up reduced motion preferences
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (prefersReducedMotion) {
    document.documentElement.style.setProperty('--animation-duration', '0.01ms');
  }
  
  // Initialize app metadata
  document.title = 'SolarCalc Lebanon - Professional Solar System Calculator';
  
  // Set up viewport meta tag for mobile optimization
  const viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    const meta = document.createElement('meta');
    meta.name = 'viewport';
    meta.content = 'width=device-width, initial-scale=1.0, maximum-scale=5.0, user-scalable=yes';
    document.head.appendChild(meta);
  }
});

// Export for potential testing
export { reportWebVitals };