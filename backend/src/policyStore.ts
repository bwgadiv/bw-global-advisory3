
import fs from "fs";
import path from "path";

const DATA_DIR = path.join(__dirname, "../data");
if (!fs.existsSync(DATA_DIR)) {
    try {
        fs.mkdirSync(DATA_DIR, { recursive: true });
    } catch (e) {
        console.error("Could not create data dir", e);
    }
}

const FILE = path.join(DATA_DIR, "policy.json");

export type Policy = {
  weights: {
    sanctions: number;
    corruption: number;
    env: number;
    humanRights: number;
    fraud: number;
    dataPrivacy: number;
    other: number;
  },
  thresholds: {
    block: number; 
    caution: number;
  }
};

const DEFAULT: Policy = {
  weights: { sanctions:0.2, corruption:0.15, env:0.15, humanRights:0.1, fraud:0.15, dataPrivacy:0.1, other:0.15 },
  thresholds: { block: 40, caution: 65 }
};

export function readPolicy(): Policy {
  try {
    if (!fs.existsSync(FILE)) {
        writePolicy(DEFAULT);
        return DEFAULT;
    }
    const raw = fs.readFileSync(FILE, "utf8");
    return JSON.parse(raw) as Policy;
  } catch (e) {
    console.error("Error reading policy", e);
    return DEFAULT;
  }
}

export function writePolicy(p: Policy) {
  fs.writeFileSync(FILE, JSON.stringify(p, null, 2));
  return readPolicy();
}
