"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowDownUp,
  Banknote,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  DollarSign,
  Percent,
  Receipt,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Loading } from "@/components/shared/Loading";
import { ErrorState } from "@/components/shared/ErrorState";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useInstructorEarnings, type InstructorEarningsData } from "@/hooks/useInstructorData";
import { useAuth } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

type TimeRange = 3 | 6 | 12;
type SortDirection = "asc" | "desc";

const PAGE_SIZE = 10;

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value || 0);
}

function formatCurrencyDetailed(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

function statusClassName(status: string) {
  switch (status) {
    case "SUCCESS":
      return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300";
    case "PENDING":
      return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-300";
    case "REFUNDED":
      return "border-red-200 bg-red-50 text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300";
    default:
      return "border-border text-muted-foreground";
  }
}

function StatCard({
  label,
  value,
  trend,
  icon: Icon,
}: {
  label: string;
  value: string;
  trend: string;
  icon: typeof DollarSign;
}) {
  return (
    <div className="rounded-xl border bg-card p-6 shadow-sm transition-shadow hover:shadow-md">
      <div className="mb-3 flex items-center justify-between">
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">{label}</p>
        <Icon className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-2xl font-bold tabular-nums">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{trend}</p>
    </div>
  );
}

function EarningsTableSkeleton() {
  return (
    <div className="space-y-3 p-4">
      {Array.from({ length: 5 }).map((_, index) => (
        <Skeleton key={index} className="h-12 w-full" />
      ))}
    </div>
  );
}

export default function InstructorEarningsPage() {
  const router = useRouter();
  const { data: session, isPending: isAuthLoading } = useAuth();
  const { data: earningsResponse, isLoading, isError, refetch } = useInstructorEarnings();
  const [timeRange, setTimeRange] = useState<TimeRange>(12);
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!isAuthLoading && !session) {
      router.push("/auth/login");
    } else if (session && !["INSTRUCTOR", "MANAGER", "ADMIN"].includes((session.user as { role?: string }).role || "")) {
      router.push("/dashboard");
    }
  }, [session, isAuthLoading, router]);

  const data: InstructorEarningsData | undefined = earningsResponse?.data;
  const stats = data?.stats;
  const chartData = useMemo(
    () => (data?.monthlyEarnings || []).slice(-timeRange),
    [data?.monthlyEarnings, timeRange]
  );
  const sortedCourses = useMemo(() => {
    const courses = [...(data?.courseEarnings || [])];
    courses.sort((a, b) => (sortDirection === "desc" ? b.net - a.net : a.net - b.net));
    return courses;
  }, [data?.courseEarnings, sortDirection]);

  const transactions = data?.recentTransactions || [];
  const totalPages = Math.max(1, Math.ceil(transactions.length / PAGE_SIZE));
  const paginatedTransactions = transactions.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isAuthLoading || isLoading) return <Loading />;
  if (isError) return <ErrorState onRetry={() => refetch()} />;

  return (
    <div className="space-y-8">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Earnings</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track revenue, platform fees, course performance, and recent student purchases.
          </p>
        </div>
        <div className="flex gap-2">
          {[3, 6, 12].map((range) => (
            <Button
              key={range}
              type="button"
              variant={timeRange === range ? "default" : "outline"}
              size="sm"
              onClick={() => setTimeRange(range as TimeRange)}
            >
              {range}M
            </Button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <StatCard
          label="Total Earnings"
          value={formatCurrency(stats?.totalNet || 0)}
          trend={`${formatCurrency(stats?.totalGross || 0)} gross all time`}
          icon={Wallet}
        />
        <StatCard
          label="This Month"
          value={formatCurrency(stats?.thisMonthNet || 0)}
          trend={`${formatCurrency(stats?.thisMonthGross || 0)} gross this month`}
          icon={TrendingUp}
        />
        <StatCard
          label="Pending Payouts"
          value={formatCurrency(stats?.pendingPayouts || 0)}
          trend="Estimated payable balance"
          icon={Banknote}
        />
        <StatCard
          label="Platform Fee"
          value={`${stats?.platformFeePercent || 20}%`}
          trend="Deducted from gross revenue"
          icon={Percent}
        />
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold">Earnings Trend</h2>
            <p className="text-sm text-muted-foreground">Gross and net earnings across the selected period.</p>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-primary" /> Gross
            </span>
            <span className="inline-flex items-center gap-1">
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" /> Net
            </span>
          </div>
        </div>
        <div className="h-[360px] p-6">
          {chartData.length ? (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="grossFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.18} />
                    <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="netFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160 84% 39%)" stopOpacity={0.16} />
                    <stop offset="95%" stopColor="hsl(160 84% 39%)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="hsl(var(--border))" opacity={0.6} />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 12, fill: "hsl(var(--muted-foreground))" }}
                  tickFormatter={(value: number) => `$${value}`}
                />
                <Tooltip
                  formatter={(value: number, name: string) => [formatCurrencyDetailed(value), name === "gross" ? "Gross" : "Net"]}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                />
                <Area type="monotone" dataKey="gross" stroke="hsl(var(--primary))" strokeWidth={2} fill="url(#grossFill)" />
                <Area type="monotone" dataKey="net" stroke="hsl(160 84% 39%)" strokeWidth={2} fill="url(#netFill)" />
              </AreaChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="mb-4 rounded-full bg-muted p-4">
                <CalendarDays className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="mb-2 text-lg font-semibold">No earnings trend yet</h3>
              <p className="max-w-sm text-sm text-muted-foreground">Monthly earnings will appear after students purchase your courses.</p>
            </div>
          )}
        </div>
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b p-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold">Earnings by Course</h2>
            <p className="text-sm text-muted-foreground">Net revenue after the 20% platform fee.</p>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2"
            onClick={() => setSortDirection((current) => (current === "desc" ? "asc" : "desc"))}
          >
            <ArrowDownUp className="h-4 w-4" /> Net {sortDirection === "desc" ? "High to Low" : "Low to High"}
          </Button>
        </div>
        {isLoading ? (
          <EarningsTableSkeleton />
        ) : sortedCourses.length ? (
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/40">
                <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Course Name</TableHead>
                <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Students</TableHead>
                <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Price</TableHead>
                <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Gross Revenue</TableHead>
                <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Platform Fee</TableHead>
                <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Net Revenue</TableHead>
                <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedCourses.map((course) => (
                <TableRow key={course.title} className="hover:bg-muted/30">
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{course.students}</TableCell>
                  <TableCell className="tabular-nums">{formatCurrencyDetailed(course.price)}</TableCell>
                  <TableCell className="tabular-nums">{formatCurrencyDetailed(course.gross)}</TableCell>
                  <TableCell className="tabular-nums text-muted-foreground">{formatCurrencyDetailed(course.fee)}</TableCell>
                  <TableCell className="font-semibold tabular-nums">{formatCurrencyDetailed(course.net)}</TableCell>
                  <TableCell>
                    <Badge variant="outline" className="rounded-md">
                      {course.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <Receipt className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No course earnings yet</h3>
            <p className="mb-6 max-w-sm text-sm text-muted-foreground">Course revenue will appear after your first successful student purchase.</p>
          </div>
        )}
      </div>

      <div className="rounded-xl border bg-card shadow-sm">
        <div className="flex flex-col justify-between gap-3 border-b p-4 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold">Recent Transactions</h2>
            <p className="text-sm text-muted-foreground">Showing up to 50 recent successful orders.</p>
          </div>
          <Badge variant="outline" className="w-fit rounded-md gap-1">
            <Receipt className="h-3 w-3" /> {transactions.length} transactions
          </Badge>
        </div>
        {paginatedTransactions.length ? (
          <>
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Student</TableHead>
                  <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Course</TableHead>
                  <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Date</TableHead>
                  <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Amount</TableHead>
                  <TableHead className="h-11 text-xs font-medium uppercase tracking-widest text-muted-foreground">Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedTransactions.map((transaction, index) => (
                  <TableRow key={`${transaction.studentEmail}-${transaction.date}-${index}`} className="hover:bg-muted/30">
                    <TableCell>
                      <div>
                        <p className="font-medium">{transaction.studentName || "Student"}</p>
                        <p className="text-xs text-muted-foreground">{transaction.studentEmail}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-[260px] truncate">{transaction.courseTitle}</TableCell>
                    <TableCell className="text-muted-foreground">{formatDate(transaction.date)}</TableCell>
                    <TableCell className="font-semibold tabular-nums">{formatCurrencyDetailed(transaction.amount)}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className={cn("rounded-md", statusClassName(transaction.status))}>
                        {transaction.status}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <div className="flex flex-col gap-3 border-t p-4 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((current) => Math.max(1, current - 1))}
                >
                  <ChevronLeft className="h-4 w-4" /> Previous
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
                >
                  Next <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 rounded-full bg-muted p-4">
              <DollarSign className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="mb-2 text-lg font-semibold">No transactions yet</h3>
            <p className="max-w-sm text-sm text-muted-foreground">Recent student payments will be listed here after checkout succeeds.</p>
          </div>
        )}
      </div>
    </div>
  );
}
