import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Plus, Edit } from 'lucide-react';
import { DomainQuestion } from '@/hooks/useDomainQuestions';

interface DomainQuestionDialogProps {
  onSubmit: (data: {
    question: string;
    answer: string;
    category?: string;
    keywords?: string[];
  }) => Promise<any>;
  isSubmitting: boolean;
  question?: DomainQuestion;
  trigger?: React.ReactNode;
}

export const DomainQuestionDialog = ({ 
  onSubmit, 
  isSubmitting, 
  question,
  trigger 
}: DomainQuestionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: question?.question || '',
    answer: question?.answer || '',
    category: question?.category || '',
    keywords: question?.keywords?.join(', ') || '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.question.trim() || !formData.answer.trim()) {
      return;
    }

    try {
      await onSubmit({
        question: formData.question.trim(),
        answer: formData.answer.trim(),
        category: formData.category.trim() || undefined,
        keywords: formData.keywords 
          ? formData.keywords.split(',').map(k => k.trim()).filter(k => k)
          : undefined,
      });
      
      if (!question) {
        setFormData({ question: '', answer: '', category: '', keywords: '' });
      }
      setOpen(false);
    } catch (error) {
      // Error handling is done in the hook
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button>
            {question ? <Edit className="mr-2 h-4 w-4" /> : <Plus className="mr-2 h-4 w-4" />}
            {question ? 'Edit Question' : 'Add Question'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {question ? 'Edit Domain Question' : 'Add New Domain Question'}
          </DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="question">Question *</Label>
            <Textarea
              id="question"
              placeholder="Enter the question..."
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              required
              rows={3}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="answer">Answer *</Label>
            <Textarea
              id="answer"
              placeholder="Enter the answer..."
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              required
              rows={4}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Input
              id="category"
              placeholder="e.g., Billing, Technical Support, General"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="keywords">Keywords</Label>
            <Input
              id="keywords"
              placeholder="Enter keywords separated by commas"
              value={formData.keywords}
              onChange={(e) => setFormData(prev => ({ ...prev, keywords: e.target.value }))}
            />
            <p className="text-sm text-muted-foreground">
              Keywords help the chatbot match user queries to this answer
            </p>
          </div>
          
          <div className="flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Saving...' : (question ? 'Update' : 'Add Question')}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};