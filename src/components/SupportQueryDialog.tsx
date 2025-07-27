import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { HelpCircle } from 'lucide-react';
import { useSupportQueries } from '@/hooks/useSupportQueries';

interface SupportQueryDialogProps {
  messageId?: string;
  messageContent?: string;
}

const SupportQueryDialog = ({ messageId, messageContent }: SupportQueryDialogProps) => {
  const [open, setOpen] = useState(false);
  const [queryText, setQueryText] = useState('');
  const { submitQuery, isSubmitting } = useSupportQueries();

  const handleSubmit = async () => {
    if (!queryText.trim()) return;

    const success = await submitQuery(queryText, messageId);
    if (success) {
      setQueryText('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <HelpCircle className="h-4 w-4" />
          Need Help?
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Submit Support Query</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          {messageContent && (
            <div className="p-3 bg-muted rounded-lg">
              <Label className="text-sm font-medium">Related Message:</Label>
              <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                {messageContent}
              </p>
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="query">Describe your issue or question:</Label>
            <Textarea
              id="query"
              placeholder="Please describe what you need help with..."
              value={queryText}
              onChange={(e) => setQueryText(e.target.value)}
              className="min-h-[100px] resize-none"
            />
          </div>
          
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!queryText.trim() || isSubmitting}
            >
              {isSubmitting ? 'Submitting...' : 'Submit Query'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SupportQueryDialog;