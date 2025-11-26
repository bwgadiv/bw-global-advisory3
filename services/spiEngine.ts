
import { ReportParameters, SPIResult, EthicalCheckResult, PartnerScore } from '../types';

// 1. Deterministic SPI Calculation Engine
export function calculateSPI(params: ReportParameters): SPIResult {
    // Base weights (can be adjusted based on persona in future)
    const weights = {
        ER: 0.25, // Economic Readiness
        SP: 0.20, // Symbiosis Potential
        CC: 0.15, // Cultural Compatibility
        PR: 0.15, // Partner Reliability
        CA: 0.10, // Confidence Activation
        EA: 0.10, // Ethical Alignment
        UT: 0.05  // User Transparency
    };

    // --- Heuristic Scorers ---

    // Economic Readiness (ER)
    // Logic: Developed regions score higher on readiness.
    let ER = 60; 
    if (params.region.includes("North America") || params.region.includes("Europe (Western)") || params.region.includes("Developed")) ER += 25;
    else if (params.region.includes("Emerging") || params.region.includes("China") || params.region.includes("India")) ER += 15;
    // Bonus for clear industry focus
    if (params.industry.length > 0) ER += 5;

    // Symbiosis Potential (SP)
    // Logic: More specific problem statements & intents imply higher calculated symbiosis.
    let SP = 50;
    if (params.problemStatement.length > 50) SP += 15;
    if (params.selectedIntents && params.selectedIntents.length > 1) SP += 15;
    if (params.idealPartnerProfile.length > 10) SP += 10;

    // Cultural Compatibility (CC)
    // Logic: Simple proxy - if user country is in same region as target, high compatibility.
    let CC = 60;
    const userRegionGuess = params.userCountry === "USA" ? "North America" : 
                            params.userCountry === "UK" ? "Europe (Western)" : "Unknown";
    if (params.region.includes(userRegionGuess)) CC += 30;
    else CC += 10; // Global business standard baseline

    // Partner Reliability (PR)
    // Logic: If due diligence depth is high, we assume higher reliability filtering.
    let PR = 65;
    if (params.dueDiligenceDepth === 'Deep Forensic (Financial & Legal)') PR += 20;
    else if (params.dueDiligenceDepth === 'Standard (Reputation & Risk)') PR += 10;

    // Confidence Activation (CA)
    // Logic: Short timeline = higher friction/risk usually, but we measure velocity. 
    // Actually, aggressive timeline might lower probability of success if unrealistic.
    // Let's invert: Long timeline = higher probability of completion.
    let CA = 60;
    if (params.expansionTimeline.includes("Long Term")) CA += 20;
    if (params.expansionTimeline.includes("Medium Term")) CA += 10;
    // Penalty for immediate without high skill
    // Updated logic to include all high-skill levels across different UI components
    const highSkillLevels = ['expert', 'visionary', 'executive', 'senior'];
    if (params.expansionTimeline.includes("Immediate") && !highSkillLevels.includes(params.skillLevel as string)) CA -= 10;

    // Ethical Alignment (EA)
    // Logic: Default high, penalize for high-risk industries in high-risk regions.
    let EA = 85;
    const riskyIndustries = ['Mining & Metals', 'Energy (Oil, Gas, Renewable)', 'Defense'];
    const isRiskyIndustry = params.industry.some(i => riskyIndustries.includes(i));
    if (isRiskyIndustry) EA -= 15;
    if (params.region.includes("Africa") || params.region.includes("Latin America")) EA -= 5; // Proxy for corruption risk index variance

    // User Transparency (UT)
    // Logic: Did they upload docs? Is data complete?
    let UT = 60;
    if (params.uploadedDocument) UT += 30;
    if (params.userWebsite) UT += 10;

    // Clamp scores 0-100
    const clamp = (n: number) => Math.min(100, Math.max(0, n));
    ER = clamp(ER); SP = clamp(SP); CC = clamp(CC); PR = clamp(PR); CA = clamp(CA); EA = clamp(EA); UT = clamp(UT);

    // Weighted Sum (Digit-by-digit arithmetic emulation)
    const score = 
        (weights.ER * ER) +
        (weights.SP * SP) +
        (weights.CC * CC) +
        (weights.PR * PR) +
        (weights.CA * CA) +
        (weights.EA * EA) +
        (weights.UT * UT);

    // Confidence Interval calculation based on Transparency and Information density
    const baseVariance = 15;
    const varianceReduction = (UT / 100) * 10; // Better data = lower variance
    const margin = baseVariance - varianceReduction;

    return {
        spi: Number(score.toFixed(2)),
        ciLow: Number((score - margin).toFixed(2)),
        ciHigh: Number((score + margin).toFixed(2)),
        breakdown: [
            { label: 'Economic Readiness', value: ER, weight: weights.ER },
            { label: 'Symbiosis Potential', value: SP, weight: weights.SP },
            { label: 'Cultural Compatibility', value: CC, weight: weights.CC },
            { label: 'Partner Reliability', value: PR, weight: weights.PR },
            { label: 'Activation Velocity', value: CA, weight: weights.CA },
            { label: 'Ethical Alignment', value: EA, weight: weights.EA },
            { label: 'User Transparency', value: UT, weight: weights.UT },
        ],
        drivers: {
            positive: [
                "Strong industry alignment in target region",
                "High user transparency via documentation",
                "Strategic intent clearly defined"
            ],
            negative: [
                "Regulatory friction in target market",
                "Aggressive timeline reduces margin for error",
                "Cross-regional cultural distance"
            ]
        },
        generatedAt: new Date().toISOString()
    };
}

