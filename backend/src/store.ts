
import fs from "fs";
import path from "path";
import crypto from "crypto";

const DATA_DIR = path.join(__dirname, "../data");
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        console.error("Could not create data dir", e);
    }
}

const FILE = path.join(DATA_DIR, "data_store.json");

export type StoredCase = {
  id: string;
  created: number;
  payload: any;
  status: "pending" | "processing" | "complete" | "error";
  result?: any;
  logs: string[];
};

function readFile(): StoredCase[] {
  if (!fs.existsSync(FILE)) return [];
  try {
    return JSON.parse(fs.readFileSync(FILE, "utf-8"));
  } catch (e) {
    return [];
  }
}

function writeFile(data: StoredCase[]) {
  fs.writeFileSync(FILE, JSON.stringify(data, null, 2), "utf-8");
}

export function createCase(payload: any): StoredCase {
  const data = readFile();
  const c: StoredCase = {
    id: crypto.randomUUID(),
    created: Date.now(),
    payload,
    status: "pending",
    logs: ["Case created"]
  };
  data.push(c);
  writeFile(data);
  return c;
}

export function updateCase(id: string, upd: Partial<StoredCase>) {
  const data = readFile();
  const i = data.findIndex(e => e.id === id);
  if (i === -1) return;
  data[i] = { ...data[i], ...upd };
  writeFile(data);
}

export function appendLog(id: string, msg: string) {
  const data = readFile();
  const i = data.findIndex(e => e.id === id);
  if (i === -1) return;
  data[i].logs.push(new Date().toISOString() + " " + msg);
  writeFile(data);
}

export function getCase(id: string) {
  return readFile().find(c => c.id === id);
}

export function listCases() {
  return readFile().sort((a, b) => b.created - a.created);
}
