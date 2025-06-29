// components/ui/StarRating.tsx
import { Star } from 'lucide-react';
import { cn } from '@/lib/utils';

type StarRatingProps = {
  rating: number;
  totalReviews?: number;
  className?: string;
};

export function StarRating({ rating, totalReviews, className }: StarRatingProps) {
  const fullStars = Math.floor(rating);
  const halfStar = rating % 1 !== 0;
  const emptyStars = 5 - fullStars - (halfStar ? 1 : 0);

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <div className="flex items-center">
        {[...Array(fullStars)].map((_, i) => (
          <Star key={`full-${i}`} className="h-4 w-4 text-yellow-400 fill-yellow-400" />
        ))}
        {/* We'll keep it simple and not show half stars for this example */}
        {[...Array(emptyStars)].map((_, i) => (
          <Star key={`empty-${i}`} className="h-4 w-4 text-gray-300 fill-gray-300" />
        ))}
      </div>
      {totalReviews !== undefined && (
        <span className="text-xs text-gray-500">({totalReviews})</span>
      )}
    </div>
  );
}