import prisma from '@/lib/prisma';
import UserRoleSwitcher from '@/components/admin/UserRoleSwitcher';

// Helper component for the "Admin" badge
function AdminBadge() {
  return (
    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
      Admin
    </span>
  );
}

async function getUsers() {
  const users = await prisma.user.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
  return users;
}

export default async function AdminUsersPage() {
  const users = await getUsers();

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-slate-800">Users</h1>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50">
              <tr>
                <th className="p-4 text-sm font-semibold text-slate-600">User</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Email</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Role</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Joined</th>
                <th className="p-4 text-sm font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="border-b border-slate-200 hover:bg-slate-50">
                  <td className="p-4 text-sm font-medium text-slate-800">{user.name || 'N/A'}</td>
                  <td className="p-4 text-sm text-slate-600">{user.email}</td>
                  <td className="p-4">{user.admin && <AdminBadge />}</td>
                  <td className="p-4 text-sm text-slate-600">{user.createdAt.toLocaleDateString()}</td>
                  <td className="p-4">
                    <UserRoleSwitcher userId={user.id} isAdmin={user.admin} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-4">
        {users.map((user) => (
          <div key={user.id} className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 space-y-4">
            <div>
              <div className="flex justify-between items-start">
                <p className="font-semibold text-slate-800">{user.name || 'N/A'}</p>
                {user.admin && <AdminBadge />}
              </div>
              <p className="text-sm text-slate-500">{user.email}</p>
              <p className="text-xs text-slate-400 mt-1">Joined: {user.createdAt.toLocaleDateString()}</p>
            </div>
            <div className="pt-4 border-t border-slate-200">
              <UserRoleSwitcher userId={user.id} isAdmin={user.admin} />
            </div>
          </div>
        ))}
      </div>
      
      {users.length === 0 && (
        <div className="text-center p-8 bg-white rounded-lg shadow-sm border border-slate-200">
          <p className="text-slate-500">No users found.</p>
        </div>
      )}
    </div>
  );
}