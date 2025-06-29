import { Loader2 } from 'lucide-react';

export default function Loading() {

  return (
    <div className="flex h-full min-h-[calc(100vh-200px)] items-center justify-center">
      <Loader2 className="h-12 w-12 animate-spin text-purple-600" />
    </div>
  );
}