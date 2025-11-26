
import { readPolicy } from "./policyStore";
import { pepLookup } from "./services/pepService";

export type EthicsFlag = "BLOCK" | "CAUTION" | "OK";

export type EthicsReport = {
  overallScore: number; // 0-100 (higher = lower ethical risk)
  overallFlag: EthicsFlag;
  breakdown: {
    sanctionsScore: number;
    pepScore: number;
    corruptionScore: number;
    envScore: number;
    humanRightsScore: number;
    fraudScore: number;
    dataPrivacyScore: number;
    otherScore: number;
  };
  flags: { name: string; flag: EthicsFlag; reason: string; evidence?: string[] }[];
  mitigation: { step: string; detail: string }[];
  timestamp: string;
  version: string;
};

const ENGINE_VERSION = "ethics-v1.2.0-policy-aware";

// basic scoring helpers
function scoreFromRisk(risk: number) { // risk 0-1 -> score 0-100 (lower risk = higher score)
  return Math.round((1 - Math.max(0, Math.min(1, risk))) * 100);
}

function combineScores(scores: number[], weights?: number[]) {
  if (!weights) weights = Array(scores.length).fill(1 / scores.length);
  const sum = scores.reduce((s, v, i) => s + v * (weights as number[])[i], 0);
  return Math.round(sum);
}

// Checks
async function checkSanctionsAndPEP(targetNames: string[]): Promise<{ risk: number; evidence: string[] }> {
  const evidence: string[] = [];
  let maxRisk = 0;
  
  for (const name of targetNames) {
    const pepRes = await pepLookup(name);
    if (pepRes.matched) {
        evidence.push(`Matched screening list for "${name}" (Score: ${pepRes.score})`);
        maxRisk = Math.max(maxRisk, pepRes.score);
    }
  }
  return { risk: maxRisk, evidence };
}

async function checkCorruptionIndicators(context: any): Promise<{ risk: number; evidence: string[] }> {
  const evidence: string[] = [];
  let risk = 0;
  if (context && context.procurement) {
    if (context.procurement.singleSource === true) {
      evidence.push("Procurement flagged: single-source vendor");
      risk = Math.max(risk, 0.75);
    }
  }
  if (context && context.target && typeof context.target === 'string' && context.target.toLowerCase().includes("construction")) {
      // Simple heuristic for demo
      risk = Math.max(risk, 0.4); 
  }
  return { risk, evidence };
}

async function checkEnvironmentalRisk(context: any): Promise<{ risk: number; evidence: string[] }> {
  const evidence: string[] = [];
  let risk = 0;
  if (context && context.project && context.project.industry) {
    const industry = context.project.industry.toLowerCase();
    if (["mining", "oil", "gas", "chemical", "timber"].some(x => industry.includes(x))) {
      evidence.push(`High-impact industry detected: ${context.project.industry}`);
      risk = Math.max(risk, 0.7);
    }
  }
  return { risk, evidence };
}

async function checkHumanRights(context: any): Promise<{ risk: number; evidence: string[] }> {
  const evidence: string[] = [];
  let risk = 0;
  if (context && context.project && context.project.region) {
      const r = context.project.region.toLowerCase();
      if (r.includes("conflict") || r.includes("frontier")) {
          evidence.push("Region flagged for enhanced human rights diligence");
          risk = Math.max(risk, 0.6);
      }
  }
  return { risk, evidence };
}

async function checkFraudIndicators(context: any): Promise<{ risk: number; evidence: string[] }> {
  const evidence: string[] = [];
  let risk = 0;
  return { risk, evidence };
}

async function checkDataPrivacy(context: any): Promise<{ risk: number; evidence: string[] }> {
  const evidence: string[] = [];
  let risk = 0;
  return { risk, evidence };
}

