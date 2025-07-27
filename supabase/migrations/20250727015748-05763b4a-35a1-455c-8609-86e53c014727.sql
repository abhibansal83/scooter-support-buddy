-- Create scooter_orders table
CREATE TABLE public.scooter_orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  scooter_model TEXT NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  delivery_address TEXT NOT NULL,
  delivery_status TEXT NOT NULL DEFAULT 'pending',
  estimated_delivery_date DATE,
  tracking_number TEXT,
  total_amount DECIMAL(10,2) NOT NULL,
  phone_number TEXT,
  customer_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.scooter_orders ENABLE ROW LEVEL SECURITY;

-- Create policies for scooter orders
CREATE POLICY "Users can view their own orders" 
ON public.scooter_orders 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders" 
ON public.scooter_orders 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Support users can view all orders" 
ON public.scooter_orders 
FOR SELECT 
USING (has_role(auth.uid(), 'support'::app_role));

CREATE POLICY "Support users can update all orders" 
ON public.scooter_orders 
FOR UPDATE 
USING (has_role(auth.uid(), 'support'::app_role));

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_scooter_orders_updated_at
BEFORE UPDATE ON public.scooter_orders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Add order delivery inquiry types to existing support_queries
ALTER TABLE public.support_queries 
ADD COLUMN inquiry_type TEXT DEFAULT 'general',
ADD COLUMN order_id UUID REFERENCES public.scooter_orders(id) ON DELETE SET NULL;