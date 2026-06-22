"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button, Card, CardBody } from "@heroui/react";
import api from "../../../lib/api";
import ProtectedRoute from "../../../components/ProtectedRoute";
import { TableRowSkeleton } from "../../../components/Loaders";
import { useAuth } from "../../../context/AuthContext";
import { Transaction } from "../../../lib/types";

const TIERS = [
  { key: "free", label: "Free", price: "$0", max: "3 paintings" },
  { key: "pro", label: "Pro", price: "$9.99", max: "9 paintings" },
  { key: "premium", label: "Premium", price: "$19.99", max: "Unlimited" },
];

function UserDashboardContent() {
  const { user, setUser } = useAuth();
  const [purchases, setPurchases] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/transactions/mine").then((res) => setPurchases(res.data)).finally(() => setLoading(false));
  }, []);

  async function upgrade(tier: string) {
    if (tier === "free") return;
    try {
      // In production: this triggers Stripe Checkout for the subscription price first.
      const amount = tier === "pro" ? 9.99 : 19.99;
      await api.post("/transactions/subscribe", { tier, amount });
      const res = await api.patch("/users/me/subscription", { tier });
      setUser(res.data);
    } catch (err: any) {
      alert(err.response?.data?.message || "Upgrade failed");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-2 text-2xl font-bold text-ink">My Dashboard</h1>
      <p className="mb-8 text-ink/60">Welcome back, {user?.name}</p>

      {/* Subscription tiers */}
      <div className="mb-10 grid gap-4 md:grid-cols-3">
        {TIERS.map((t) => (
          <Card key={t.key} className={user?.subscriptionTier === t.key ? "border-2 border-brand-600" : ""}>
            <CardBody className="p-5">
              <h3 className="font-semibold text-ink">{t.label}</h3>
              <p className="my-1 text-2xl font-bold text-brand-700">{t.price}</p>
              <p className="mb-4 text-sm text-ink/60">{t.max}</p>
              <Button
                isDisabled={user?.subscriptionTier === t.key}
                onPress={() => upgrade(t.key)}
                variant="bordered"
                color="secondary"
                className="w-full"
              >
                {user?.subscriptionTier === t.key ? "Current Plan" : "Choose"}
              </Button>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Purchase history */}
      <h2 className="mb-4 text-xl font-bold text-ink">Purchase History</h2>
      <Card className="mb-6 overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-ink/70">
            <tr><th className="p-3">Artwork</th><th className="p-3">Price</th><th className="p-3">Date</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 3 }).map((_, i) => <TableRowSkeleton key={i} cols={3} />)
            ) : purchases.length === 0 ? (
              <tr><td colSpan={3} className="p-4 text-center text-ink/50">No purchases yet.</td></tr>
            ) : (
              purchases.map((p) => (
                <tr key={p._id} className="border-t border-black/5">
                  <td className="p-3">{p.artworkTitle}</td>
                  <td className="p-3">${p.amount}</td>
                  <td className="p-3">{new Date(p.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>

      <Button as={Link} href="/dashboard/user/profile" variant="bordered" color="secondary">Edit Profile</Button>
    </div>
  );
}

export default function UserDashboardPage() {
  return (
    <ProtectedRoute allowedRoles={["user"]}>
      <UserDashboardContent />
    </ProtectedRoute>
  );
}
