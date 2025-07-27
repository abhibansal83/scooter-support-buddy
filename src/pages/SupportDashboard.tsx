import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Clock, CheckCircle, AlertCircle, PlayCircle, User, Phone } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupportManagement } from '@/hooks/useSupportManagement';
import { formatDistanceToNow } from 'date-fns';

const SupportDashboard = () => {
  const navigate = useNavigate();
  const { queries, isLoading, isUpdating, updateQueryStatus } = useSupportManagement();

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

  const handleStatusChange = async (queryId: string, newStatus: 'Open' | 'InProgress' | 'Complete') => {
    await updateQueryStatus(queryId, newStatus);
  };

  const statusCounts = {
    Open: queries.filter(q => q.status === 'Open').length,
    InProgress: queries.filter(q => q.status === 'InProgress').length,
    Complete: queries.filter(q => q.status === 'Complete').length,
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
                <CardTitle className="text-lg text-foreground">Support Dashboard</CardTitle>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-destructive">{statusCounts.Open}</div>
              <div className="text-xs text-muted-foreground">Open</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-primary">{statusCounts.InProgress}</div>
              <div className="text-xs text-muted-foreground">In Progress</div>
            </CardContent>
          </Card>
          <Card className="border-border/50">
            <CardContent className="p-3 text-center">
              <div className="text-2xl font-bold text-muted-foreground">{statusCounts.Complete}</div>
              <div className="text-xs text-muted-foreground">Complete</div>
            </CardContent>
          </Card>
        </div>

        {/* Queries List */}
        <Card className="electric-shadow border-border/50 flex-1">
          <CardContent className="p-6">
            {isLoading ? (
              <div className="text-center py-8 text-muted-foreground">
                Loading support queries...
              </div>
            ) : queries.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                <AlertCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>No support queries found</p>
              </div>
            ) : (
              <ScrollArea className="h-[500px]">
                <div className="space-y-4">
                  {queries.map((query) => (
                    <Card key={query.id} className="border-border/30">
                      <CardContent className="p-4">
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center gap-2">
                            <Badge 
                              variant={getStatusVariant(query.status)}
                              className="gap-1"
                            >
                              {getStatusIcon(query.status)}
                              {query.status}
                            </Badge>
                            {query.profiles?.phone_number && (
                              <Badge variant="outline" className="gap-1">
                                <Phone className="h-3 w-3" />
                                {query.profiles.phone_number}
                              </Badge>
                            )}
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(query.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        
                        <p className="text-sm text-foreground whitespace-pre-wrap mb-3">
                          {query.query_content}
                        </p>
                        
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <User className="h-3 w-3" />
                            <span>User ID: {query.user_id.slice(0, 8)}...</span>
                          </div>
                          
                          <Select
                            value={query.status}
                            onValueChange={(value) => handleStatusChange(query.id, value as 'Open' | 'InProgress' | 'Complete')}
                            disabled={isUpdating}
                          >
                            <SelectTrigger className="w-32 h-8">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Open">Open</SelectItem>
                              <SelectItem value="InProgress">In Progress</SelectItem>
                              <SelectItem value="Complete">Complete</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
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

export default SupportDashboard;