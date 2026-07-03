"use client";

import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchAnalytics } from "@/lib/api";
import { monthRange, yearRange } from "@/lib/config";
import type { AnalyticsResponse } from "@/lib/types";

type RangePreset = "month" | "year" | "all";

const PRESETS: { key: RangePreset; label: string }[] = [
  { key: "month", label: "今月" },
  { key: "year", label: "今年" },
  { key: "all", label: "全期間" },
];

function rangeFor(preset: RangePreset): { start?: string; end?: string } {
  if (preset === "month") return monthRange();
  if (preset === "year") return yearRange();
  return {};
}

export default function AnalyticsTab() {
  const [preset, setPreset] = useState<RangePreset>("month");
  const [data, setData] = useState<AnalyticsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [weekdayMode, setWeekdayMode] = useState<"avg" | "total">("avg");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetchAnalytics(rangeFor(preset))
      .then(setData)
      .catch((e) => setError(String(e)))
      .finally(() => setLoading(false));
  }, [preset]);

  return (
    <div className="pb-24">
      {/* 期間プリセット */}
      <div className="sticky top-14 z-10 bg-stone-100/95 backdrop-blur border-b border-stone-200 px-4 py-3 flex gap-2">
        {PRESETS.map((p) => (
          <button
            key={p.key}
            onClick={() => setPreset(p.key)}
            className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
              preset === p.key
                ? "bg-rose-800 text-white"
                : "bg-white text-stone-600 border border-stone-300"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      {loading && (
        <div className="p-6 text-center text-stone-500">集計中…</div>
      )}
      {error && <p className="px-4 pt-4 text-sm text-red-600">{error}</p>}

      {data && !loading && (
        <div className="px-4 py-4 space-y-5">
          <SummaryCard data={data} />

          {data.totalCount === 0 ? (
            <p className="rounded-xl bg-white border border-stone-200 p-6 text-center text-stone-500">
              この期間のデータはまだありません。
            </p>
          ) : (
            <>
              {/* 曜日別 */}
              <Card
                title="曜日別の廃棄量"
                right={
                  <div className="flex gap-1 text-xs">
                    <ToggleBtn
                      active={weekdayMode === "avg"}
                      onClick={() => setWeekdayMode("avg")}
                    >
                      1日平均
                    </ToggleBtn>
                    <ToggleBtn
                      active={weekdayMode === "total"}
                      onClick={() => setWeekdayMode("total")}
                    >
                      合計
                    </ToggleBtn>
                  </div>
                }
              >
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={data.weekday.map((w) => ({
                      label: w.label,
                      value: weekdayMode === "avg" ? w.avg : w.total,
                    }))}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                  >
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip
                      formatter={(v) => `${v} 個`}
                      labelFormatter={(l) => `${l}曜日`}
                    />
                    <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                      {data.weekday.map((w, i) => (
                        <Cell
                          key={i}
                          fill={
                            w.weekday === 0
                              ? "#e11d48"
                              : w.weekday === 6
                                ? "#2563eb"
                                : "#9f1239"
                          }
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* 月次 */}
              <Card title="月次の廃棄量">
                <ResponsiveContainer width="100%" height={220}>
                  <BarChart
                    data={data.monthly.map((m) => ({
                      label: m.period.slice(5),
                      value: m.total,
                    }))}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                  >
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip formatter={(v) => `${v} 個`} />
                    <Bar dataKey="value" fill="#9f1239" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* 年次 */}
              <Card title="年次の廃棄量">
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart
                    data={data.yearly.map((y) => ({
                      label: y.period,
                      value: y.total,
                    }))}
                    margin={{ top: 8, right: 8, left: -20, bottom: 0 }}
                  >
                    <XAxis dataKey="label" tick={{ fontSize: 12 }} />
                    <YAxis tick={{ fontSize: 11 }} allowDecimals={false} />
                    <Tooltip formatter={(v) => `${v} 個`} />
                    <Bar dataKey="value" fill="#0f766e" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              {/* カテゴリ別 */}
              <Card title="ジャンル別の廃棄量">
                <div className="space-y-2">
                  {data.byCategory.map((c) => {
                    const pct =
                      data.totalCount > 0
                        ? Math.round((c.total / data.totalCount) * 100)
                        : 0;
                    return (
                      <div key={c.name}>
                        <div className="flex justify-between text-sm mb-0.5">
                          <span className="font-medium">{c.name}</span>
                          <span className="tabular-nums text-stone-500">
                            {c.total} 個 ({pct}%)
                          </span>
                        </div>
                        <div className="h-2 rounded-full bg-stone-200 overflow-hidden">
                          <div
                            className="h-full bg-rose-700 rounded-full"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </Card>
            </>
          )}
        </div>
      )}
    </div>
  );
}

function SummaryCard({ data }: { data: AnalyticsResponse }) {
  const peak = [...data.weekday].sort((a, b) => b.avg - a.avg)[0];
  return (
    <div className="grid grid-cols-2 gap-3">
      <div className="rounded-xl bg-rose-800 text-white p-4">
        <p className="text-xs opacity-80">合計廃棄数</p>
        <p className="text-3xl font-bold tabular-nums">{data.totalCount}</p>
        <p className="text-xs opacity-80 mt-1">個</p>
      </div>
      <div className="rounded-xl bg-white border border-stone-200 p-4">
        <p className="text-xs text-stone-500">最も多い曜日</p>
        <p className="text-3xl font-bold tabular-nums text-rose-800">
          {peak && peak.total > 0 ? `${peak.label}曜` : "—"}
        </p>
        <p className="text-xs text-stone-500 mt-1">
          {peak && peak.total > 0 ? `平均 ${peak.avg} 個/日` : "データなし"}
        </p>
      </div>
    </div>
  );
}

function Card({
  title,
  right,
  children,
}: {
  title: string;
  right?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl bg-white border border-stone-200 p-4">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-bold text-stone-800">{title}</h3>
        {right}
      </div>
      {children}
    </div>
  );
}

function ToggleBtn({
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
      className={`rounded-full px-2.5 py-1 font-medium ${
        active ? "bg-stone-900 text-white" : "bg-stone-100 text-stone-500"
      }`}
    >
      {children}
    </button>
  );
}
