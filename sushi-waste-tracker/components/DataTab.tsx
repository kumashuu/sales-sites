"use client";

import { useEffect, useState } from "react";
import { fetchData } from "@/lib/api";
import { slotLabel, WEEKDAY_LABELS } from "@/lib/config";
import type { DailyRow, RawRow } from "@/lib/types";

type View = "raw" | "daily";

export default function DataTab() {
  const [view, setView] = useState<View>("raw");
  const [rawRows, setRawRows] = useState<RawRow[]>([]);
  const [dailyRows, setDailyRows] = useState<DailyRow[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchData(view, {})
      .then((res) => {
        if (view === "raw") {
          setRawRows(res.rows as RawRow[]);
        } else {
          const rows = res.rows as DailyRow[];
          setDailyRows(rows);
          const cats = new Set<string>();
          rows.forEach((r) => Object.keys(r.byCategory).forEach((c) => cats.add(c)));
          setCategories([...cats]);
        }
      })
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [view]);

  const downloadCsv = () => {
    let csv = "";
    if (view === "raw") {
      csv = "date,slot,category,menu,quantity\n";
      csv += rawRows
        .map(
          (r) =>
            `${r.date},${r.slot},${r.categoryName},${r.menuName},${r.quantity}`,
        )
        .join("\n");
    } else {
      csv = `date,weekday,total,${categories.join(",")}\n`;
      csv += dailyRows
        .map((r) => {
          const cats = categories.map((c) => r.byCategory[c] ?? 0).join(",");
          return `${r.date},${WEEKDAY_LABELS[r.weekday]},${r.total},${cats}`;
        })
        .join("\n");
    }
    const blob = new Blob([`\uFEFF${csv}`], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `sushi-waste-${view}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="pb-24">
      <div className="sticky top-14 z-10 bg-stone-100/95 backdrop-blur border-b border-stone-200 px-4 py-3 flex items-center justify-between gap-2">
        <div className="flex gap-2">
          <TabBtn active={view === "raw"} onClick={() => setView("raw")}>
            2時間ごと
          </TabBtn>
          <TabBtn active={view === "daily"} onClick={() => setView("daily")}>
            日次集計
          </TabBtn>
        </div>
        <button
          onClick={downloadCsv}
          className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 active:bg-stone-100"
        >
          CSV出力
        </button>
      </div>

      {loading && <div className="p-6 text-center text-stone-500">読込中…</div>}
      {error && <p className="px-4 pt-4 text-sm text-red-600">{error}</p>}

      {!loading && view === "raw" && (
        <div className="px-3 py-3">
          {rawRows.length === 0 ? (
            <Empty />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-stone-500 text-xs">
                  <tr>
                    <Th>日付</Th>
                    <Th>時間帯</Th>
                    <Th>ジャンル</Th>
                    <Th>メニュー</Th>
                    <Th right>廃棄数</Th>
                  </tr>
                </thead>
                <tbody>
                  {rawRows.map((r, i) => (
                    <tr key={i} className="border-t border-stone-100">
                      <Td>{r.date}</Td>
                      <Td>{slotLabel(r.slot)}</Td>
                      <Td>{r.categoryName}</Td>
                      <Td>{r.menuName}</Td>
                      <Td right>
                        <span className="font-semibold tabular-nums">
                          {r.quantity}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {!loading && view === "daily" && (
        <div className="px-3 py-3">
          {dailyRows.length === 0 ? (
            <Empty />
          ) : (
            <div className="overflow-x-auto rounded-xl border border-stone-200 bg-white">
              <table className="w-full text-sm">
                <thead className="bg-stone-50 text-stone-500 text-xs">
                  <tr>
                    <Th>日付</Th>
                    <Th>曜日</Th>
                    {categories.map((c) => (
                      <Th key={c} right>
                        {c}
                      </Th>
                    ))}
                    <Th right>合計</Th>
                  </tr>
                </thead>
                <tbody>
                  {dailyRows.map((r) => (
                    <tr key={r.date} className="border-t border-stone-100">
                      <Td>{r.date}</Td>
                      <Td>
                        <span
                          className={
                            r.weekday === 0
                              ? "text-rose-600"
                              : r.weekday === 6
                                ? "text-blue-600"
                                : ""
                          }
                        >
                          {WEEKDAY_LABELS[r.weekday]}
                        </span>
                      </Td>
                      {categories.map((c) => (
                        <Td key={c} right>
                          <span className="tabular-nums text-stone-600">
                            {r.byCategory[c] ?? 0}
                          </span>
                        </Td>
                      ))}
                      <Td right>
                        <span className="font-bold tabular-nums text-rose-800">
                          {r.total}
                        </span>
                      </Td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function TabBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
        active
          ? "bg-rose-800 text-white"
          : "bg-white text-stone-600 border border-stone-300"
      }`}
    >
      {children}
    </button>
  );
}

function Th({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <th
      className={`px-3 py-2 font-medium whitespace-nowrap ${
        right ? "text-right" : "text-left"
      }`}
    >
      {children}
    </th>
  );
}

function Td({
  children,
  right,
}: {
  children: React.ReactNode;
  right?: boolean;
}) {
  return (
    <td
      className={`px-3 py-2 whitespace-nowrap ${right ? "text-right" : "text-left"}`}
    >
      {children}
    </td>
  );
}

function Empty() {
  return (
    <p className="rounded-xl bg-white border border-stone-200 p-6 text-center text-stone-500">
      データがまだありません。入力タブから廃棄数を記録してください。
    </p>
  );
}
