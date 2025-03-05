"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState, useEffect } from "react";
import { BarChart, LineChart } from "@/components/ui/chart";
import { Users, MapPin, PackageSearch } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default function Dashboard() {
  const [locations, setLocations] = useState({ loading: true, data: [] });
  const [users, setUsers] = useState({ loading: true, data: [] });
  const [products, setProducts] = useState({ loading: true, data: [] });
  const [oos, setOOS] = useState({ loading: true, data: [] });

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("/api/locations/getCountLocations", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setLocations({ data: data, loading: false });
      });

    fetch("/api/users/getCountUsers", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setUsers({ data: data, loading: false });
      });

    fetch("/api/masterdata/products/getCountProducts", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        setProducts({ data: data, loading: false });
      });

    fetch(
      "/api/locations/getLocationsOOS?" +
        new URLSearchParams({
          limit: 10,
        }),
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    )
      .then((res) => res.json())
      .then((data) => {
        setOOS({ data: data, loading: false });
      });
  }, []);

  return (
    <div className="flex flex-col min-h-screen font-sans">
      <main className="flex-grow p-6">
        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <StatCard
            title="Locations Covered"
            value={locations.loading ? "..." : locations.data}
            icon={<MapPin className="h-6 w-6" />}
          />
          <StatCard
            title="Active Users"
            value={users.loading ? "..." : users.data}
            icon={<Users className="h-6 w-6" />}
          />
          <StatCard
            title="Active Products"
            value={products.loading ? "..." : products.data}
            icon={<PackageSearch className="h-6 w-6" />}
          />
        </div>

        <div className="grid gap-4 md:grid-cols-3 mb-8">
          <div className="bg-white border border-gray-200 p-4 rounded-xl shadow-md">
            <h2 className="text-sm font-medium text-gray-500 mt-2">
              Locations with most Out-of-Stock SKUs
            </h2>
            <div>
              <Table className="text-xs text-gray-400 -mx-2 mt-6">
                <TableHeader>
                  <TableRow className="">
                    <TableHead className="text-left text-indigo-800">
                      Location
                    </TableHead>
                    <TableHead className="text-center text-indigo-800">
                      OOS SKU Count
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {oos.loading ? (
                    <tr>
                      <td colSpan="2">Loading...</td>
                    </tr>
                  ) : (
                    oos.data.map((location, index) => (
                      <TableRow key={index}>
                        <TableCell className="text-left">
                          {location.name}
                        </TableCell>
                        <TableCell className="text-center">
                          {location.count}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </div>

        {/* 
        <div className="grid gap-6 md:grid-cols-2">
          <ChartCard title="Share of Shelf" chart={<BarChart />} />
          <ChartCard title="In-Store Availability" chart={<BarChart />} />
          <ChartCard title="Delivery Timeliness" chart={<LineChart />} />
          <ChartCard title="Top Performing Locations" chart={<BarChart />} />
          <ChartCard title="Sales by Category" chart={<BarChart />} />
          <ChartCard title="Customer Satisfaction" chart={<LineChart />} />
        </div>
        */}
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
