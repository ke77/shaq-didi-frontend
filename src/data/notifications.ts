export interface AppNotification {
  id: string;
  type: 'order_assigned' | 'order_completed' | 'order_placed' | 'order_dispatched' | 'system';
  title: string;
  message: string;
  date: string;
  read: boolean;
  orderId?: string;
}

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    type: 'order_assigned',
    title: 'New Order Assigned:',
    message: 'A new order has been assigned to you! Please check your dashboard to view details and manage the order',
    date: '1 Oct at 12:10 PM',
    read: false,
    orderId: 'ord-1041',
  },
  {
    id: 'notif-2',
    type: 'order_completed',
    title: 'Order Completed:',
    message: 'Order for Daavi\u2019s Special Gob3 marked as completed',
    date: '1 Oct at 12:10 PM',
    read: false,
    orderId: 'ord-1039',
  },
  {
    id: 'notif-3',
    type: 'order_assigned',
    title: 'New Order Assigned:',
    message: 'A new order has been assigned to you! Please check your dashboard to view details and manage the order',
    date: '1 Oct at 12:10 PM',
    read: true,
    orderId: 'ord-1038',
  },
  {
    id: 'notif-4',
    type: 'order_completed',
    title: 'Order Completed:',
    message: 'Order for Daavi\u2019s Special Gob3 marked as completed',
    date: '1 Oct at 12:10 PM',
    read: true,
    orderId: 'ord-1037',
  },
];
