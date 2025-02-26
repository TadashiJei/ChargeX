'use client';

import { DashboardLayout } from '@/components/dashboard/layout';
import BatteryLeasing from '@/components/BatteryLeasing';

export default function BatteryLeasingPage() {
  return (
    <DashboardLayout>
      <BatteryLeasing />
    </DashboardLayout>
  );
}
