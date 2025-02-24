"use client";

import { Card, Metric, Text, AreaChart } from "@tremor/react";
import { Battery, Bolt, Users } from "lucide-react";

const mockData = {
  batteryStats: [
    { date: "2024-01", "Active Batteries": 45, "Energy Traded (kWh)": 1200 },
    { date: "2024-02", "Active Batteries": 58, "Energy Traded (kWh)": 1600 },
    { date: "2024-03", "Active Batteries": 75, "Energy Traded (kWh)": 2100 },
  ],
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-black/5 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <Battery className="text-[#f78a1d]" />
            <Text>Active Batteries</Text>
          </div>
          <Metric className="text-[#f78a1d]">75</Metric>
        </Card>
        <Card className="bg-black/5 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <Bolt className="text-[#f78a1d]" />
            <Text>Energy Traded Today</Text>
          </div>
          <Metric className="text-[#f78a1d]">2,100 kWh</Metric>
        </Card>
        <Card className="bg-black/5 backdrop-blur-lg">
          <div className="flex items-center gap-2">
            <Users className="text-[#f78a1d]" />
            <Text>Active Users</Text>
          </div>
          <Metric className="text-[#f78a1d]">324</Metric>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <Card className="bg-black/5 backdrop-blur-lg">
          <Text>Platform Performance</Text>
          <AreaChart
            className="h-72 mt-4"
            data={mockData.batteryStats}
            index="date"
            categories={["Active Batteries", "Energy Traded (kWh)"]}
            colors={["orange", "indigo"]}
          />
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="bg-black/5 backdrop-blur-lg">
          <Text>Recent Battery Leases</Text>
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between p-2 rounded-lg bg-black/5"
              >
                <div className="flex items-center gap-2">
                  <Battery className="text-[#f78a1d]" />
                  <div>
                    <Text>Battery #{i}</Text>
                    <Text className="text-xs text-gray-500">
                      Leased 2h ago • Health: 98%
                    </Text>
                  </div>
                </div>
                <Text>Active</Text>
              </div>
            ))}
          </div>
        </Card>

        <Card className="bg-black/5 backdrop-blur-lg">
          <Text>AI Maintenance Alerts</Text>
          <div className="mt-4 space-y-2">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="p-2 rounded-lg bg-black/5"
              >
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-yellow-500" />
                  <Text>Battery #{i} requires maintenance</Text>
                </div>
                <Text className="text-xs text-gray-500 ml-4">
                  Predicted capacity degradation in 2 weeks
                </Text>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
