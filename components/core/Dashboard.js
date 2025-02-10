"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
//import { BarChart, LineChart } from "recharts";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Users, MapPin, Building } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen font-sans">
      <main className="flex-grow p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <StatCard
            title="Locations Covered"
            value="1,234"
            icon={<MapPin className="h-6 w-6" />}
          />
          <StatCard
            title="Active Users"
            value="5,678"
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title="Covered Customers"
            value="126"
            icon={<Building className="h-6 w-6" />}
          />
        </div>
        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard title="Share of Shelf" chart={<BarChart />} />
          <ChartCard title="In-Store Availability" chart={<BarChart />} />
          <ChartCard title="Delivery Timeliness" chart={<LineChart />} />
          <ChartCard title="Top Performing Locations" chart={<BarChart />} />
          <ChartCard title="Sales by Category" chart={<BarChart />} />
          <ChartCard title="Customer Satisfaction" chart={<LineChart />} />
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value, icon }) {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-gray-500">
          {title}
        </CardTitle>
        {icon}
      </CardHeader>
      <CardContent>
        <div className="text-4xl font-bold text-indigo-700">{value}</div>
      </CardContent>
    </Card>
  );
}

function ChartCard({ title, chart }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-medium text-gray-700">
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>{chart}</CardContent>
    </Card>
  );
}
