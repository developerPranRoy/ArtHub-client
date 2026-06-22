"use client";

import { Pagination as HeroPagination } from "@heroui/react";

interface Props {
  page: number;
  totalPages: number;
  onChange: (page: number) => void;
}

export default function Pagination({ page, totalPages, onChange }: Props) {
  if (totalPages <= 1) return null;

  return (
    <div className="mt-8 flex justify-center">
      <HeroPagination
        total={totalPages}
        page={page}
        onChange={onChange}
        color="secondary"
        showControls
      />
    </div>
  );
}
