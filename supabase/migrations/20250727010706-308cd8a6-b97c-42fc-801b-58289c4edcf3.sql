-- Create support_queries table for user submitted queries
CREATE TABLE public.support_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  query_content TEXT NOT NULL,
  chat_message_id UUID,
  status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'InProgress', 'Complete')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.support_queries ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own support queries" 
ON public.support_queries 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own support queries" 
ON public.support_queries 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_support_queries_updated_at
BEFORE UPDATE ON public.support_queries
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();