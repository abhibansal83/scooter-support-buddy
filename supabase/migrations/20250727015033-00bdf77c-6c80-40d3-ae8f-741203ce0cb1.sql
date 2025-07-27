-- Add foreign key relationship between support_queries and profiles via user_id
ALTER TABLE public.support_queries 
ADD CONSTRAINT fk_support_queries_user_id 
FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;