export async function runEthicsChecks(casePayload: any): Promise<EthicsReport> {
  const targetNames: string[] = [];
  // Extract targets from payload
  if (casePayload.context && casePayload.context.target) {
      targetNames.push(casePayload.context.target);
  }
  if (casePayload.target && typeof casePayload.target === 'string') {
      targetNames.push(casePayload.target);
  }

  const context = casePayload.context || { project: {} };

  const [
    sanctionsRes,
    corruptionRes,
    envRes,
    hrRes,
    fraudRes,
    dpRes
  ] = await Promise.all([
    checkSanctionsAndPEP(targetNames),
    checkCorruptionIndicators(context),
    checkEnvironmentalRisk(context),
    checkHumanRights(context),
    checkFraudIndicators(context),
    checkDataPrivacy(context)
  ]);

  const sanctionsScore = scoreFromRisk(sanctionsRes.risk);
  const pepScore = sanctionsScore; 
  const corruptionScore = scoreFromRisk(corruptionRes.risk);
  const envScore = scoreFromRisk(envRes.risk);
  const humanRightsScore = scoreFromRisk(hrRes.risk);
  const fraudScore = scoreFromRisk(fraudRes.risk);
  const dataPrivacyScore = scoreFromRisk(dpRes.risk);
  const otherScore = 100; 

  const breakdown = {
    sanctionsScore,
    pepScore,
    corruptionScore,
    envScore,
    humanRightsScore,
    fraudScore,
    dataPrivacyScore,
    otherScore
  };

  // Load dynamic policy
  const policy = readPolicy();
  
  const scoresArr = [
    sanctionsScore, corruptionScore, envScore,
    humanRightsScore, fraudScore, dataPrivacyScore, otherScore
  ];
  
  const weights = [
      policy.weights.sanctions || 0.2,
      policy.weights.corruption || 0.15,
      policy.weights.env || 0.15,
      policy.weights.humanRights || 0.1,
      policy.weights.fraud || 0.15,
      policy.weights.dataPrivacy || 0.1,
      policy.weights.other || 0.15
  ];

  const overallScore = combineScores(scoresArr, weights);

  // Dynamic Thresholds
  let overallFlag: EthicsFlag = "OK";
  if (overallScore < policy.thresholds.block) overallFlag = "BLOCK";
  else if (overallScore < policy.thresholds.caution) overallFlag = "CAUTION";

  const flags = [];
  if (sanctionsRes.evidence.length) flags.push({ name: "Sanctions/PEP", flag: (sanctionsScore < 50 ? "BLOCK" : "CAUTION") as EthicsFlag, reason: "Sanctions or Politically Exposed Person indications", evidence: sanctionsRes.evidence });
  if (corruptionRes.evidence.length) flags.push({ name: "Procurement / Corruption", flag: (corruptionScore < 50 ? "BLOCK" : "CAUTION") as EthicsFlag, reason: "Corruption risk indicators", evidence: corruptionRes.evidence });
  if (envRes.evidence.length) flags.push({ name: "Environmental", flag: (envScore < 50 ? "CAUTION" : "OK") as EthicsFlag, reason: "Environmental sensitivity", evidence: envRes.evidence });
  if (hrRes.evidence.length) flags.push({ name: "Human Rights", flag: (humanRightsScore < 50 ? "BLOCK" : "CAUTION") as EthicsFlag, reason: "Human rights risk", evidence: hrRes.evidence });

  const mitigation: { step: string; detail: string }[] = [];
  if (overallFlag === "BLOCK") {
    mitigation.push({ step: "Manual Review", detail: "Case requires Ethics Committee review. Automated processing halted." });
    mitigation.push({ step: "Enhanced Due Diligence", detail: "Provide UBO (Ultimate Beneficial Owner) registry documents." });
  } else if (overallFlag === "CAUTION") {
    mitigation.push({ step: "Enhanced Monitoring", detail: "Proceed with caution. Periodic reviews recommended." });
  } else {
    mitigation.push({ step: "Standard Procedure", detail: "No immediate ethics blockers. Proceed with standard flow." });
  }

  const report: EthicsReport = {
    overallScore,
    overallFlag,
    breakdown,
    flags,
    mitigation,
    timestamp: new Date().toISOString(),
    version: ENGINE_VERSION
  };

  return report;
}
