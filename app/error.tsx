"use client";

import { Button } from "@heroui/react";

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-4 text-center">
      <h1 className="text-2xl font-bold text-ink">Something went wrong</h1>
      <p className="mt-2 text-ink/60">Please reload the page and try again.</p>
      <Button color="secondary" className="mt-6" onPress={() => reset()}>Reload</Button>
    </div>
  );
}
