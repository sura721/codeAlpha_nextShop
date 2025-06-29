'use client';

import { useState } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar'; // Adjust path if needed
import { Menu } from 'lucide-react';

export default function AdminLayoutClient({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-100">
      <AdminSidebar isOpen={isSidebarOpen} setIsOpen={setIsSidebarOpen} />
      
      <div className="lg:ml-64">
        {/* Mobile Header */}
        <header className="lg:hidden sticky top-0 bg-white/80 backdrop-blur-md border-b border-slate-200 z-30">
          <div className="flex items-center justify-between h-16 px-4 sm:px-6">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="text-slate-500 hover:text-slate-600"
            >
              <span className="sr-only">Open sidebar</span>
              <Menu className="h-6 w-6" />
            </button>
            <div className="text-lg font-bold text-slate-800">Admin Panel</div>
          </div>
        </header>

        {/* Main Content */}
        <main className="p-4 sm:p-6 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}