-- Add RLS policies for support users to manage support queries
CREATE POLICY "Support users can view all support queries" 
ON public.support_queries 
FOR SELECT 
USING (has_role(auth.uid(), 'support'::app_role));

CREATE POLICY "Support users can update support queries" 
ON public.support_queries 
FOR UPDATE 
USING (has_role(auth.uid(), 'support'::app_role));

-- Allow support users to view user profiles for query management
CREATE POLICY "Support users can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (has_role(auth.uid(), 'support'::app_role));