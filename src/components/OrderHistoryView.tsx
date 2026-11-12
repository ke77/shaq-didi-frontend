import React from 'react';
import { FoodJointItem } from '../data/foodJoints';
import { CheckCircle2, Clock, MapPin, ArrowRight } from 'lucide-react';

export interface OrderRecord {
  id: string;
  item: FoodJointItem;
  menuItemName?: string;
  quantity: number;
  totalGHS?: number;
  amount?: string;
  personnel?: string;
  staffName?: string;
  staffPhone?: string;
  notes?: string;
  date: string;
  status: 'Pending' | 'Completed';
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
      <div className="flex items-center justify-between mb-6 pb-3 border-b border-[#DEE6EE]">
        <div>
          <h2 className="text-2xl font-bold text-[#212121] tracking-tight">Order History</h2>
          <p className="text-xs text-[#757575] mt-0.5">Your food dispatch and kitchen orders</p>
        </div>
        <button
          onClick={onBackToHome}
          className="text-xs font-semibold text-[#E53935] hover:underline cursor-pointer flex items-center gap-1"
        >
          <span>Browse Joints</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-[#F4F7FA] rounded-2xl border border-[#DEE6EE]">
          <Clock className="w-10 h-10 text-[#B5B5B5] mx-auto mb-2" />
          <h3 className="text-base font-semibold text-[#212121]">No Orders Yet</h3>
          <p className="text-xs text-[#757575] mt-1 max-w-xs mx-auto">
            Browse Haatso Station food joints and place your first meal order.
          </p>
          <button
            onClick={onBackToHome}
            className="mt-4 px-4 py-2 bg-[#FF6347] text-white text-xs font-semibold rounded-lg hover:bg-[#E53935] transition-colors cursor-pointer"
          >
            Explore Food Joints
          </button>
        </div>
      ) : (
        <div className="space-y-3.5">
          {orders.map((order) => (
            <div
              key={order.id}
              className="bg-white rounded-xl p-4 border border-[#DEE6EE] shadow-xs hover:border-[#CDD5E1] transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3.5">
                <img
                  src={order.item.image}
                  alt={order.item.name}
                  referrerPolicy="no-referrer"
                  className="w-14 h-14 rounded-lg object-cover bg-[#F4F7FA] shrink-0"
                />
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-[#212121] text-sm">{order.item.name}</h4>
                    <span
                      className={`inline-flex items-center gap-1 text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                        order.status === 'Completed'
                          ? 'bg-emerald-50 text-emerald-700'
                          : 'bg-[#FFA500]/15 text-[#DB8F05]'
                      }`}
                    >
                      {order.status === 'Completed' ? (
                        <CheckCircle2 className="w-3 h-3" />
                      ) : (
                        <Clock className="w-3 h-3" />
                      )}
                      {order.status}
                    </span>
                  </div>
                  {order.menuItemName && (
                    <p className="text-xs font-medium text-[#212121] mt-0.5">{order.menuItemName}</p>
                  )}
                  <div className="text-xs text-[#757575] flex flex-wrap items-center gap-x-3 gap-y-1 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#B5B5B5]" />
                      {order.item.location}
                    </span>
                    {order.amount && (
                      <>
                        <span>·</span>
                        <span className="font-semibold text-[#212121] tabular-nums">
                          GH₵ {order.amount}
                        </span>
                      </>
                    )}
                    {order.personnel && (
                      <>
                        <span>·</span>
                        <span className="text-[#E53935] font-medium">
                          Personnel: {order.personnel.split(' (')[0]}
                        </span>
                      </>
                    )}
                    <span>·</span>
                    <span>{order.date}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-end w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-[#DEE6EE]">
                <button
                  type="button"
                  onClick={() => onReorder(order.item)}
                  className="px-3 py-1.5 rounded-lg border border-[#FF6347] text-[#E53935] hover:bg-[#FFEBE7] text-xs font-semibold transition-colors cursor-pointer"
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
