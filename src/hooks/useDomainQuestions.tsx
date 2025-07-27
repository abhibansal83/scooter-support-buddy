import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface DomainQuestion {
  id: string;
  question: string;
  answer: string;
  category?: string;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useDomainQuestions = () => {
  const [questions, setQuestions] = useState<DomainQuestion[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadQuestions = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('domain_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading questions:', error);
      toast({
        title: "Error",
        description: "Failed to load domain questions",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addQuestion = async (question: Omit<DomainQuestion, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('domain_questions')
        .insert({
          ...question,
          created_by: user.user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setQuestions(prev => [data, ...prev]);
      toast({
        title: "Success",
        description: "Domain question added successfully",
      });

      return data;
    } catch (error) {
      console.error('Error adding question:', error);
      toast({
        title: "Error",
        description: "Failed to add domain question",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateQuestion = async (id: string, updates: Partial<DomainQuestion>) => {
    try {
      const { data, error } = await supabase
        .from('domain_questions')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;

      setQuestions(prev => 
        prev.map(q => q.id === id ? data : q)
      );

      toast({
        title: "Success",
        description: "Domain question updated successfully",
      });

      return data;
    } catch (error) {
      console.error('Error updating question:', error);
      toast({
        title: "Error",
        description: "Failed to update domain question",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteQuestion = async (id: string) => {
    try {
      const { error } = await supabase
        .from('domain_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuestions(prev => prev.filter(q => q.id !== id));
      toast({
        title: "Success",
        description: "Domain question deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting question:', error);
      toast({
        title: "Error",
        description: "Failed to delete domain question",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    loadQuestions();
  }, []);

  return {
    questions,
    loading,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    loadQuestions,
  };
};