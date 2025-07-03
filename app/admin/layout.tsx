import { redirect } from 'next/navigation';
import { checkIsAdmin } from '@/lib/actions/user.actions'; 
import AdminLayoutClient from '@/components/admin/AdminLayoutClient';  

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAdmin = await checkIsAdmin();

  if (!isAdmin) {
    redirect('/');
  }

  return <AdminLayoutClient>{children}</AdminLayoutClient>;
}