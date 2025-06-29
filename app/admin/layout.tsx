import { redirect } from 'next/navigation';
import { checkIsAdmin } from '@/lib/actions/user.actions'; // Adjust path if needed
import AdminLayoutClient from '@/components/admin/AdminLayoutClient'; // Adjust path if needed

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