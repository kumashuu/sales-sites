// API とフロントで共有する型

export type MenuItemDTO = {
  id: string;
  name: string;
  sortOrder: number;
};

export type CategoryDTO = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  items: MenuItemDTO[];
};

/// 管理画面用（無効なメニューも含む）
export type AdminMenuItem = {
  id: string;
  name: string;
  sortOrder: number;
  active: boolean;
};

export type AdminCategory = {
  id: string;
  slug: string;
  name: string;
  sortOrder: number;
  items: AdminMenuItem[];
};

export type EntryDTO = {
  menuItemId: string;
  quantity: number;
};

/// 入力保存リクエスト
export type SaveEntriesBody = {
  date: string; // YYYY-MM-DD
  slot: number; // 開始時刻(hour)
  entries: EntryDTO[];
};

/// 生データ（2時間ごと）の1行
export type RawRow = {
  date: string;
  slot: number;
  categoryName: string;
  menuName: string;
  quantity: number;
};

/// 日次集計データの1行（分析用のクリーンなデータ）
export type DailyRow = {
  date: string;
  weekday: number; // 0=日 ... 6=土
  total: number;
  byCategory: Record<string, number>;
};

export type MonthlyPoint = { period: string; total: number };
export type YearlyPoint = { period: string; total: number };
export type WeekdayPoint = {
  weekday: number;
  label: string;
  total: number;
  days: number; // 対象日数
  avg: number; // 1日あたり平均
};

export type CategoryBreakdown = { name: string; total: number };

export type AnalyticsResponse = {
  monthly: MonthlyPoint[];
  yearly: YearlyPoint[];
  weekday: WeekdayPoint[];
  byCategory: CategoryBreakdown[];
  totalCount: number;
  rangeStart: string | null;
  rangeEnd: string | null;
};
