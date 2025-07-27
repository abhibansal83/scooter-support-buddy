import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, MessageCircle, Package, Settings, LogOut, Phone } from 'lucide-react';

const Index = () => {
  const { user, signOut } = useAuth();

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
          <Card className="electric-shadow border-border/50 hover:shadow-lg transition-smooth cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="rounded-full p-3 bg-primary/10 w-fit mx-auto mb-3">
                <MessageCircle className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Ask Support</h3>
              <p className="text-xs text-muted-foreground">Get instant help</p>
            </CardContent>
          </Card>

          <Card className="electric-shadow border-border/50 hover:shadow-lg transition-smooth cursor-pointer">
            <CardContent className="p-4 text-center">
              <div className="rounded-full p-3 bg-primary/10 w-fit mx-auto mb-3">
                <Package className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Track Order</h3>
              <p className="text-xs text-muted-foreground">Check delivery status</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Conversations */}
        <Card className="electric-shadow border-border/50">
          <CardHeader>
            <CardTitle className="text-lg text-foreground">Recent Conversations</CardTitle>
            <CardDescription>Your latest support interactions</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <MessageCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No conversations yet</p>
              <p className="text-sm">Start by asking a question</p>
            </div>
          </CardContent>
        </Card>

        {/* Help & Settings */}
        <div className="space-y-3">
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
        </div>
      </div>
    </div>
  );
};

export default Index;