// 2. Ethical Safeguard Engine
export function runEthicalSafeguards(params: ReportParameters): EthicalCheckResult {
    const flags: string[] = [];
    let riskScore = 20; // Baseline risk

    // 1. Industry Risk
    const highRiskSectors = ['Mining & Metals', 'Defense', 'Oil & Gas'];
    if (params.industry.some(i => highRiskSectors.some(r => i.includes(r)))) {
        flags.push("High-Impact Sector: Environmental & Social Impact Assessment (ESIA) Recommended.");
        riskScore += 30;
    }

    // 2. Regional Governance Risk
    if (params.region.includes("Emerging") || params.region.includes("Africa") || params.region.includes("Latin America")) {
        flags.push("Jurisdiction Flag: Enhanced Anti-Bribery & Corruption (ABC) protocols required.");
        riskScore += 20;
    }

    // 3. Data Integrity
    if (!params.uploadedDocument) {
        flags.push("Verification Gap: No primary source documentation provided.");
        riskScore += 10;
    }

    return {
        passed: riskScore < 70,
        flags,
        riskScore: Math.min(100, riskScore),
        mitigationRequired: riskScore > 50
    };
}

// 3. Partner Rating Engine
export function calculatePartnerScore(partnerData: any): PartnerScore {
    // Heuristic scoring based on mock data attributes
    // In real system, this uses DB provenance
    
    let financialHealth = 70; // Default
    if (partnerData.type === 'government') financialHealth = 85; // Sovereign backing
    if (partnerData.type === 'ngo') financialHealth = 60; // Grant dependent

    let projectDelivery = 75;
    const trackRecord = partnerData.trackRecord || [];
    const successes = trackRecord.filter((t: any) => t.outcome === 'success').length;
    projectDelivery += (successes * 10);

    let legalCompliance = 80; // Base
    const riskLevel = partnerData.riskFactors?.[0]?.level;
    if (riskLevel === 'high') legalCompliance -= 30;
    if (riskLevel === 'medium') legalCompliance -= 15;

    let strategicFit = 70; 
    // Mock fit calculation
    strategicFit += (partnerData.expertise?.length || 0) * 5;

    let localCapacity = 75;
    if (partnerData.contactInfo?.primary) localCapacity += 10;

    let reputation = partnerData.credibilityScore || 75;

    const weights = {
        FH: 0.20,
        PD: 0.20,
        LC: 0.15,
        SF: 0.20,
        LCp: 0.15,
        RS: 0.10
    };

    const overall = 
        (financialHealth * weights.FH) +
        (projectDelivery * weights.PD) +
        (legalCompliance * weights.LC) +
        (strategicFit * weights.SF) +
        (localCapacity * weights.LCp) +
        (reputation * weights.RS);

    let rating: 'Green' | 'Amber' | 'Red' = 'Amber';
    if (overall >= 75) rating = 'Green';
    else if (overall < 45) rating = 'Red';

    return {
        overallScore: Number(overall.toFixed(2)),
        rating,
        components: {
            financialHealth,
            projectDelivery,
            legalCompliance,
            strategicFit,
            localCapacity,
            reputation
        }
    };
}
