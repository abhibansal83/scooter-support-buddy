import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { useToast } from '@/hooks/use-toast';

export interface SupportQuery {
  id: string;
  user_id: string;
  query_content: string;
  chat_message_id?: string;
  status: 'Open' | 'InProgress' | 'Complete';
  created_at: string;
  updated_at: string;
}

export const useSupportQueries = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [queries, setQueries] = useState<SupportQuery[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load user's support queries
  const loadQueries = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('support_queries')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQueries((data as SupportQuery[]) || []);
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

  // Submit a new support query
  const submitQuery = async (queryContent: string, chatMessageId?: string) => {
    if (!user) return false;

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('support_queries')
        .insert({
          user_id: user.id,
          query_content: queryContent,
          chat_message_id: chatMessageId,
          status: 'Open'
        });

      if (error) throw error;
      
      toast({
        title: "Success",
        description: "Your query has been submitted successfully",
      });
      
      await loadQueries(); // Refresh the list
      return true;
    } catch (error: any) {
      toast({
        title: "Error",
        description: "Failed to submit query",
        variant: "destructive",
      });
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Load queries when user changes
  useEffect(() => {
    if (user) {
      loadQueries();
    }
  }, [user]);

  return {
    queries,
    isLoading,
    isSubmitting,
    loadQueries,
    submitQuery
  };
};