import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import OrderManagement from '@/components/OrderManagement';
import OrderInquiry from '@/components/OrderInquiry';
import { useAuth } from '@/hooks/useAuth';
import { Package, MessageCircle } from 'lucide-react';

const Orders = () => {
  const { user, isSupport, isAdmin } = useAuth();

  if (!user) {
    return (
      <div className="mobile-container h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">Please log in</h2>
          <p className="text-muted-foreground">You need to be logged in to view orders.</p>
        </div>
      </div>
    );
  }

  const isSupportOrAdmin = isSupport || isAdmin;

  return (
    <div className="mobile-container h-screen flex flex-col">
      <div className="flex-1 p-4">
        <Tabs defaultValue={isSupportOrAdmin ? "management" : "inquiry"} className="space-y-4">
          <TabsList className="grid w-full grid-cols-2">
            {isSupportOrAdmin && (
              <TabsTrigger value="management" className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                Order Management
              </TabsTrigger>
            )}
            <TabsTrigger value="inquiry" className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4" />
              Order Inquiry
            </TabsTrigger>
          </TabsList>

          {isSupportOrAdmin && (
            <TabsContent value="management">
              <OrderManagement />
            </TabsContent>
          )}

          <TabsContent value="inquiry">
            <OrderInquiry />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Orders;