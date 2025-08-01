import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SupportQueryWithProfile {
  id: string;
  user_id: string;
  query_content: string;
  chat_message_id?: string;
  status: 'Open' | 'InProgress' | 'Complete';
  created_at: string;
  updated_at: string;
  profiles?: {
    phone_number?: string;
  };
}

export const useSupportManagement = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [queries, setQueries] = useState<SupportQueryWithProfile[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Load all support queries (support users only)
  const loadAllQueries = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      // First, try to get queries without profiles join to see if that works
      const { data, error } = await supabase
        .from('support_queries')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Then get profiles data separately for each user_id
      const queriesWithProfiles = await Promise.all(
        (data || []).map(async (query) => {
          const { data: profile } = await supabase
            .from('profiles')
            .select('phone_number')
            .eq('user_id', query.user_id)
            .single();
          
          return {
            ...query,
            profiles: profile || undefined
          };
        })
      );

      setQueries(queriesWithProfiles as SupportQueryWithProfile[]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to load support queries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Update query status
  const updateQueryStatus = async (queryId: string, status: 'Open' | 'InProgress' | 'Complete') => {
    if (!user) return false;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('support_queries')
        .update({ 
          status,
          updated_at: new Date().toISOString()
        })
        .eq('id', queryId);

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Query status updated successfully",
      });
      
      await loadAllQueries(); // Refresh the list
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to update query status",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  // Load queries when user changes
  useEffect(() => {
    if (user) {
      loadAllQueries();
    }
  }, [user]);

  return {
    queries,
    isLoading,
    isUpdating,
    loadAllQueries,
    updateQueryStatus
  };
};