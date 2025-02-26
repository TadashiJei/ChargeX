'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import BatteryMonitor from '@/components/BatteryMonitor';

export default function BatteryMonitorPage() {
  return (
    <DashboardLayout>
      <BatteryMonitor />
    </DashboardLayout>
  );
}
