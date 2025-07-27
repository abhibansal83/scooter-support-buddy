import { useAuth } from '@/hooks/useAuth';
import { useDomainQuestions } from '@/hooks/useDomainQuestions';
import { DomainQuestionDialog } from '@/components/DomainQuestionDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Edit, Trash2, Plus, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

export default function AdminDashboard() {
  const { isAdmin, loading } = useAuth();
  const { questions, isLoading, isSubmitting, addQuestion, updateQuestion, deleteQuestion } = useDomainQuestions();
  const navigate = useNavigate();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
        <h1 className="text-2xl font-bold">Access Denied</h1>
        <p className="text-muted-foreground">You don't have admin privileges to access this page.</p>
        <Button onClick={() => navigate('/')}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Go Home
        </Button>
      </div>
    );
  }

  const handleToggleActive = async (questionId: string, isActive: boolean) => {
    await updateQuestion(questionId, { is_active: isActive });
  };

  const handleDelete = async (questionId: string) => {
    await deleteQuestion(questionId);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-6xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Manage domain-specific questions for the chatbot</p>
        </div>
        <Button onClick={() => navigate('/')} variant="outline">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-semibold">Domain Questions</h2>
          <p className="text-sm text-muted-foreground">
            {questions.length} question{questions.length !== 1 ? 's' : ''} total
          </p>
        </div>
        <DomainQuestionDialog
          onSubmit={addQuestion}
          isSubmitting={isSubmitting}
        />
      </div>

      {isLoading ? (
        <div className="text-center py-8">Loading questions...</div>
      ) : questions.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <p className="text-muted-foreground mb-4">No domain questions yet.</p>
            <DomainQuestionDialog
              onSubmit={addQuestion}
              isSubmitting={isSubmitting}
              trigger={
                <Button>
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First Question
                </Button>
              }
            />
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {questions.map((question) => (
            <Card key={question.id}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg">{question.question}</CardTitle>
                    {question.category && (
                      <Badge variant="secondary" className="mt-2">
                        {question.category}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      checked={question.is_active}
                      onCheckedChange={(checked) => handleToggleActive(question.id, checked)}
                      disabled={isSubmitting}
                    />
                    <DomainQuestionDialog
                      question={question}
                      onSubmit={(data) => updateQuestion(question.id, data)}
                      isSubmitting={isSubmitting}
                      trigger={
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                      }
                    />
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Question</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this question? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => handleDelete(question.id)}
                            disabled={isSubmitting}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <CardDescription className="mb-3 whitespace-pre-wrap">
                  {question.answer}
                </CardDescription>
                {question.keywords && question.keywords.length > 0 && (
                  <div className="flex flex-wrap gap-1">
                    {question.keywords.map((keyword, index) => (
                      <Badge key={index} variant="outline" className="text-xs">
                        {keyword}
                      </Badge>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}