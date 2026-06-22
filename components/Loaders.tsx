import { Spinner as HeroSpinner, Skeleton, Card, CardBody } from "@heroui/react";

export function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <HeroSpinner color="secondary" size="lg" />
    </div>
  );
}

export function ArtworkCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <Skeleton className="h-48 w-full rounded-none" />
      <CardBody className="space-y-2 p-4">
        <Skeleton className="h-4 w-3/4 rounded" />
        <Skeleton className="h-3 w-1/2 rounded" />
        <Skeleton className="h-4 w-1/4 rounded" />
      </CardBody>
    </Card>
  );
}

export function TableRowSkeleton({ cols = 4 }: { cols?: number }) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) => (
        <td key={i} className="p-3">
          <Skeleton className="h-4 w-full rounded" />
        </td>
      ))}
    </tr>
  );
}
