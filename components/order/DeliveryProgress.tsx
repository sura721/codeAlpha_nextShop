 
"use client";

import { useEffect, useState } from 'react';

type DeliveryProgressProps = {
  orderCreatedAt: Date;
  deliveryEstimateString: string; 
};

 const addDays = (date: Date, days: number): Date => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

 const formatDate = (date: Date): string => {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export default function DeliveryProgress({ orderCreatedAt, deliveryEstimateString }: DeliveryProgressProps) {
  const [progress, setProgress] = useState(0);
  const [estimatedDelivery, setEstimatedDelivery] = useState({ start: new Date(), end: new Date() });

  useEffect(() => {
     const daysMatch = deliveryEstimateString.match(/\d+/g);
    if (!daysMatch) return;

    const minDays = parseInt(daysMatch[0], 10);
    const maxDays = daysMatch.length > 1 ? parseInt(daysMatch[1], 10) : minDays;
    
    const startDate = addDays(orderCreatedAt, 0);  
    const estimatedStartDate = addDays(orderCreatedAt, minDays);
    const estimatedEndDate = addDays(orderCreatedAt, maxDays);
    setEstimatedDelivery({ start: estimatedStartDate, end: estimatedEndDate });

    const totalDuration = estimatedEndDate.getTime() - startDate.getTime();
    
    const updateProgress = () => {
        const now = new Date();
        const elapsed = now.getTime() - startDate.getTime();
        let currentProgress = (elapsed / totalDuration) * 100;
        
         currentProgress = Math.max(0, Math.min(100, currentProgress));
        setProgress(currentProgress);
    };

    updateProgress();
    const interval = setInterval(updateProgress, 60000); 

    return () => clearInterval(interval);

  }, [orderCreatedAt, deliveryEstimateString]);

  return (
    <div>
        <div className="flex justify-between items-center text-sm font-medium text-gray-600">
            <span>Order Placed</span>
            <span className="text-right">Estimated Delivery: {formatDate(estimatedDelivery.start)} - {formatDate(estimatedDelivery.end)}</span>
            <span>Delivered</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${progress}%` }}></div>
        </div>
        <div className="mt-2 text-xs text-gray-500 text-center">
            {progress < 100 ? 'In Transit' : 'Delivered'}
        </div>
    </div>
  );
}