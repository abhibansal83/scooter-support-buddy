import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, MessageCircle, Package, Settings, LogOut, Phone, HelpCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Index = () => {
  const { user, signOut, isAdmin, isSupport } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mobile-container">
      {/* Header */}
      <div className="electric-gradient p-6 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="electric-glow rounded-full p-2 bg-white/20 backdrop-blur-sm">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-lg font-bold text-white">ElectroScoot Support</h1>
                <p className="text-white/80 text-sm">Welcome back!</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={signOut}
              className="text-white hover:bg-white/20 p-2"
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
          
          {user?.phone && (
            <div className="flex items-center justify-center gap-2 text-white/90 text-sm">
              <Phone className="h-4 w-4" />
              <span>{user.phone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Card 
            className="electric-shadow border-border/50 hover:shadow-lg transition-smooth cursor-pointer"
            onClick={() => navigate('/chat')}
          >
            <CardContent className="p-4 text-center">
              <div className="rounded-full p-3 bg-primary/10 w-fit mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Chat Support</h3>
              <p className="text-xs text-muted-foreground">Get instant AI help</p>
            </CardContent>
          </Card>

          <Card 
            className="electric-shadow border-border/50 hover:shadow-lg transition-smooth cursor-pointer"
            onClick={() => navigate('/orders')}
          >
            <CardContent className="p-4 text-center">
              <div className="rounded-full p-3 bg-primary/10 w-fit mx-auto mb-3">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Orders</h3>
              <p className="text-xs text-muted-foreground">Manage & track orders</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="electric-shadow border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Recent Activity</CardTitle>
            <CardDescription>Your latest interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No recent activity</p>
              <p className="text-sm">Start a chat to get help</p>
            </div>
          </CardContent>
        </Card>

        {/* Help & Settings */}
        <div className="space-y-3">
          <Button
            variant="outline"
            className="w-full justify-start py-6 text-left"
            onClick={() => navigate('/support-queries')}
          >
            <HelpCircle className="h-5 w-5 mr-3" />
            <div>
              <div className="font-medium">Support Queries</div>
              <div className="text-sm text-muted-foreground">View your submitted queries and status</div>
            </div>
          </Button>
          
          <Button
            variant="outline"
            className="w-full justify-start py-6 text-left"
          >
            <Settings className="h-5 w-5 mr-3" />
            <div>
              <div className="font-medium">Settings</div>
              <div className="text-sm text-muted-foreground">Manage your preferences</div>
            </div>
          </Button>

          {isSupport && (
            <Button
              variant="outline"
              className="w-full justify-start py-6 text-left"
              onClick={() => navigate('/support-dashboard')}
            >
              <HelpCircle className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Support Dashboard</div>
                <div className="text-sm text-muted-foreground">Manage user support queries</div>
              </div>
            </Button>
          )}

          {isAdmin && (
            <Button
              variant="outline"
              className="w-full justify-start py-6 text-left"
              onClick={() => navigate('/admin')}
            >
              <Settings className="h-5 w-5 mr-3" />
              <div>
                <div className="font-medium">Admin Dashboard</div>
                <div className="text-sm text-muted-foreground">Manage domain questions</div>
              </div>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
