interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded-lg ${className}`} />
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="bg-white rounded-xl border border-slate-200 p-5">
            <Skeleton className="h-4 w-24 mb-4" />
            <Skeleton className="h-8 w-16 mb-2" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>
      <div className="bg-white rounded-xl border border-slate-200 p-5">
        <Skeleton className="h-5 w-32 mb-4" />
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex gap-4 py-3 border-b border-slate-100 last:border-0">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-48" />
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-4 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function TicketTableSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200">
      <div className="p-4 border-b border-slate-200">
        <div className="flex gap-3">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 w-32" />
          <Skeleton className="h-9 w-32" />
        </div>
      </div>
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="flex items-center gap-4 px-4 py-4 border-b border-slate-100 last:border-0">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 flex-1" />
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-6 w-16 rounded-full" />
          <Skeleton className="h-6 w-20 rounded-full" />
          <Skeleton className="h-4 w-16" />
        </div>
      ))}
    </div>
  );
}

export function TicketDetailsSkeleton() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex gap-3 mb-4">
          <Skeleton className="h-6 w-24 rounded-full" />
          <Skeleton className="h-6 w-24 rounded-full" />
        </div>
        <Skeleton className="h-7 w-3/4 mb-2" />
        <Skeleton className="h-4 w-32" />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
          <Skeleton className="h-4 w-4/6" />
        </div>
        <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20 mb-1" />
              <Skeleton className="h-4 w-32" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ProfileSkeleton() {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6">
      <div className="flex items-center gap-4 mb-6">
        <Skeleton className="w-20 h-20 rounded-full" />
        <div>
          <Skeleton className="h-6 w-40 mb-2" />
          <Skeleton className="h-4 w-24" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i}>
            <Skeleton className="h-3 w-24 mb-1" />
            <Skeleton className="h-5 w-40" />
          </div>
        ))}
      </div>
    </div>
  );
}
