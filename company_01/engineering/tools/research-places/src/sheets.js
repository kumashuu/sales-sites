// Google Sheets 読み書き。サービスアカウント方式。
// - スプレッドシート ID とタブ名は config.js から取得。
// - ヘッダー行は SHEET_HEADERS と一致しなければ警告のうえ書き込みをブロックする（事故防止）。

import { google } from "googleapis";
import { GoogleAuth } from "google-auth-library";
import { config, SHEET_HEADERS } from "./config.js";

const SCOPES = ["https://www.googleapis.com/auth/spreadsheets"];

function getSheetsClient() {
  const auth = new GoogleAuth({
    keyFile: config.saKeyPath(),
    scopes: SCOPES,
  });
  return google.sheets({ version: "v4", auth });
}

async function ensureTab(sheets, spreadsheetId, tabName) {
  const meta = await sheets.spreadsheets.get({ spreadsheetId });
  const existing = (meta.data.sheets || []).find(
    (s) => s.properties?.title === tabName,
  );
  if (existing) return existing.properties.sheetId;

  const res = await sheets.spreadsheets.batchUpdate({
    spreadsheetId,
    requestBody: {
      requests: [
        {
          addSheet: {
            properties: { title: tabName },
          },
        },
      ],
    },
  });
  const created = res.data.replies?.[0]?.addSheet?.properties;
  if (!created?.sheetId) {
    throw new Error(`Failed to create tab: ${tabName}`);
  }
  return created.sheetId;
}

async function ensureHeader(sheets, spreadsheetId, tabName) {
  const range = `${tabName}!1:1`;
  const cur = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  const headerRow = cur.data.values?.[0] || [];
  if (headerRow.length === 0) {
    await sheets.spreadsheets.values.update({
      spreadsheetId,
      range,
      valueInputOption: "RAW",
      requestBody: { values: [SHEET_HEADERS] },
    });
    return;
  }
  // 既存ヘッダーと食い違うときは止める。SHEET_HEADERS の定義を変えるなら手動で揃える。
  const mismatch = SHEET_HEADERS.some((h, i) => headerRow[i] !== h);
  if (mismatch) {
    throw new Error(
      `スプレッドシートのヘッダー行が想定と異なります。タブ「${tabName}」の1行目を以下の順序で揃えてください:\n  ${SHEET_HEADERS.join(" | ")}\n現在: ${headerRow.join(" | ")}`,
    );
  }
}

export async function readExistingRows() {
  const sheets = getSheetsClient();
  const spreadsheetId = config.spreadsheetId();
  const tabName = config.tabName();
  await ensureTab(sheets, spreadsheetId, tabName);
  await ensureHeader(sheets, spreadsheetId, tabName);

  const range = `${tabName}!A2:${columnLetter(SHEET_HEADERS.length)}`;
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId,
    range,
  });
  return res.data.values || [];
}

export async function appendRows(rows) {
  if (rows.length === 0) return;
  const sheets = getSheetsClient();
  const spreadsheetId = config.spreadsheetId();
  const tabName = config.tabName();
  await sheets.spreadsheets.values.append({
    spreadsheetId,
    range: `${tabName}!A:A`,
    valueInputOption: "RAW",
    insertDataOption: "INSERT_ROWS",
    requestBody: { values: rows },
  });
}

export async function updateRows(updates) {
  if (updates.length === 0) return;
  const sheets = getSheetsClient();
  const spreadsheetId = config.spreadsheetId();
  const tabName = config.tabName();
  const data = updates.map(({ rowIndex, row }) => ({
    range: `${tabName}!A${rowIndex}:${columnLetter(SHEET_HEADERS.length)}${rowIndex}`,
    values: [row],
  }));
  await sheets.spreadsheets.values.batchUpdate({
    spreadsheetId,
    requestBody: { valueInputOption: "RAW", data },
  });
}

function columnLetter(n) {
  let s = "";
  let x = n;
  while (x > 0) {
    const m = (x - 1) % 26;
    s = String.fromCharCode(65 + m) + s;
    x = Math.floor((x - 1) / 26);
  }
  return s;
}
