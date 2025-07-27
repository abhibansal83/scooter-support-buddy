import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from './use-toast';

export interface ScooterOrder {
  id: string;
  user_id: string;
  scooter_model: string;
  order_date: string;
  delivery_address: string;
  delivery_status: string;
  estimated_delivery_date?: string;
  tracking_number?: string;
  total_amount: number;
  phone_number?: string;
  customer_notes?: string;
  created_at: string;
  updated_at: string;
}

export const useScooterOrders = () => {
  const [orders, setOrders] = useState<ScooterOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const { toast } = useToast();

  const loadOrders = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('scooter_orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to load orders",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createOrder = async (orderData: {
    scooter_model: string;
    delivery_address: string;
    total_amount: number;
    phone_number?: string;
    customer_notes?: string;
    estimated_delivery_date?: string;
  }) => {
    if (!user) return false;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('scooter_orders')
        .insert([{
          user_id: user.id,
          ...orderData,
        }]);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order created successfully!",
      });
      
      await loadOrders();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create order",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateOrderStatus = async (orderId: string, status: string, trackingNumber?: string) => {
    setIsSubmitting(true);
    try {
      const updateData: any = { delivery_status: status };
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }

      const { error } = await supabase
        .from('scooter_orders')
        .update(updateData)
        .eq('id', orderId);

      if (error) throw error;

      toast({
        title: "Success",
        description: "Order status updated successfully!",
      });
      
      await loadOrders();
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update order status",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadOrders();
    }
  }, [user]);

  return {
    orders,
    isLoading,
    isSubmitting,
    loadOrders,
    createOrder,
    updateOrderStatus,
  };
};