-- Allow tickets to be created without a client_id for guest submissions
ALTER TABLE public.tickets ALTER COLUMN client_id DROP NOT NULL;

-- Update RLS policy to allow public ticket creation
DROP POLICY IF EXISTS "Clients can create their own tickets" ON public.tickets;

CREATE POLICY "Anyone can create tickets"
ON public.tickets
FOR INSERT
WITH CHECK (true);

-- Allow anyone to update download counts
DROP POLICY IF EXISTS "Anyone can update download count" ON public.downloads;

CREATE POLICY "Anyone can update download count"
ON public.downloads
FOR UPDATE
USING (true)
WITH CHECK (true);