-- Create storage bucket for downloads
INSERT INTO storage.buckets (id, name, public)
VALUES ('downloads', 'downloads', true)
ON CONFLICT (id) DO NOTHING;

-- Create policy for public download access
CREATE POLICY "Anyone can view downloads" ON storage.objects
FOR SELECT USING (bucket_id = 'downloads');

-- Create policy for admin/staff to upload downloads
CREATE POLICY "Staff can upload downloads" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'downloads' AND 
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
);

-- Create policy for admin/staff to delete downloads
CREATE POLICY "Staff can delete downloads" ON storage.objects
FOR DELETE USING (
  bucket_id = 'downloads' AND 
  (public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'staff'))
);