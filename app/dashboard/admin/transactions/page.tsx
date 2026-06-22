"use client";

import { useEffect, useState } from "react";
import { Card } from "@heroui/react";
import api from "../../../../lib/api";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { TableRowSkeleton } from "../../../../components/Loaders";
import { Transaction } from "../../../../lib/types";

function AllTransactions() {
  const [txns, setTxns] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/transactions").then((res) => setTxns(res.data)).finally(() => setLoading(false));
  }, []);

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">All Transactions</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-ink/70">
            <tr><th className="p-3">Type</th><th className="p-3">Reference</th><th className="p-3">Amount</th><th className="p-3">Date</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
            ) : txns.length === 0 ? (
              <tr><td colSpan={4} className="p-4 text-center text-ink/50">No transactions yet.</td></tr>
            ) : (
              txns.map((t) => (
                <tr key={t._id} className="border-t border-black/5">
                  <td className="p-3 capitalize">{t.type}</td>
                  <td className="p-3">{t.artworkTitle || t.tier || "—"}</td>
                  <td className="p-3">${t.amount}</td>
                  <td className="p-3">{new Date(t.createdAt).toLocaleDateString()}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function AllTransactionsPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <AllTransactions />
    </ProtectedRoute>
  );
}
