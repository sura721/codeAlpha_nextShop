'use client';

import { useTransition } from 'react';
import { toggleUserAdminStatus } from '@/lib/actions/user.actions';
import { Switch } from '@/components/ui/switch';

type UserRoleSwitcherProps = {
  userId: string;
  isAdmin: boolean;
};

export default function UserRoleSwitcher({ userId, isAdmin }: UserRoleSwitcherProps) {
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(() => {
      toggleUserAdminStatus(userId);
    });
  };

  return (
    <div className="flex items-center space-x-2">
      <Switch
        id={`admin-switch-${userId}`}
        checked={isAdmin}
        onCheckedChange={handleToggle}
        disabled={isPending}
      />
      <label htmlFor={`admin-switch-${userId}`} className="text-sm font-medium text-slate-700">
        Admin
      </label>
    </div>
  );
}