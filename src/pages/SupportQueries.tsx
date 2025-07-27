import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, PlayCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupportQueries } from '@/hooks/useSupportQueries';
import { formatDistanceToNow } from 'date-fns';

const SupportQueries = () => {
  const navigate = useNavigate();
  const { queries, isLoading } = useSupportQueries();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Open':
        return <AlertCircle className="h-4 w-4" />;
      case 'InProgress':
        return <PlayCircle className="h-4 w-4" />;
      case 'Complete':
        return <CheckCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'Open':
        return 'destructive' as const;
      case 'InProgress':
        return 'default' as const;
      case 'Complete':
        return 'secondary' as const;
      default:
        return 'outline' as const;
    }
  };

  return (
    <div className="mobile-container h-screen flex flex-col">
      <div className="flex-1 p-4">
        {/* Header */}
        <Card className="electric-shadow border-border/50 mb-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate('/')}
                  className="gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                <CardTitle className="text-lg text-foreground">Support Queries</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Queries List */}
        <Card className="electric-shadow border-border/50 flex-1">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading your queries...
              </div>
            ) : queries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No support queries yet</p>
                <p className="text-sm">Submit a query from the chat interface when you need help</p>
              </div>
            ) : (
              <ScrollArea className="h-[600px]">
                <div className="space-y-4">
                  {queries.map((query) => (
                    <Card key={query.id} className="border-border/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <Badge 
                            variant={getStatusVariant(query.status)}
                            className="gap-1"
                          >
                            {getStatusIcon(query.status)}
                            {query.status}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(query.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <p className="text-sm text-foreground whitespace-pre-wrap">
                          {query.query_content}
                        </p>
                        
                        {query.status !== 'Open' && (
                          <div className="mt-3 text-xs text-muted-foreground">
                            Last updated: {formatDistanceToNow(new Date(query.updated_at), { addSuffix: true })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default SupportQueries;