import "dotenv/config";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const ROOT_DIR = path.resolve(__dirname, "..");
export const RUNS_DIR = path.join(ROOT_DIR, "data", "runs");

function required(name) {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required env var: ${name}. .env.example をコピーして .env を作成してください。`,
    );
  }
  return value;
}

export const config = {
  mapsApiKey: () => required("GOOGLE_MAPS_API_KEY"),
  spreadsheetId: () => required("GOOGLE_SHEETS_SPREADSHEET_ID"),
  tabName: () => process.env.GOOGLE_SHEETS_TAB_NAME || "prospects",
  saKeyPath: () => required("GOOGLE_APPLICATION_CREDENTIALS"),
  languageCode: () => process.env.PLACES_LANGUAGE_CODE || "en",
  regionCode: () => process.env.PLACES_REGION_CODE || "AU",
};

export const SHEET_HEADERS = [
  "place_id",
  "エリア",
  "業種",
  "店名",
  "住所",
  "電話",
  "メール",
  "SNS",
  "ウェブサイト",
  "HP状態",
  "Googleマップ",
  "評価",
  "レビュー数",
  "営業状況",
  "初回取得日",
  "最終更新日",
  "営業ステータス",
];
