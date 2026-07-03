import { prisma } from "@/lib/prisma";
import { weekdayIndexFromDate } from "@/lib/config";
import type { DailyRow, RawRow } from "@/lib/types";

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

// GET /api/data?view=raw|daily&start=YYYY-MM-DD&end=YYYY-MM-DD
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const view = searchParams.get("view") === "daily" ? "daily" : "raw";
  const start = searchParams.get("start");
  const end = searchParams.get("end");

  const dateFilter: { gte?: string; lte?: string } = {};
  if (start && DATE_RE.test(start)) dateFilter.gte = start;
  if (end && DATE_RE.test(end)) dateFilter.lte = end;

  const rows = await prisma.wasteEntry.findMany({
    where: Object.keys(dateFilter).length ? { date: dateFilter } : {},
    select: {
      date: true,
      slot: true,
      quantity: true,
      menuItem: {
        select: {
          name: true,
          category: { select: { name: true } },
        },
      },
    },
    orderBy: [{ date: "desc" }, { slot: "desc" }],
  });

  if (view === "raw") {
    const raw: RawRow[] = rows.map((r) => ({
      date: r.date,
      slot: r.slot,
      categoryName: r.menuItem.category.name,
      menuName: r.menuItem.name,
      quantity: r.quantity,
    }));
    return Response.json({ view: "raw", rows: raw });
  }

  // 日次集計（分析用のクリーンなデータ）
  const dailyMap = new Map<string, DailyRow>();
  for (const r of rows) {
    let row = dailyMap.get(r.date);
    if (!row) {
      row = {
        date: r.date,
        weekday: weekdayIndexFromDate(r.date),
        total: 0,
        byCategory: {},
      };
      dailyMap.set(r.date, row);
    }
    row.total += r.quantity;
    const cat = r.menuItem.category.name;
    row.byCategory[cat] = (row.byCategory[cat] ?? 0) + r.quantity;
  }

  const daily = [...dailyMap.values()].sort((a, b) =>
    b.date.localeCompare(a.date),
  );

  return Response.json({ view: "daily", rows: daily });
}
