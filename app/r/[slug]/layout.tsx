import BottomNav from '@/components/BottomNav';
import FloatingCart from '@/components/FloatingCart';
import WaiterFab from '@/components/WaiterFab';

export default function RestaurantLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen pb-[92px] bg-cream-50">
      <div className="max-w-screen-sm mx-auto bg-cream-50 min-h-screen relative">
        {children}
        <WaiterFab />
        <FloatingCart />
      </div>
      <BottomNav />
    </div>
  );
}
