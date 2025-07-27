import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';
import { toast } from 'sonner';

export interface DomainQuestion {
  id: string;
  question: string;
  answer: string;
  category?: string;
  keywords?: string[];
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export const useDomainQuestions = () => {
  const [questions, setQuestions] = useState<DomainQuestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user, isAdmin } = useAuth();

  const loadQuestions = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from('domain_questions')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setQuestions(data || []);
    } catch (error) {
      console.error('Error loading domain questions:', error);
      toast.error('Failed to load domain questions');
    } finally {
      setIsLoading(false);
    }
  };

  const addQuestion = async (questionData: {
    question: string;
    answer: string;
    category?: string;
    keywords?: string[];
  }) => {
    if (!user || !isAdmin) {
      toast.error('Only admins can add domain questions');
      return;
    }

    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('domain_questions')
        .insert({
          ...questionData,
          created_by: user.id,
        })
        .select()
        .single();

      if (error) throw error;

      setQuestions(prev => [data, ...prev]);
      toast.success('Domain question added successfully');
      return data;
    } catch (error) {
      console.error('Error adding domain question:', error);
      toast.error('Failed to add domain question');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateQuestion = async (id: string, updates: Partial<DomainQuestion>) => {
    if (!user || !isAdmin) {
      toast.error('Only admins can update domain questions');
      return;
    }

    setIsSubmitting(true);
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
      toast.success('Domain question updated successfully');
      return data;
    } catch (error) {
      console.error('Error updating domain question:', error);
      toast.error('Failed to update domain question');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteQuestion = async (id: string) => {
    if (!user || !isAdmin) {
      toast.error('Only admins can delete domain questions');
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('domain_questions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setQuestions(prev => prev.filter(q => q.id !== id));
      toast.success('Domain question deleted successfully');
    } catch (error) {
      console.error('Error deleting domain question:', error);
      toast.error('Failed to delete domain question');
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (user) {
      loadQuestions();
    }
  }, [user]);

  return {
    questions,
    isLoading,
    isSubmitting,
    addQuestion,
    updateQuestion,
    deleteQuestion,
    loadQuestions,
  };
};