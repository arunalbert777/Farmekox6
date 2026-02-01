import { DirectSalesClient } from '@/components/dashboard/direct-sales-client';

export default function DirectSalesPage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isProduction = process.env.NODE_ENV === 'production';
  return <DirectSalesClient apiKey={apiKey} isProduction={isProduction} />;
}
