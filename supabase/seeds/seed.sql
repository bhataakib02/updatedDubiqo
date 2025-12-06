-- Seed data for Dubiqo Digital Solutions
-- This file provides sample data for development and testing

-- Insert sample admin user (password: admin123 - change in production!)
-- Note: In production, create users through Supabase Auth UI or API
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin@dubiqo.com', crypt('admin123', gen_salt('bf')), now(), now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert admin profile
INSERT INTO public.profiles (id, full_name, company_name, phone, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'Admin User', 'Dubiqo Digital Solutions', '+1-555-0100', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Insert admin role
INSERT INTO public.user_roles (user_id, role, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000001', 'admin', now())
ON CONFLICT (user_id) DO NOTHING;

-- Insert sample client user
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'client@example.com', crypt('client123', gen_salt('bf')), now(), now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.profiles (id, full_name, company_name, phone, created_at, updated_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'John Client', 'Example Corp', '+1-555-0200', now(), now())
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.user_roles (user_id, role, created_at)
VALUES 
  ('00000000-0000-0000-0000-000000000002', 'client', now())
ON CONFLICT (user_id) DO NOTHING;

-- Sample projects
INSERT INTO public.projects (id, user_id, name, description, status, progress, start_date, end_date, budget, created_at, updated_at)
VALUES 
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'E-commerce Website', 'Modern e-commerce platform with payment integration', 'in_progress', 65, '2024-01-15', '2024-06-30', 15000.00, now(), now()),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Portfolio Site', 'Creative portfolio website for designer', 'completed', 100, '2024-02-01', '2024-03-15', 5000.00, now(), now()),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000002', 'Dashboard Application', 'Analytics dashboard for business metrics', 'review', 90, '2024-03-01', '2024-05-01', 12000.00, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Sample quotes
INSERT INTO public.quotes (id, user_id, name, email, phone, company, services, budget_range, timeline, description, total_estimate, status, created_at)
VALUES 
  ('20000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Jane Smith', 'jane@example.com', '+1-555-0300', 'Smith Industries', '["websites", "maintenance"]', '$10,000 - $15,000', '3-6 months', 'Need a new website with ongoing maintenance', 12500.00, 'pending', now() - interval '5 days'),
  ('20000000-0000-0000-0000-000000000002', NULL, 'Bob Johnson', 'bob@startup.com', '+1-555-0400', 'Startup Inc', '["portfolios"]', '$5,000 - $10,000', '1-2 months', 'Portfolio website for showcasing work', 7500.00, 'approved', now() - interval '10 days')
ON CONFLICT (id) DO NOTHING;

-- Sample bookings
INSERT INTO public.bookings (id, user_id, name, email, phone, service_type, booking_date, booking_time, timezone, status, notes, created_at, updated_at)
VALUES 
  ('30000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'John Client', 'client@example.com', '+1-555-0200', 'consultation', CURRENT_DATE + interval '7 days', '14:00:00', 'America/New_York', 'confirmed', 'Initial consultation for new project', now(), now()),
  ('30000000-0000-0000-0000-000000000002', NULL, 'Alice Brown', 'alice@example.com', '+1-555-0500', 'consultation', CURRENT_DATE + interval '14 days', '10:00:00', 'America/New_York', 'pending', 'Interested in portfolio website', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Sample invoices
INSERT INTO public.invoices (id, user_id, project_id, invoice_number, amount, status, due_date, paid_at, created_at, updated_at)
VALUES 
  ('40000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'INV-2024-001', 5000.00, 'paid', CURRENT_DATE - interval '30 days', CURRENT_DATE - interval '25 days', now(), now()),
  ('40000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'INV-2024-002', 7500.00, 'pending', CURRENT_DATE + interval '15 days', NULL, now(), now())
ON CONFLICT (id) DO NOTHING;

-- Sample tickets
INSERT INTO public.tickets (id, user_id, title, description, category, priority, status, created_at, updated_at)
VALUES 
  ('50000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000002', 'Website loading slowly', 'The website is taking too long to load on mobile devices', 'technical', 'medium', 'open', now() - interval '2 days', now()),
  ('50000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000002', 'Need help with login', 'Cannot access my account', 'account', 'high', 'in_progress', now() - interval '1 day', now())
ON CONFLICT (id) DO NOTHING;

-- Sample blog posts
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, author_id, published, published_at, created_at, updated_at)
VALUES 
  ('60000000-0000-0000-0000-000000000001', '10 Tips for Modern Web Design', '10-tips-modern-web-design', 'Discover the latest trends and best practices in web design', '<p>Content here...</p>', '00000000-0000-0000-0000-000000000001', true, now() - interval '30 days', now(), now()),
  ('60000000-0000-0000-0000-000000000002', 'Why Your Business Needs a Professional Website', 'why-business-needs-website', 'Learn how a professional website can transform your business', '<p>Content here...</p>', '00000000-0000-0000-0000-000000000001', true, now() - interval '20 days', now(), now()),
  ('60000000-0000-0000-0000-000000000003', 'The Future of E-commerce', 'future-of-ecommerce', 'Exploring emerging trends in online retail', '<p>Content here...</p>', '00000000-0000-0000-0000-000000000001', true, now() - interval '10 days', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Sample case studies
INSERT INTO public.case_studies (id, title, slug, excerpt, content, client_name, project_type, featured_image_url, published, published_at, created_at, updated_at)
VALUES 
  ('70000000-0000-0000-0000-000000000001', 'E-commerce Success Story', 'ecommerce-success-story', 'How we helped increase online sales by 300%', '<p>Case study content...</p>', 'Retail Corp', 'ecommerce', NULL, true, now() - interval '60 days', now(), now()),
  ('70000000-0000-0000-0000-000000000002', 'Portfolio Website Transformation', 'portfolio-transformation', 'Redesigning a creative portfolio for maximum impact', '<p>Case study content...</p>', 'Design Studio', 'portfolio', NULL, true, now() - interval '45 days', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Sample downloads
INSERT INTO public.downloads (id, title, description, file_url, file_size, download_count, category, created_at, updated_at)
VALUES 
  ('80000000-0000-0000-0000-000000000001', 'Web Design Checklist', 'Comprehensive checklist for web design projects', '/downloads/web-design-checklist.pdf', 102400, 0, 'resources', now(), now()),
  ('80000000-0000-0000-0000-000000000002', 'SEO Best Practices Guide', 'Essential SEO tips for your website', '/downloads/seo-guide.pdf', 204800, 0, 'resources', now(), now())
ON CONFLICT (id) DO NOTHING;

-- Feature flags
INSERT INTO public.feature_flags (id, flag_key, flag_value, description, created_at, updated_at)
VALUES 
  ('90000000-0000-0000-0000-000000000001', 'enable_ai_chat', true, 'Enable AI chat widget', now(), now()),
  ('90000000-0000-0000-0000-000000000002', 'enable_analytics', true, 'Enable analytics tracking', now(), now()),
  ('90000000-0000-0000-0000-000000000003', 'maintenance_mode', false, 'Enable maintenance mode', now(), now())
ON CONFLICT (id) DO NOTHING;
