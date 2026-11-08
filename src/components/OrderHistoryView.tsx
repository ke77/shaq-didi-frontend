import React from 'react';
import { FoodJointItem } from '../data/foodJoints';
import { CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';

export interface OrderRecord {
  id: string;
  item: FoodJointItem;
  quantity: number;
  totalGHS?: number;
  amount?: string;
  personnel?: string;
  notes?: string;
  date: string;
  status: 'Delivered' | 'Preparing' | 'Dispatched';
}

interface OrderHistoryViewProps {
  orders: OrderRecord[];
  onReorder: (item: FoodJointItem) => void;
  onBackToHome: () => void;
}

export const OrderHistoryView: React.FC<OrderHistoryViewProps> = ({
  orders,
  onReorder,
  onBackToHome,
}) => {
  return (
    <div className="w-full max-w-4xl mx-auto p-4 sm:p-6 lg:p-8 select-none">
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-slate-100">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">Order History</h2>
          <p className="text-xs text-slate-500 mt-0.5">Your food dispatch and kitchen orders</p>
        </div>
        <button
          onClick={onBackToHome}
          className="text-xs font-semibold text-[#E53935] hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>Browse Menu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-2xl border border-slate-100">
          <Clock className="w-10 h-10 text-slate-300 mx-auto mb-2" />
          <h3 className="text-base font-semibold text-slate-700">No Orders Yet</h3>
          <p className="text-xs text-slate-400 mt-1 max-w-xs mx-auto">
            Browse Haatso Station food joints and place your first meal order.
          </p>
          <button
            onClick={onBackToHome}
            className="mt-4 px-4 py-2 bg-[#E53935] text-white text-xs font-semibold rounded-lg hover:bg-[#c62828] transition-colors cursor-pointer"
          >
            Explore Food Joints
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-4 border border-slate-100 shadow-xs hover:border-slate-200 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={order.item.image}
                  alt={order.item.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover bg-slate-100 shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-slate-800 text-sm">{order.item.name}</h4>
                    <span
                      className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        order.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700'
                          : order.status === 'Preparing'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-blue-50 text-blue-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                  <div className="text-xs text-slate-400 flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-slate-400" />
                      {order.item.location}
                    </span>
                    {order.amount && (
                      <>
                        <span>·</span>
                        <span className="font-semibold text-slate-700">Amount: GH₵ {order.amount}</span>
                      </>
                    )}
                    {order.personnel && (
                      <>
                        <span>·</span>
                        <span className="text-[#E53935] font-medium">Assigned: {order.personnel}</span>
                      </>
                    )}
                    <span>·</span>
                    <span>{order.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-50">
                <button
                  type="button"
                  onClick={() => onReorder(order.item)}
                  className="px-3 py-1.5 rounded-lg border border-[#E53935] text-[#E53935] hover:bg-red-50 text-xs font-semibold transition-colors cursor-pointer"
                >
                  Order Again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
