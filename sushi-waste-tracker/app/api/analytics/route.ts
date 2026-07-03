import { prisma } from "@/lib/prisma";
import { WEEKDAY_LABELS, weekdayIndexFromDate } from "@/lib/config";
import type {
  AnalyticsResponse,
  CategoryBreakdown,
  MonthlyPoint,
  WeekdayPoint,
  YearlyPoint,
} from "@/lib/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// GET /api/analytics?start=YYYY-MM-DD&end=YYYY-MM-DD&category=slug
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  const categorySlug = searchParams.get("category");

  const dateFilter: { gte?: string; lte?: string } = {};
  if (start && DATE_RE.test(start)) dateFilter.gte = start;
  if (end && DATE_RE.test(end)) dateFilter.lte = end;

  const rows = await prisma.wasteEntry.findMany({
    where: {
      ...(Object.keys(dateFilter).length ? { date: dateFilter } : {}),
      ...(categorySlug
        ? { menuItem: { category: { slug: categorySlug } } }
        : {}),
    },
    select: {
      date: true,
      quantity: true,
      menuItem: {
        select: { category: { select: { name: true } } },
      },
    },
    orderBy: { date: "asc" },
  });

  const monthlyMap = new Map<string, number>();
  const yearlyMap = new Map<string, number>();
  const weekdayTotals = new Array(7).fill(0) as number[];
  const weekdayDays: Array<Set<string>> = Array.from(
    { length: 7 },
    () => new Set<string>(),
  );
  const categoryMap = new Map<string, number>();

  let totalCount = 0;
  let rangeStart: string | null = null;
  let rangeEnd: string | null = null;

  for (const r of rows) {
    const q = r.quantity;
    totalCount += q;

    const month = r.date.slice(0, 7);
    const year = r.date.slice(0, 4);
    monthlyMap.set(month, (monthlyMap.get(month) ?? 0) + q);
    yearlyMap.set(year, (yearlyMap.get(year) ?? 0) + q);

    const wd = weekdayIndexFromDate(r.date);
    weekdayTotals[wd] += q;
    weekdayDays[wd].add(r.date);

    const catName = r.menuItem.category.name;
    categoryMap.set(catName, (categoryMap.get(catName) ?? 0) + q);

    if (!rangeStart || r.date < rangeStart) rangeStart = r.date;
    if (!rangeEnd || r.date > rangeEnd) rangeEnd = r.date;
  }

  const monthly: MonthlyPoint[] = [...monthlyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([period, total]) => ({ period, total }));

  const yearly: YearlyPoint[] = [...yearlyMap.entries()]
    .sort((a, b) => a[0].localeCompare(b[0]))
    .map(([period, total]) => ({ period, total }));

  // 曜日別は月曜始まりで並べる（月火水木金土日）
  const order = [1, 2, 3, 4, 5, 6, 0];
  const weekday: WeekdayPoint[] = order.map((wd) => {
    const days = weekdayDays[wd].size;
    const total = weekdayTotals[wd];
    return {
      weekday: wd,
      label: WEEKDAY_LABELS[wd],
      total,
      days,
      avg: days > 0 ? Math.round((total / days) * 10) / 10 : 0,
    };
  });

  const byCategory: CategoryBreakdown[] = [...categoryMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .map(([name, total]) => ({ name, total }));

  const response: AnalyticsResponse = {
    monthly,
    yearly,
    weekday,
    byCategory,
    totalCount,
    rangeStart,
    rangeEnd,
  };

  return Response.json(response);
}
