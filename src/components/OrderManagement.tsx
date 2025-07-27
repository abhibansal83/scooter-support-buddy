import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CalendarIcon, Package, Phone, MapPin, DollarSign } from 'lucide-react';
import { useScooterOrders } from '@/hooks/useScooterOrders';
import { format } from 'date-fns';

const OrderManagement = () => {
  const { orders, isLoading, isSubmitting, createOrder, updateOrderStatus } = useScooterOrders();
  const [showCreateOrder, setShowCreateOrder] = useState(false);
  const [orderForm, setOrderForm] = useState({
    scooter_model: '',
    delivery_address: '',
    total_amount: '',
    phone_number: '',
    customer_notes: '',
    estimated_delivery_date: '',
  });

  const handleCreateOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await createOrder({
      ...orderForm,
      total_amount: parseFloat(orderForm.total_amount),
    });
    
    if (success) {
      setShowCreateOrder(false);
      setOrderForm({
        scooter_model: '',
        delivery_address: '',
        total_amount: '',
        phone_number: '',
        customer_notes: '',
        estimated_delivery_date: '',
      });
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Scooter Orders</h1>
          <p className="text-muted-foreground">Manage customer orders and delivery status</p>
        </div>
        
        <Dialog open={showCreateOrder} onOpenChange={setShowCreateOrder}>
          <DialogTrigger asChild>
            <Button>Create New Order</Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Create New Order</DialogTitle>
              <DialogDescription>Add a new scooter order for a customer</DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleCreateOrder} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="scooter_model">Scooter Model</Label>
                <Select value={orderForm.scooter_model} onValueChange={(value) => setOrderForm(prev => ({ ...prev, scooter_model: value }))}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select scooter model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="urban-pro">Urban Pro</SelectItem>
                    <SelectItem value="city-cruiser">City Cruiser</SelectItem>
                    <SelectItem value="speedster-max">Speedster Max</SelectItem>
                    <SelectItem value="eco-rider">Eco Rider</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="delivery_address">Delivery Address</Label>
                <Textarea
                  id="delivery_address"
                  value={orderForm.delivery_address}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, delivery_address: e.target.value }))}
                  placeholder="Enter delivery address"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="total_amount">Total Amount ($)</Label>
                <Input
                  id="total_amount"
                  type="number"
                  step="0.01"
                  value={orderForm.total_amount}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, total_amount: e.target.value }))}
                  placeholder="0.00"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone_number">Phone Number</Label>
                <Input
                  id="phone_number"
                  value={orderForm.phone_number}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, phone_number: e.target.value }))}
                  placeholder="Customer phone number"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="estimated_delivery_date">Estimated Delivery Date</Label>
                <Input
                  id="estimated_delivery_date"
                  type="date"
                  value={orderForm.estimated_delivery_date}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, estimated_delivery_date: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="customer_notes">Customer Notes</Label>
                <Textarea
                  id="customer_notes"
                  value={orderForm.customer_notes}
                  onChange={(e) => setOrderForm(prev => ({ ...prev, customer_notes: e.target.value }))}
                  placeholder="Any special instructions or notes"
                />
              </div>
              
              <div className="flex gap-2">
                <Button type="button" variant="outline" onClick={() => setShowCreateOrder(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? 'Creating...' : 'Create Order'}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            Orders Overview
          </CardTitle>
          <CardDescription>
            Track and manage all scooter orders
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Loading orders...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No orders found. Create your first order to get started.
            </div>
          ) : (
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order ID</TableHead>
                    <TableHead>Scooter Model</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Order Date</TableHead>
                    <TableHead>Delivery Address</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orders.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-mono text-sm">
                        {order.id.slice(0, 8)}...
                      </TableCell>
                      <TableCell className="font-medium">
                        {order.scooter_model}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusColor(order.delivery_status)}>
                          {order.delivery_status}
                        </Badge>
                      </TableCell>
                      <TableCell className="flex items-center gap-1">
                        <DollarSign className="h-3 w-3" />
                        {order.total_amount.toFixed(2)}
                      </TableCell>
                      <TableCell>
                        {format(new Date(order.order_date), 'MMM dd, yyyy')}
                      </TableCell>
                      <TableCell className="max-w-xs truncate">
                        <div className="flex items-center gap-1">
                          <MapPin className="h-3 w-3 flex-shrink-0" />
                          {order.delivery_address}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          <Select
                            value={order.delivery_status}
                            onValueChange={(value) => updateOrderStatus(order.id, value)}
                          >
                            <SelectTrigger className="w-32">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="pending">Pending</SelectItem>
                              <SelectItem value="processing">Processing</SelectItem>
                              <SelectItem value="shipped">Shipped</SelectItem>
                              <SelectItem value="delivered">Delivered</SelectItem>
                              <SelectItem value="cancelled">Cancelled</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OrderManagement;