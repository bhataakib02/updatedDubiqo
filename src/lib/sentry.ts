// Sentry error monitoring setup
// Install: npm install @sentry/react

/**
 * Initialize Sentry for error tracking
 * Call this in main.tsx before rendering the app
 */
export function initSentry() {
  // Only initialize in production or if DSN is provided
  const dsn = import.meta.env.VITE_SENTRY_DSN;

  if (!dsn) {
    if (import.meta.env.DEV) {
      console.log('Sentry DSN not configured. Error tracking disabled.');
    }
    return;
  }

  // Dynamic import to avoid bundling Sentry in development
  import('@sentry/react')
    .then((Sentry) => {
      Sentry.init({
        dsn,
        environment: import.meta.env.MODE,
        integrations: [
          Sentry.browserTracingIntegration(),
          Sentry.replayIntegration({
            maskAllText: true,
            blockAllMedia: true,
          }),
        ],
        tracesSampleRate: import.meta.env.PROD ? 0.1 : 1.0,
        replaysSessionSampleRate: 0.1,
        replaysOnErrorSampleRate: 1.0,
      });

      // Make Sentry available globally for ErrorBoundary
      if (typeof window !== 'undefined') {
        window.Sentry = {
          captureException: (error: Error, context?: Record<string, unknown>) => {
            Sentry.captureException(error, context);
          },
        };
      }
    })
    .catch((err) => {
      console.error('Failed to initialize Sentry:', err);
    });
}

/**
 * Log an error to Sentry
 */
export function logError(error: Error, context?: Record<string, unknown>) {
  if (window.Sentry) {
    window.Sentry.captureException(error, { extra: context });
  } else {
    console.error('Error:', error, context);
  }
}
