"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import toast from "react-hot-toast";
import { Input, Button, Card, CardBody, RadioGroup, Radio } from "@heroui/react";
import api from "../../lib/api";
import { useAuth } from "../../context/AuthContext";

export default function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "user",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const router = useRouter();

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const res = await api.post("/auth/register", form);
      login(res.data.token, res.data.user);
      toast.success("Account created!");
      router.push("/");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col justify-center px-4 py-12">
      <Card>
        <CardBody className="p-8">
          <h1 className="mb-6 text-2xl font-bold text-ink">Create your account</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Full Name" isRequired value={form.name} onValueChange={(v) => setForm({ ...form, name: v })} />
            <Input label="Email" type="email" isRequired value={form.email} onValueChange={(v) => setForm({ ...form, email: v })} />
            <Input label="Password" type="password" isRequired value={form.password} onValueChange={(v) => setForm({ ...form, password: v })} />
            <Input label="Confirm Password" type="password" isRequired value={form.confirmPassword} onValueChange={(v) => setForm({ ...form, confirmPassword: v })} />

            <RadioGroup
              label="I want to join as"
              orientation="horizontal"
              value={form.role}
              onValueChange={(v) => setForm({ ...form, role: v })}
            >
              <Radio value="user">Buyer</Radio>
              <Radio value="artist">Artist</Radio>
            </RadioGroup>

            <Button type="submit" color="secondary" className="w-full" isLoading={loading}>
              Register
            </Button>
          </form>
          <p className="mt-4 text-center text-sm text-ink/60">
            Already have an account?{" "}
            <Link href="/login" className="font-medium text-brand-700">
              Login
            </Link>
          </p>
        </CardBody>
      </Card>
    </div>
  );
}
