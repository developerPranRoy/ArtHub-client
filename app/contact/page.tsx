"use client";

import { useState, FormEvent } from "react";
import toast from "react-hot-toast";
import { Input, Textarea, Button, Card, CardBody } from "@heroui/react";

export default function ContactPage() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    toast.success("Message sent! We'll get back to you soon.");
    setForm({ name: "", email: "", message: "" });
  }

  return (
    <div className="mx-auto max-w-md px-4 py-16">
      <h1 className="mb-6 text-3xl font-bold text-ink">Contact Us</h1>
      <Card>
        <CardBody className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input label="Your name" isRequired value={form.name} onValueChange={(v) => setForm({ ...form, name: v })} />
            <Input type="email" label="Your email" isRequired value={form.email} onValueChange={(v) => setForm({ ...form, email: v })} />
            <Textarea label="Your message" isRequired minRows={4} value={form.message} onValueChange={(v) => setForm({ ...form, message: v })} />
            <Button type="submit" color="secondary" className="w-full">Send Message</Button>
          </form>
        </CardBody>
      </Card>
    </div>
  );
}
