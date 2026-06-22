"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input, Button, Card, CardBody } from "@heroui/react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function LoginPage() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/auth/login", form);
      login(res.data.token, res.data.user);
      toast.success("Welcome back!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <Card>
        <CardBody className="p-8">
          <h1 className="mb-6 text-2xl font-bold text-ink">Login to ArtHub</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              label="Email"
              type="email"
              isRequired
              value={form.email}
              onValueChange={(v) => setForm({ ...form, email: v })}
            />
            <Input
              label="Password"
              type="password"
              isRequired
              value={form.password}
              onValueChange={(v) => setForm({ ...form, password: v })}
            />
            <Button type="submit" color="secondary" className="w-full" isLoading={loading}>
              Login
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-ink/60">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="font-medium text-brand-700">
              Register
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
