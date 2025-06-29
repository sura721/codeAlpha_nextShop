'use client';

import { useClerk } from "@clerk/nextjs";
import { User as UserIcon } from "lucide-react";

export function UserAccountTrigger() {
  const { openUserProfile } = useClerk();

  const handleOpenUserButton = () => {
    if (openUserProfile) {
      openUserProfile();
    }
  };

  return (
    <button
      onClick={handleOpenUserButton}
      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
    >
      <UserIcon className="h-4 w-4 mr-2" />
      Account
    </button>
  );
}