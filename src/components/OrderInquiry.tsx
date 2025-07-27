import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Package, MessageCircle, Search } from 'lucide-react';
import { useScooterOrders } from '@/hooks/useScooterOrders';
import { useSupportQueries } from '@/hooks/useSupportQueries';
import { format } from 'date-fns';

const OrderInquiry = () => {
  const { orders, isLoading: ordersLoading } = useScooterOrders();
  const { submitQuery, isSubmitting } = useSupportQueries();
  const [selectedOrderId, setSelectedOrderId] = useState('');
  const [inquiryText, setInquiryText] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOrders = orders.filter(order => 
    order.scooter_model.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.delivery_address.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSubmitInquiry = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrderId || !inquiryText.trim()) return;

    const selectedOrder = orders.find(order => order.id === selectedOrderId);
    const inquiryContent = `Order Delivery Inquiry for Order #${selectedOrder?.id.slice(0, 8)}...\n\nScooter Model: ${selectedOrder?.scooter_model}\nDelivery Status: ${selectedOrder?.delivery_status}\n\nCustomer Inquiry:\n${inquiryText}`;

    const success = await submitQuery(inquiryContent);
    if (success) {
      setInquiryText('');
      setSelectedOrderId('');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'default';
      case 'processing': return 'secondary';
      case 'shipped': return 'outline';
      case 'delivered': return 'default';
      case 'cancelled': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Order Delivery Inquiry</h1>
        <p className="text-muted-foreground">Track your orders and submit delivery inquiries</p>
      </div>

      {/* Order Tracking Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Your Orders
          </CardTitle>
          <CardDescription>
            View your order status and delivery information
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4" />
              <Input
                placeholder="Search orders by model, ID, or address..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>

            {ordersLoading ? (
              <div className="text-center py-8">Loading your orders...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {searchTerm ? 'No orders match your search.' : 'No orders found.'}
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredOrders.map((order) => (
                  <Card key={order.id} className="border-l-4 border-l-primary">
                    <CardContent className="pt-6">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">Order ID</p>
                          <p className="font-mono text-sm">{order.id.slice(0, 8)}...</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Scooter Model</p>
                          <p className="font-medium">{order.scooter_model}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Status</p>
                          <Badge variant={getStatusColor(order.delivery_status)}>
                            {order.delivery_status}
                          </Badge>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Order Date</p>
                          <p>{format(new Date(order.order_date), 'MMM dd, yyyy')}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Amount</p>
                          <p className="font-semibold">${order.total_amount.toFixed(2)}</p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">Tracking Number</p>
                          <p className="font-mono text-sm">{order.tracking_number || 'Not assigned'}</p>
                        </div>
                        <div className="md:col-span-3">
                          <p className="text-sm text-muted-foreground">Delivery Address</p>
                          <p>{order.delivery_address}</p>
                        </div>
                        {order.estimated_delivery_date && (
                          <div className="md:col-span-3">
                            <p className="text-sm text-muted-foreground">Estimated Delivery</p>
                            <p>{format(new Date(order.estimated_delivery_date), 'MMM dd, yyyy')}</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Inquiry Submission Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Submit Delivery Inquiry
          </CardTitle>
          <CardDescription>
            Have questions about your order delivery? Submit an inquiry below.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmitInquiry} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="order-select">Select Order</Label>
              <Select value={selectedOrderId} onValueChange={setSelectedOrderId}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an order to inquire about" />
                </SelectTrigger>
                <SelectContent>
                  {orders.map((order) => (
                    <SelectItem key={order.id} value={order.id}>
                      #{order.id.slice(0, 8)}... - {order.scooter_model} ({order.delivery_status})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="inquiry-text">Your Inquiry</Label>
              <Textarea
                id="inquiry-text"
                value={inquiryText}
                onChange={(e) => setInquiryText(e.target.value)}
                placeholder="Describe your question or concern about the delivery..."
                rows={4}
                required
              />
            </div>

            <Button type="submit" disabled={!selectedOrderId || !inquiryText.trim() || isSubmitting}>
              {isSubmitting ? 'Submitting...' : 'Submit Inquiry'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderInquiry;