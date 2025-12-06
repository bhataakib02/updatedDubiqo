# Setup Checklist

Use this checklist after implementing all missing items to ensure everything is configured correctly.

## Initial Setup

- [ ] Run `npm install` to install all new dependencies
- [ ] Run `npm run prepare` to set up Husky Git hooks
- [ ] Copy `.env.example` to `.env` and fill in all required variables
- [ ] Verify environment variables using `src/lib/env.ts` validation

## Database Setup

- [ ] Run `npm run migrate` to apply database migrations
- [ ] Run `npm run seed` to populate database with sample data (optional)
- [ ] Verify RLS policies are enabled in Supabase dashboard
- [ ] Test database connection

## Testing

- [ ] Run `npm run test:unit` - should pass
- [ ] Run `npm run test:e2e` - should pass (may need `npx playwright install` first)
- [ ] Run `npm run test:coverage` - check coverage report
- [ ] Verify test files are working correctly

## Code Quality

- [ ] Run `npm run lint` - fix any linting errors
- [ ] Run `npm run format` - format all code
- [ ] Run `npm run format:check` - verify formatting
- [ ] Run `npm run type-check` - fix any TypeScript errors (strict mode enabled)

## CI/CD Setup

- [ ] Add GitHub repository secrets:
  - `SUPABASE_ACCESS_TOKEN`
  - `SUPABASE_PROJECT_REF`
  - `VERCEL_TOKEN` (if using Vercel)
  - `VERCEL_ORG_ID`
  - `VERCEL_PROJECT_ID`
  - `LHCI_GITHUB_APP_TOKEN` (optional, for Lighthouse CI)
- [ ] Test CI workflow by creating a pull request
- [ ] Verify workflows run successfully

## Error Monitoring

- [ ] Create Sentry account (optional but recommended)
- [ ] Add `VITE_SENTRY_DSN` to environment variables
- [ ] Test error boundary by triggering an error
- [ ] Verify errors are logged to Sentry (if configured)

## Edge Functions

- [ ] Deploy Edge Functions to Supabase:
  ```bash
  supabase functions deploy bookings-create
  supabase functions deploy webhooks-stripe
  supabase functions deploy ai-insights
  supabase functions deploy ticket-reply
  supabase functions deploy ai-ticket-assist
  supabase functions deploy presign-upload
  ```
- [ ] Set Edge Function environment variables in Supabase dashboard:
  - `OPENAI_API_KEY` (for AI functions)
  - `STRIPE_SECRET_KEY` (for Stripe webhooks)
  - `STRIPE_WEBHOOK_SECRET` (for Stripe webhooks)
- [ ] Test each Edge Function endpoint

## Admin Pages

- [ ] Add `<AdminMeta />` component to all admin pages:
  - `src/pages/admin/Dashboard.tsx`
  - `src/pages/admin/Users.tsx`
  - `src/pages/admin/Projects.tsx`
  - `src/pages/admin/Quotes.tsx`
  - `src/pages/admin/Bookings.tsx`
  - `src/pages/admin/Invoices.tsx`
  - `src/pages/admin/Tickets.tsx`
  - `src/pages/admin/Downloads.tsx`
- [ ] Verify admin pages have `noindex, nofollow` meta tags
- [ ] Test that admin pages are not accessible without proper role

## Assets

- [ ] Create `favicon.ico` and place in `public/` directory
- [ ] Verify `sitemap.xml` is accessible at `/sitemap.xml`
- [ ] Verify `manifest.json` is accessible at `/manifest.json`
- [ ] Test PWA installation (if implementing service worker)

## Documentation

- [ ] Review and update documentation in `docs/` directory
- [ ] Add API documentation for new Edge Functions
- [ ] Update README.md if needed
- [ ] Document any custom configurations

## Production Deployment

- [ ] Build production bundle: `npm run build`
- [ ] Test production build locally: `npm run preview`
- [ ] Deploy to hosting provider (Vercel/Netlify)
- [ ] Verify production environment variables are set
- [ ] Test production deployment
- [ ] Set up monitoring and alerts
- [ ] Configure backup strategy

## Security

- [ ] Review and test RLS policies
- [ ] Verify admin routes are protected
- [ ] Test authentication and authorization
- [ ] Review environment variables for sensitive data
- [ ] Set up security headers (if using custom server)
- [ ] Enable HTTPS/SSL

## Performance

- [ ] Run Lighthouse audit
- [ ] Check bundle size
- [ ] Test page load times
- [ ] Optimize images (if any)
- [ ] Set up CDN (if needed)

## Final Verification

- [ ] All tests pass
- [ ] No linting errors
- [ ] No TypeScript errors
- [ ] All Edge Functions deployed
- [ ] Environment variables configured
- [ ] Documentation complete
- [ ] Production deployment successful

---

**Note:** Some items may require additional configuration based on your specific setup and requirements.
