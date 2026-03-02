import { SatelliteMonitor } from "@/components/dashboard/satellite-monitor";

export default function SatellitePage() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const isProduction = process.env.NODE_ENV === 'production';

  return <SatelliteMonitor apiKey={apiKey} isProduction={isProduction} />;
}
