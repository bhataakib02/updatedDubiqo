# Dubiqo Website - Merged Project

This is the unified Dubiqo website combining features from both repositories.

## What's Included

### Core Features
- ✅ Modern React + TypeScript + Vite setup
- ✅ Tailwind CSS with custom design system
- ✅ Shadcn UI components
- ✅ React Router for navigation
- ✅ Responsive design throughout

### Pages
- Home / Landing page
- Services (with detailed service pages for Websites, Portfolios, Dashboards, Billing Systems, Troubleshooting, Maintenance)
- Portfolio & Case Studies
- Pricing
- About
- Blog
- Contact & Quote forms
- Booking system
- Support center
- FAQ
- Careers
- Client Portal (with authentication)
- Legal pages (Privacy, Terms, Refund, SLA)

### Integrations
- **Supabase** - Optional backend for authentication and database
- **EmailJS** - Email service for contact forms
- **ChatWidget** - Interactive support bot

## Getting Started

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   - Copy `.env.example` to `.env`
   - Add your Supabase credentials (optional, for auth features)
   - Add your EmailJS credentials (optional, for contact forms)

3. **Run development server:**
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/
│   ├── layout/         # Layout components (Navbar, Footer, Layout)
│   ├── ui/             # Shadcn UI components
│   └── ChatWidget.tsx  # Support chat widget
├── pages/
│   ├── services/       # Service detail pages
│   ├── legal/          # Legal pages
│   └── ...             # Other pages
├── integrations/
│   └── supabase/       # Supabase client & types
├── utils/
│   └── emailService.ts # EmailJS integration
└── hooks/              # Custom React hooks
```

## Key Features

### Design System
- Custom color palette with primary (purple) and secondary (neon blue) colors
- Glassmorphism effects
- Gradient utilities
- Responsive grid patterns
- Dark theme by default

### Authentication (Optional)
- Login/Signup with email
- OAuth (Google, GitHub) support
- Protected client portal
- Session management

Note: Authentication requires Supabase setup. The app works fine without it.

### Contact Forms
- EmailJS integration for sending emails
- Support request forms
- Quote calculator
- Contact page

Note: Email features require EmailJS setup. Forms will show an error without configuration.

## Deployment

Build for production:
```bash
npm run build
```

Preview production build:
```bash
npm run preview
```

## Environment Variables

```env
# Supabase (Optional - for authentication)
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-key

# EmailJS (Optional - for contact forms)
VITE_EMAILJS_SERVICE_ID=your-service-id
VITE_EMAILJS_TEMPLATE_ID_SUPPORT=your-support-template
VITE_EMAILJS_TEMPLATE_ID_CONTACT=your-contact-template
VITE_EMAILJS_TEMPLATE_ID_QUOTE=your-quote-template
VITE_EMAILJS_PUBLIC_KEY=your-public-key
```

## Technologies Used

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Shadcn UI
- React Router
- Supabase
- EmailJS
- Lucide Icons

## License

Private project for Dubiqo.
