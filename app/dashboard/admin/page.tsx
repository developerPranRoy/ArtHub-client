"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardBody } from "@heroui/react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import api from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { Spinner } from "../../../components/Loaders";
import { AdminAnalytics } from "../../../lib/types";

const COLORS = ["#9518c0", "#d75fff", "#75139a", "#e89bff", "#58107a"];

function AdminOverview() {
  const [data, setData] = useState<AdminAnalytics | null>(null);

  useEffect(() => {
    api.get("/transactions/analytics").then((res) => setData(res.data));
  }, []);

  const cards = data
    ? [
        { label: "Total Users", value: data.totalUsers },
        { label: "Total Artists", value: data.totalArtists },
        { label: "Artworks Sold", value: data.totalArtworksSold },
        { label: "Total Revenue", value: `$${data.totalRevenue.toFixed(2)}` },
      ]
    : [];

  const chartData = data?.categoryBreakdown.map((c) => ({ name: c._id || "Uncategorized", count: c.count })) || [];

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-ink">Admin Dashboard</h1>
      <p className="mb-8 text-ink/60">Platform overview and analytics</p>

      {!data ? (
        <Spinner />
      ) : (
        <>
          <div className="mb-10 grid grid-cols-2 gap-4 md:grid-cols-4">
            {cards.map((c) => (
              <Card key={c.label}>
                <CardBody className="p-5">
                  <p className="text-sm text-ink/60">{c.label}</p>
                  <p className="mt-1 text-2xl font-bold text-brand-700">{c.value}</p>
                </CardBody>
              </Card>
            ))}
          </div>

          <div className="mb-10 grid gap-6 md:grid-cols-2">
            <Card>
              <CardBody className="p-5">
                <h2 className="mb-3 text-lg font-bold text-ink">Artworks by Category</h2>
                {chartData.length === 0 ? (
                  <p className="text-sm text-ink/50">No data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                      <YAxis allowDecimals={false} />
                      <Tooltip />
                      <Bar dataKey="count" fill="#9518c0" radius={[6, 6, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </CardBody>
            </Card>

            <Card>
              <CardBody className="p-5">
                <h2 className="mb-3 text-lg font-bold text-ink">Category Share</h2>
                {chartData.length === 0 ? (
                  <p className="text-sm text-ink/50">No data yet.</p>
                ) : (
                  <ResponsiveContainer width="100%" height={260}>
                    <PieChart>
                      <Pie data={chartData} dataKey="count" nameKey="name" outerRadius={90} label>
                        {chartData.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </CardBody>
            </Card>
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-4">
        <Button as={Link} href="/dashboard/admin/users" variant="bordered" color="secondary">Manage Users</Button>
        <Button as={Link} href="/dashboard/admin/artworks" variant="bordered" color="secondary">Manage Artworks</Button>
        <Button as={Link} href="/dashboard/admin/transactions" variant="bordered" color="secondary">View Transactions</Button>
      </div>
    </div>
  );
}

export default function AdminDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AdminOverview />
    </ProtectedRoute>
  );
}
