import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Plus, Edit } from 'lucide-react';
import { DomainQuestion } from '@/hooks/useDomainQuestions';

interface DomainQuestionDialogProps {
  onSubmit: (data: Omit<DomainQuestion, 'id' | 'created_at' | 'updated_at' | 'created_by'>) => Promise<any>;
  question?: DomainQuestion;
  trigger?: React.ReactNode;
}

export const DomainQuestionDialog = ({ onSubmit, question, trigger }: DomainQuestionDialogProps) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    question: question?.question || '',
    answer: question?.answer || '',
    category: question?.category || '',
    is_active: question?.is_active ?? true,
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await onSubmit(formData);
      setOpen(false);
      if (!question) {
        setFormData({ question: '', answer: '', category: '', is_active: true });
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="default" size="sm">
            {question ? <Edit className="h-4 w-4" /> : <Plus className="h-4 w-4" />}
            {question ? 'Edit' : 'Add Question'}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>{question ? 'Edit' : 'Add'} Domain Question</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="question">Question</Label>
            <Textarea
              id="question"
              value={formData.question}
              onChange={(e) => setFormData(prev => ({ ...prev, question: e.target.value }))}
              placeholder="Enter the question..."
              required
            />
          </div>
          
          <div>
            <Label htmlFor="answer">Answer</Label>
            <Textarea
              id="answer"
              value={formData.answer}
              onChange={(e) => setFormData(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="Enter the answer..."
              rows={4}
              required
            />
          </div>
          
          <div>
            <Label htmlFor="category">Category (Optional)</Label>
            <Input
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              placeholder="e.g., Technical, General, Support"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active</Label>
          </div>
          
          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Saving...' : question ? 'Update' : 'Add'} Question
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};