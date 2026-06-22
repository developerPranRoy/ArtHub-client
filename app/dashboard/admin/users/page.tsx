"use client";

import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Card } from "@heroui/react";
import api from "../../../../lib/api";
import ProtectedRoute from "../../../../components/ProtectedRoute";
import { TableRowSkeleton } from "../../../../components/Loaders";
import { User } from "../../../../lib/types";

function ManageUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/users").then((res) => setUsers(res.data)).finally(() => setLoading(false));
  }, []);

  async function changeRole(id: string, role: string) {
    try {
      await api.patch(`/users/${id}/role`, { role });
      setUsers((u) => u.map((usr) => (usr._id === id ? { ...usr, role: role as User["role"] } : usr)));
      toast.success("Role updated");
    } catch {
      toast.error("Could not update role");
    }
  }

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="mb-6 text-2xl font-bold text-ink">Manage Users</h1>
      <Card className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-brand-50 text-ink/70">
            <tr><th className="p-3">Name</th><th className="p-3">Email</th><th className="p-3">Role</th><th className="p-3">Change Role</th></tr>
          </thead>
          <tbody>
            {loading ? (
              Array.from({ length: 5 }).map((_, i) => <TableRowSkeleton key={i} cols={4} />)
            ) : (
              users.map((u) => (
                <tr key={u._id} className="border-t border-black/5">
                  <td className="p-3">{u.name}</td>
                  <td className="p-3">{u.email}</td>
                  <td className="p-3 capitalize">{u.role}</td>
                  <td className="p-3">
                    <select defaultValue={u.role} onChange={(e) => changeRole(u._id, e.target.value)} className="input py-1">
                      <option value="user">User</option>
                      <option value="artist">Artist</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

export default function ManageUsersPage() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ManageUsers />
    </ProtectedRoute>
  );
}
