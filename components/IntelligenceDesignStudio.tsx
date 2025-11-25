
import React, { useState, useMemo, useEffect } from 'react';
import { ReportParameters, UserProfile, StrategicIntent, SkillLevel } from '../types';
import { ORGANIZATION_TYPES, STRATEGIC_INTENTS, REGIONS_AND_COUNTRIES, ORGANIZATION_SUBTYPES } from '../constants';
import { NexusLogo, Target, BrainCircuit, GlobeIcon, Users, FileText, LetterIcon, Layers, CheckCircle, RocketIcon, ShieldCheck, ActivityIcon, ManualIcon, PlusCircleIcon, CloseIcon, SlidersIcon, TrashIcon, MatchMakerIcon } from './Icons';
import { StrategicCanvas } from './StrategicCanvas';
import { generateFastSuggestion } from '../services/nexusService';
import Inquire from './Inquire';
import MatchmakingEngine from './MatchmakingEngine';
import PartnerIntelligenceDashboard from './PartnerIntelligenceDashboard';

interface DesignStudioProps {
    params: ReportParameters;
    onParamsChange: (params: ReportParameters) => void;
    onProfileUpdate: (profile: UserProfile) => void;
}

type StudioStage = 'identity' | 'intent' | 'discovery' | 'canvas';

// Enhanced Metadata with 10+ features per module
const MODULE_META: Record<string, { title: string, description: string, features: string[] }> = {
    'geopolitics': { 
        title: 'Geopolitical Forecast', 
        description: 'Macro-stability & risk analysis.', 
        features: [
            'Regime Stability Analysis', 'Currency Volatility Risk', 'Trade Barrier Forecast', 'Sanctions Screening', 
            'Election Impact Modeling', 'Border Security Assessment', 'Regional Conflict Probability', 'Policy Continuity Check', 
            'Sovereign Debt Risk', 'Labor Unrest Prediction', 'Diplomatic Relation Strength', 'Regulatory Shift Warning'
        ] 
    },
    'rroi': { 
        title: 'RROI Diagnostic', 
        description: 'Regional Readiness Index.', 
        features: [
            'Infrastructure Quality Score', 'Talent Pool Availability', 'Regulatory Friction Index', 'Digital Connectivity Speed',
            'Energy Reliability Audit', 'Water Security Assessment', 'Logistics Performance Index', 'Innovation Ecosystem Score',
            'Cost of Living Baseline', 'Tax Efficiency Rating', 'IP Protection Level', 'Market Entry Speed'
        ] 
    },
    'comfort_index': { 
        title: 'Regional Comfort Index', 
        description: 'Safety & lifestyle metrics.', 
        features: [
            'Violent Crime Statistics', 'Expat Quality of Life', 'Healthcare Access & Quality', 'International Schooling',
            'Air & Water Quality', 'Cultural Openness Index', 'Housing Availability', 'Personal Freedom Score',
            'Banking Accessibility', 'Language Barrier Assessment', 'Transport Safety Record', 'Emergency Response Times'
        ] 
    },
    'math_models': { 
        title: 'Math Models Engine', 
        description: 'Quantitative economic modeling.', 
        features: [
            'Gravity Model of Trade', 'Location Quotient (LQ)', 'Multi-Criteria Decision Analysis', 'Input-Output Modeling',
            'Economic Base Analysis', 'Shift-Share Analysis', 'Cluster Mapping', 'Supply Chain Network Optimization',
            'Cost-Benefit Analysis', 'Sensitivity Analysis', 'Monte Carlo Simulation'
        ] 
    },
    'rocket_engine': { 
        title: 'Nexus Rocket Engine', 
        description: 'High-velocity asset identification.', 
        features: [
            'Latent Asset Identification (LAI)', 'Investment Velocity Score (IVAS)', 'Symbiotic Cascade Forecast', 'Hidden Asset Scanning',
            'Cross-Domain Synergy Check', 'Underutilized Resource Map', 'Rapid Feasibility Test', 'Economic Multiplier Calc',
            'Speed-to-Activation Estimate', 'Catalyst Event Identification'
        ] 
    },
    'governance_audit': { 
        title: 'Governance Audit', 
        description: 'Institutional integrity check.', 
        features: [
            'Corruption Risk Index', 'Rule of Law Assessment', 'Regulatory Enforcement Consistency', 'Contract Enforcement Speed',
            'Corporate Governance Standards', 'Anti-Money Laundering (AML)', 'Political Interference Check', 'Judicial Independence',
            'Transparency International Rating', 'Bureaucratic Efficiency', 'Property Rights Protection'
        ] 
    },
    'due_diligence': { 
        title: 'Due Diligence Suite', 
        description: 'Partner background verification.', 
        features: [
            'Ultimate Beneficial Owner (UBO)', 'Financial Health Check', 'Legal Litigation History', 'Reputational Risk Scan',
            'Sanctions List Screening', 'PEP (Politically Exposed) Check', 'Adverse Media Search', 'Operational History',
            'ESG Compliance Verification', 'Creditworthiness Assessment', 'Partnership Network Map'
        ] 
    },
    'symbiotic_matchmaking': { 
        title: 'Symbiotic Discovery', 
        description: 'Asymmetric value pairing.', 
        features: [
            'Cross-Sector Opportunity Scan', 'Asymmetric Value Identification', 'Hidden Gem Detection', 'Value Arbitrage Calculation',
            'Complementary Asset Matching', 'Cultural Fit Prediction', 'Strategic Gap Filling', 'Resource Exchange Modeling',
            'Innovation Synergy Check', 'Long-term Alignment Score'
        ] 
    },
    'matchmaking_engine': { 
        title: 'Matchmaking Engine', 
        description: 'Standard partner search.', 
        features: [
            'Capability Matching', 'Size & Scale Fit', 'Geographic Targeting', 'Industry Vertical Align',
            'Technology Stack Match', 'Supply Chain Integration', 'Distribution Network Fit', 'Revenue Band Filtering',
            'Ownership Structure Match', 'Certification Alignment'
        ] 
    },
    'seam': { 
        title: 'Ecosystem Mapping', 
        description: 'Strategic alignment map.', 
        features: [
            'Supply Chain Node Mapping', 'Institutional Support Map', 'Talent Pool Clusters', 'Competitor Proximity',
            'Logistics Hub Alignment', 'R&D Center Proximity', 'Government Agency Access', 'Financial Service Density',
            'Innovation Hub Access', 'Utility Infrastructure Map'
        ] 
    },
    'partner_intel': { 
        title: 'Partner Intelligence', 
        description: 'Deep profile analysis.', 
        features: [
            'Historical Track Record', 'Decision Making Structure', 'Key Stakeholder Network', 'Financial Performance Trends',
            'Strategic Priority Analysis', 'Operational Footprint', 'Technology Maturity', 'Workforce Culture',
            'Market Reputation Analysis', 'Negotiation History'
        ] 
    },
    'deep_reasoning': { 
        title: 'Deep Reasoning Engine', 
        description: 'Logic & strategy validation.', 
        features: [
            'Deal Killer Identification', 'Counter-Intuitive Insights', 'Hidden Value Detection', 'Adversarial Stress Testing',
            'Logical Fallacy Check', 'Strategic Blindspot Scan', 'Second-Order Effect Analysis', 'Bias Mitigation',
            'Alternative Scenario Logic', 'Decision Robustness Score'
        ] 
    },
    'trade_disruption': { 
        title: 'Trade Simulation', 
        description: 'Scenario planning & shock tests.', 
        features: [
            'Tariff Impact Simulation', 'Supply Chain Shock Test', 'Route Disruption Analysis', 'Commodity Price Volatility',
            'Currency Fluctuation Impact', 'Trade War Scenario', 'Pandemic/Health Crisis Sim', 'Cyber Attack Resilience',
            'Regulatory Embargo Effect', 'Alternative Sourcing Speed'
        ] 
    },
    'predictive_growth': { 
        title: 'Predictive Growth', 
        description: 'Future market modeling.', 
        features: [
            'GDP Growth Forecast', 'Sector Trend Extrapolation', 'Demographic Shift Modeling', 'Urbanization Rate Projection',
            'Consumer Spending Forecast', 'Technology Adoption Curve', 'Infrastructure ROI Model', 'Inflation Impact Projection',
            'Labor Market Evolution', 'Market Saturation Timeline'
        ] 
    },
    'alternative_locations': { 
        title: 'Alt. Location Matcher', 
        description: 'Site selection comparison.', 
        features: [
            'Cost-Benefit Comparison', 'Talent Depth Analysis', 'Logistics Efficiency Score', 'Incentive Package Comparison',
            'Quality of Life Match', 'Risk Profile Comparison', 'Market Access Proximity', 'Real Estate Availability',
            'Utility Cost Comparison', 'Time Zone Alignment'
        ] 
    },
    'cultural_intel': { 
        title: 'Cultural Intelligence', 
        description: 'Soft power strategy.', 
        features: [
            'Negotiation Style Guide', 'Business Etiquette Protocol', 'Social Taboo Warning', 'Communication Context Level',
            'Decision Hierarchy Map', 'Gift Giving Guidelines', 'Time Perception Analysis', 'Trust Building Tactics',
            'Language Nuance Guide', 'Meeting Protocol'
        ] 
    },
    'negotiation_advantage': { 
        title: 'Negotiation Advantage', 
        description: 'Leverage & BATNA analysis.', 
        features: [
            'Leverage Point Identification', 'Objection Handling Scripts', 'BATNA Calculation', 'ZOPA (Zone of Agreement) Map',
            'Concession Strategy', 'Stakeholder Influence Map', 'Power Dynamic Analysis', 'Timing Strategy',
            'Information Asymmetry Check', 'Closing Tactic Selection'
        ] 
    },
    'stakeholder_analysis': { 
        title: 'Stakeholder Map', 
        description: 'Influence & interest mapping.', 
        features: [
            'Key Player Identification', 'Interest vs Power Grid', 'Hidden Influencer Detection', 'Opposition Risk Analysis',
            'Coalition Building Strategy', 'Engagement Plan', 'Communication Channel Map', 'Expectation Management',
            'Political Capital Assessment', 'Community Impact Analysis'
        ] 
    },
    'relationship_builder': { 
        title: 'Relationship Strategy', 
        description: 'Long-term engagement plan.', 
        features: [
            'Trust Building Roadmap', 'Communication Cadence', 'Joint Milestone Planning', 'Conflict Resolution Protocol',
            'Executive Sponsorship Plan', 'Social Capital Investment', 'Feedback Loop Design', 'Cultural Bonding Activities',
            'Success Sharing Model', 'Legacy Building Strategy'
        ] 
    },
    'final_review': { 
        title: 'Final Dossier', 
        description: 'Synthesis & Export.', 
        features: [
            'Executive Summary Gen', 'Full Strategic Report', 'Audio Briefing Synthesis', 'Visual Data Export',
            'Actionable Roadmap', 'Risk Matrix Export', 'Partner Contact List', 'Investment Pitch Deck',
            'Policy Memo Generation', 'Translation & Localization'
        ] 
    }
};

const MODULE_PHASES: Record<string, string> = {
    'geopolitics': 'Macro',
    'rroi': 'Macro',
    'comfort_index': 'Macro',
    'math_models': 'Macro',
    'rocket_engine': 'Macro',
    'governance_audit': 'Integrity',
    'due_diligence': 'Integrity',
    'symbiotic_matchmaking': 'Expansion',
    'matchmaking_engine': 'Expansion',
    'seam': 'Expansion',
    'partner_intel': 'Expansion',
    'deep_reasoning': 'Expansion',
    'trade_disruption': 'Expansion',
    'predictive_growth': 'Expansion',
    'alternative_locations': 'Expansion',
    'cultural_intel': 'Execution',
    'negotiation_advantage': 'Execution',
    'stakeholder_analysis': 'Execution',
    'relationship_builder': 'Execution',
    'final_review': 'Execution'
};

const ALL_MODULE_IDS = Object.keys(MODULE_META);

export const IntelligenceDesignStudio: React.FC<DesignStudioProps> = ({
    params,
    onParamsChange,
    onProfileUpdate
}) => {
    const [stage, setStage] = useState<StudioStage>('identity');
    const [isAnalyzingThought, setIsAnalyzingThought] = useState(false);
    
    // Track user overrides: true = forced on, false = forced off
    const [moduleOverrides, setModuleOverrides] = useState<Record<string, boolean>>({});
    
    // Track sub-feature toggles: Record<moduleId, Record<featureName, boolean>>
    const [featureToggles, setFeatureToggles] = useState<Record<string, Record<string, boolean>>>({});
    
    // Track custom user-added features: Record<moduleId, string[]>
    const [customFeatures, setCustomFeatures] = useState<Record<string, string[]>>({});
    const [newFeatureInputs, setNewFeatureInputs] = useState<Record<string, string>>({});

    // --- Handlers ---

    const handleIdentityComplete = () => {
        setStage('intent');
    };

    const toggleIntent = (intentId: string) => {
        const currentIntents = params.selectedIntents || [];
        const newIntents = currentIntents.includes(intentId)
            ? currentIntents.filter(id => id !== intentId)
            : [...currentIntents, intentId];
        
        onParamsChange({
            ...params,
            selectedIntents: newIntents,
            selectedIntent: newIntents.length > 0 ? newIntents[0] : undefined
        });
    };

    const toggleModuleActive = (moduleId: string) => {
        setModuleOverrides(prev => {
            const newState = { ...prev };
            const isRecommended = getRecommendedModules().has(moduleId);
            const currentOverride = prev[moduleId];
            let isCurrentlyActive = isRecommended;
            if (currentOverride !== undefined) isCurrentlyActive = currentOverride;
            newState[moduleId] = !isCurrentlyActive;
            return newState;
        });
    };

    const toggleFeature = (moduleId: string, featureName: string) => {
        setFeatureToggles(prev => {
            const moduleFeatures = prev[moduleId] || {};
            // If undefined, it means it's currently ON (default state). So we toggle to false.
            const current = moduleFeatures[featureName] !== false;
            return {
                ...prev,
                [moduleId]: { ...moduleFeatures, [featureName]: !current }
            };
        });
    };

    const handleAddCustomFeature = (moduleId: string) => {
        const val = newFeatureInputs[moduleId]?.trim();
        if (!val) return;
        
        setCustomFeatures(prev => ({
            ...prev,
            [moduleId]: [...(prev[moduleId] || []), val]
        }));
        
        // Ensure it's toggled ON by default
        setFeatureToggles(prev => ({
            ...prev,
            [moduleId]: { ...(prev[moduleId] || {}), [val]: true }
        }));
        
        setNewFeatureInputs(prev => ({ ...prev, [moduleId]: '' }));
    };

    const removeCustomFeature = (moduleId: string, featureName: string) => {
        setCustomFeatures(prev => ({
            ...prev,
            [moduleId]: (prev[moduleId] || []).filter(f => f !== featureName)
        }));
    };

    // Calculate recommended modules based on intents (Pure function of intents)
    const getRecommendedModules = () => {
        const selectedIds = params.selectedIntents || [];
        const moduleSet = new Set<string>();
        
        // Always recommend core
        moduleSet.add('geopolitics');
        moduleSet.add('final_review');

        selectedIds.forEach(id => {
            const intent = STRATEGIC_INTENTS.find(i => i.id === id);
            if (intent) {
                intent.recommendedModules.forEach(mod => moduleSet.add(mod));
            }
        });
        return moduleSet;
    };

    // Calculate FINAL active modules (Recommendations + Overrides)
    const activeEngines = useMemo(() => {
        const recommended = getRecommendedModules();
        const finalSet = new Set<string>();

        ALL_MODULE_IDS.forEach(modId => {
            const override = moduleOverrides[modId];
            if (override === true) {
                finalSet.add(modId);
            } else if (override === false) {
                // Do nothing, explicit off
            } else {
                // No override, use recommendation
                if (recommended.has(modId)) {
                    finalSet.add(modId);
                }
            }
        });

        return Array.from(finalSet);
    }, [params.selectedIntents, moduleOverrides]);

    const handleProceedToDiscovery = () => {
        setStage('discovery');
    };

    const handleProceedToCanvas = () => {
        if (!params.problemStatement && params.selectedIntents && params.selectedIntents.length > 0) {
             const intentTitles = params.selectedIntents.map(id => STRATEGIC_INTENTS.find(i => i.id === id)?.title).join(' + ');
             onParamsChange({ 
                 ...params, 
                 problemStatement: `Strategic Mission: ${intentTitles}`,
                 analyticalModules: activeEngines 
            });
        } else {
             onParamsChange({ ...params, analyticalModules: activeEngines });
        }
        setStage('canvas');
    };

    const handleInitialThoughtAnalysis = async () => {
        if (!params.initialThought) return;
        setIsAnalyzingThought(true);
        try {
            const refined = await generateFastSuggestion(params.initialThought, "Convert this raw thought into a strategic objective statement.");
            onParamsChange({ ...params, problemStatement: refined });
        } catch (e) {
            console.error(e);
        } finally {
            setIsAnalyzingThought(false);
        }
    };

    const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            onParamsChange({ ...params, uploadedFileName: file.name, uploadedDocument: true });
        }
    };

    // Logic for Org SubTypes
    const subTypes = ORGANIZATION_SUBTYPES[params.organizationType] || [];
    const showCustomTypeInput = params.organizationType === 'Custom';
    const showCustomCategoryInput = params.organizationType && (params.organizationSubType === 'Custom' || subTypes.length === 0);

    // --- Views ---

    if (stage === 'identity') {
        return (
            <div className="h-full w-full bg-slate-100 overflow-y-auto font-sans" id="studio-scroll-container">
                <div className="min-h-full flex flex-col items-center justify-center p-6 md:p-12">
                    
                    <div className="max-w-5xl w-full animate-fade-in-up">
                        {/* Header Section */}
                        <div className="mb-10 text-center">
                            <div className="inline-flex items-center justify-center p-3 bg-white rounded shadow-sm border border-slate-300 mb-6">
                                <NexusLogo className="w-8 h-8 text-slate-900" />
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
                                Establish Point of View
                            </h1>
                            <p className="text-lg text-slate-600 font-medium max-w-2xl mx-auto">
                                Configure the Nexus Intelligence System. Your profile calibrates the AI's depth, tone, and strategic focus.
                            </p>
                        </div>

                        <div className="bg-white rounded border border-slate-200 shadow-lg overflow-hidden">
                            <div className="p-8 md:p-12 space-y-10">
                                
                                {/* Experience Level Selection */}
                                <div className="space-y-4">
                                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Analyst Experience Level</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {[
                                            { id: 'observer', label: 'Observer', desc: 'Passive Insights Only', icon: ActivityIcon },
                                            { id: 'novice', label: 'Novice Analyst', desc: 'Guided & Instructional', icon: ManualIcon },
                                            { id: 'associate', label: 'Associate', desc: 'Collaborative Co-Pilot', icon: Users },
                                            { id: 'senior', label: 'Senior Strategist', desc: 'Autonomous Execution', icon: Target },
                                            { id: 'executive', label: 'Decision Maker', desc: 'Synthesis & Bottom Line', icon: ShieldCheck },
                                            { id: 'visionary', label: 'Visionary Architect', desc: 'Abstract & Global Scale', icon: BrainCircuit }
                                        ].map((level) => (
                                            <button 
                                                key={level.id} 
                                                onClick={() => onParamsChange({...params, skillLevel: level.id as SkillLevel})} 
                                                className={`group p-5 rounded border text-left transition-all duration-200 relative overflow-hidden ${
                                                    params.skillLevel === level.id 
                                                    ? 'bg-slate-900 text-white shadow-lg scale-[1.02] ring-2 ring-offset-2 ring-slate-900 border-transparent' 
                                                    : 'border-slate-300 hover:border-slate-500 bg-white hover:bg-slate-50'
                                                }`}
                                            >
                                                <div className="relative z-10">
                                                    <div className="flex justify-between items-start mb-3">
                                                        <level.icon className={`w-6 h-6 ${params.skillLevel === level.id ? 'text-white' : 'text-slate-400'}`} />
                                                        {params.skillLevel === level.id && <CheckCircle className="w-5 h-5 text-white" />}
                                                    </div>
                                                    <div className={`font-bold text-lg mb-1 ${params.skillLevel === level.id ? 'text-white' : 'text-slate-700'}`}>
                                                        {level.label}
                                                    </div>
                                                    <p className={`text-xs font-medium ${params.skillLevel === level.id ? 'text-slate-300' : 'text-slate-500'}`}>{level.desc}</p>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <div className="h-px bg-slate-200 w-full"></div>

                                {/* Personal Details */}
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-6">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Principal Agent</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Full Name</label>
                                                <input 
                                                    type="text" 
                                                    value={params.userName} 
                                                    onChange={(e) => onParamsChange({...params, userName: e.target.value})}
                                                    className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder-slate-400 shadow-sm"
                                                    placeholder="e.g. Jane Doe"
                                                />
                                            </div>
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Role / Title</label>
                                                <input 
                                                    type="text" 
                                                    value={params.userDepartment} 
                                                    onChange={(e) => onParamsChange({...params, userDepartment: e.target.value})}
                                                    className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none transition-all text-slate-900 placeholder-slate-400 shadow-sm"
                                                    placeholder="e.g. Head of Strategy"
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Email</label>
                                                    <input 
                                                        type="email" 
                                                        value={params.userEmail || ''} 
                                                        onChange={(e) => onParamsChange({...params, userEmail: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none shadow-sm text-sm"
                                                        placeholder="jane@company.com"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Phone</label>
                                                    <input 
                                                        type="tel" 
                                                        value={params.userPhone || ''} 
                                                        onChange={(e) => onParamsChange({...params, userPhone: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none shadow-sm text-sm"
                                                        placeholder="+1 (555) 000-0000"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-6">
                                        <h3 className="text-xs font-bold text-slate-500 uppercase tracking-widest">Organization</h3>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-sm font-bold text-slate-700 mb-1.5">Entity Type</label>
                                                <div className="relative">
                                                    <select 
                                                        value={params.organizationType} 
                                                        onChange={(e) => onParamsChange({...params, organizationType: e.target.value, organizationSubType: ''})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none appearance-none text-slate-900 shadow-sm"
                                                    >
                                                        <option value="">Select Organization Type...</option>
                                                        {ORGANIZATION_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                                                    </select>
                                                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none">
                                                        <Users className="w-4 h-4 text-slate-400" />
                                                    </div>
                                                </div>
                                                {showCustomTypeInput && (
                                                    <input 
                                                        type="text" 
                                                        value={params.customOrganizationType || ''} 
                                                        onChange={(e) => onParamsChange({...params, customOrganizationType: e.target.value})}
                                                        className="w-full mt-2 p-3 bg-slate-50 border border-slate-300 rounded-none text-sm focus:ring-1 focus:ring-slate-900"
                                                        placeholder="Specify Org Type..."
                                                    />
                                                )}
                                            </div>

                                            {params.organizationType && (
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Category / Function</label>
                                                    <select 
                                                        value={params.organizationSubType || ''} 
                                                        onChange={(e) => onParamsChange({...params, organizationSubType: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none appearance-none text-sm shadow-sm"
                                                    >
                                                        <option value="">Select Category...</option>
                                                        {subTypes.map(sub => <option key={sub} value={sub}>{sub}</option>)}
                                                        <option value="Custom">Other (Specify)</option>
                                                    </select>
                                                    {showCustomCategoryInput && (
                                                        <input 
                                                            type="text" 
                                                            value={params.customOrganizationSubType || ''} 
                                                            onChange={(e) => onParamsChange({...params, customOrganizationSubType: e.target.value})}
                                                            className="w-full mt-2 p-3 bg-slate-50 border border-slate-300 rounded-none text-sm focus:ring-1 focus:ring-slate-900"
                                                            placeholder="Specify Category..."
                                                        />
                                                    )}
                                                </div>
                                            )}

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">HQ Location</label>
                                                    <select 
                                                        value={params.userCountry} 
                                                        onChange={(e) => onParamsChange({...params, userCountry: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none appearance-none text-sm shadow-sm"
                                                    >
                                                        <option value="">Select Country...</option>
                                                        {REGIONS_AND_COUNTRIES.flatMap(r => r.countries).sort().map(c => <option key={c} value={c}>{c}</option>)}
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Target Region</label>
                                                    <select 
                                                        value={params.region} 
                                                        onChange={(e) => onParamsChange({...params, region: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none appearance-none text-sm shadow-sm"
                                                    >
                                                        <option value="">Select Region...</option>
                                                        {REGIONS_AND_COUNTRIES.map(r => <option key={r.name} value={r.name}>{r.name}</option>)}
                                                    </select>
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Address</label>
                                                    <input 
                                                        type="text" 
                                                        value={params.userAddress || ''} 
                                                        onChange={(e) => onParamsChange({...params, userAddress: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none shadow-sm"
                                                        placeholder="City, Country"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-bold text-slate-700 mb-1.5">Website</label>
                                                    <input 
                                                        type="url" 
                                                        value={params.userWebsite || ''} 
                                                        onChange={(e) => onParamsChange({...params, userWebsite: e.target.value})}
                                                        className="w-full p-3 bg-white border border-slate-300 rounded-none text-sm focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none shadow-sm"
                                                        placeholder="https://"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Strategic Assistance Request */}
                                <div className="bg-slate-50 p-8 rounded border border-slate-200">
                                    <div className="flex items-start justify-between mb-4">
                                        <div>
                                            <h3 className="text-lg font-bold text-slate-900">Strategic Assistance Request</h3>
                                            <p className="text-sm text-slate-500 mt-1">Describe your core challenge or the specific help you seek.</p>
                                        </div>
                                        <BrainCircuit className="w-6 h-6 text-slate-400" />
                                    </div>
                                    
                                    <div className="space-y-4">
                                        <textarea 
                                            value={params.initialThought || ''} 
                                            onChange={(e) => onParamsChange({...params, initialThought: e.target.value})}
                                            placeholder="e.g., 'We need to find a manufacturing partner in Vietnam to diversify our supply chain away from China. Budget is $50M...'"
                                            className="w-full p-4 border border-slate-300 rounded-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 outline-none min-h-[120px] text-sm leading-relaxed resize-y bg-white shadow-inner"
                                        />
                                        
                                        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                            <div className="relative">
                                                <input 
                                                    type="file" 
                                                    id="identity-doc-upload" 
                                                    className="hidden" 
                                                    onChange={handleFileUpload}
                                                    accept=".pdf,.docx,.txt"
                                                />
                                                <label htmlFor="identity-doc-upload" className="flex items-center gap-2 text-xs font-bold text-slate-600 cursor-pointer hover:text-slate-900 transition-colors px-3 py-2 rounded hover:bg-white border border-transparent hover:border-slate-300">
                                                    <FileText className="w-4 h-4" /> 
                                                    {params.uploadedFileName ? `Attached: ${params.uploadedFileName}` : 'Attach Briefing Doc'}
                                                </label>
                                            </div>

                                            <button 
                                                onClick={handleInitialThoughtAnalysis}
                                                disabled={!params.initialThought || isAnalyzingThought}
                                                className="text-xs font-bold text-slate-700 hover:text-slate-900 disabled:opacity-50 transition-colors flex items-center gap-1"
                                            >
                                                {isAnalyzingThought ? 'Analyzing...' : 'Refine Request with AI'}
                                            </button>
                                        </div>
                                    </div>

                                    {params.problemStatement && params.initialThought && (
                                        <div className="mt-4 pt-4 border-t border-slate-200">
                                            <div className="text-xs font-bold text-green-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                                                <CheckCircle className="w-3 h-3" /> System Interpreted Directive
                                            </div>
                                            <p className="text-sm text-slate-700 italic leading-relaxed font-mono">"{params.problemStatement}"</p>
                                        </div>
                                    )}
                                </div>

                                {/* Action Footer */}
                                <div className="flex justify-end pt-4">
                                    <button 
                                        onClick={handleIdentityComplete}
                                        disabled={!params.organizationType || !params.userCountry || !params.userName}
                                        className="group relative px-8 py-4 bg-slate-900 text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
                                    >
                                        Confirm Identity & Proceed
                                        <span className="group-hover:translate-x-1 transition-transform">→</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (stage === 'intent') {
        const hasSelected = (params.selectedIntents || []).length > 0;

        return (
            <div className="h-full w-full bg-slate-100 font-sans overflow-y-auto" id="studio-scroll-container">
                <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-10">
                    
                    {/* Header Section */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <button onClick={() => setStage('identity')} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest mb-2 transition-colors">← Back to Identity</button>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">Define Strategic Intent</h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Select your mission profile(s). The system will configure the optimal intelligence architecture.
                            </p>
                        </div>
                        
                        <div className="hidden md:block text-right">
                            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">System Configuration</div>
                            <div className="flex items-center justify-end gap-2 mt-1">
                                <div className={`w-2 h-2 rounded-full ${activeEngines.length > 0 ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></div>
                                <span className="text-sm font-bold text-slate-900">{activeEngines.length} Engines Ready</span>
                            </div>
                        </div>
                    </div>

                    {/* Section 1: Mission Profiles (Intent Selection) */}
                    <div>
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Mission Profiles</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
                            {STRATEGIC_INTENTS.map((intent) => {
                                const isSelected = (params.selectedIntents || []).includes(intent.id);
                                const isAligned = intent.personaAlignment.includes('All') || intent.personaAlignment.some(p => params.organizationType.includes(p));
                                
                                return (
                                    <button
                                        key={intent.id}
                                        onClick={() => toggleIntent(intent.id)}
                                        className={`relative group p-5 rounded-lg border text-left transition-all duration-300 flex flex-col h-full ${
                                            isSelected 
                                            ? 'bg-slate-900 border-slate-900 text-white shadow-xl transform -translate-y-1' 
                                            : isAligned
                                                ? 'bg-white border-slate-400 shadow-md ring-1 ring-slate-200'
                                                : 'bg-white border-slate-200 hover:border-slate-400 hover:shadow-sm'
                                        }`}
                                    >
                                        <div className="flex justify-between items-start mb-3">
                                            <div className={`transition-transform duration-300 ${isSelected ? 'text-white' : 'text-slate-900 group-hover:scale-105'}`}>
                                                {intent.icon}
                                            </div>
                                            {isSelected ? (
                                                <div className="bg-white text-slate-900 rounded-full p-1"><CheckCircle className="w-4 h-4" /></div>
                                            ) : isAligned && (
                                                <span className="px-2 py-0.5 bg-slate-100 text-slate-600 text-[10px] font-bold uppercase rounded border border-slate-300">
                                                    Suggested
                                                </span>
                                            )}
                                        </div>
                                        
                                        <h3 className={`text-sm font-bold mb-1 leading-tight ${isSelected ? 'text-white' : 'text-slate-900'}`}>{intent.title}</h3>
                                        <p className={`text-xs leading-relaxed mb-2 flex-grow ${isSelected ? 'text-slate-400' : 'text-slate-500'}`}>{intent.description}</p>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Indicator Bar */}
                    {hasSelected && (
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Layers className="w-5 h-5 text-indigo-600" />
                                <span className="text-sm font-bold text-indigo-900">
                                    Selected Missions: <span className="font-normal text-indigo-700">{(params.selectedIntents || []).map(id => STRATEGIC_INTENTS.find(i => i.id === id)?.title).join(', ')}</span>
                                </span>
                            </div>
                            <span className="text-xs font-bold bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full">
                                {activeEngines.length} Analytical Modules Engaged
                            </span>
                        </div>
                    )}

                    {/* Section 2: Mission Architecture (Review & Customization) */}
                    <div className="bg-white rounded-xl border border-slate-200 shadow-lg overflow-hidden">
                        <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center">
                            <div>
                                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                    <SlidersIcon className="w-5 h-5 text-slate-700" />
                                    Mission Architecture
                                </h3>
                                <p className="text-xs text-slate-500">Review & customize active intelligence engines and capabilities.</p>
                            </div>
                        </div>
                        
                        <div className="p-6">
                            {hasSelected ? (
                                <div className="space-y-10">
                                    {['Macro', 'Integrity', 'Expansion', 'Execution'].map((phase) => (
                                        <div key={phase} className="animate-fade-in">
                                            <div className="flex items-center gap-3 mb-4 pb-2 border-b border-slate-100">
                                                <div className={`w-2 h-8 rounded-full ${
                                                    phase === 'Macro' ? 'bg-blue-500' :
                                                    phase === 'Integrity' ? 'bg-purple-500' :
                                                    phase === 'Expansion' ? 'bg-orange-500' : 'bg-green-500'
                                                }`}></div>
                                                <h4 className="font-bold text-sm uppercase tracking-widest text-slate-900">{phase} Phase</h4>
                                            </div>
                                            
                                            <div className="grid gap-4">
                                                {ALL_MODULE_IDS.filter(id => MODULE_PHASES[id] === phase).map(modId => {
                                                    const isActive = activeEngines.includes(modId);
                                                    const meta = MODULE_META[modId] || { title: modId, description: 'Standard Analysis Module', features: [] };
                                                    const activeFeatureCount = meta.features.filter(f => featureToggles[modId]?.[f] !== false).length;
                                                    const customList = customFeatures[modId] || [];
                                                    const totalCount = activeFeatureCount + customList.length;

                                                    return (
                                                        <div key={modId} className={`rounded-lg border transition-all duration-200 ${
                                                            isActive 
                                                            ? 'bg-white border-slate-300 shadow-sm' 
                                                            : 'bg-slate-50 border-slate-100 opacity-60 hover:opacity-100'
                                                        }`}>
                                                            {/* Header Row */}
                                                            <div className="flex flex-col md:flex-row md:items-center justify-between p-4">
                                                                <div className="flex items-center gap-3 md:w-1/3">
                                                                    <div className={`w-3 h-3 rounded-full flex-shrink-0 ${isActive ? 'bg-green-500' : 'bg-slate-300'}`}></div>
                                                                    <div>
                                                                        <span className={`text-sm font-bold block ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                                                                            {meta.title}
                                                                        </span>
                                                                        <span className="text-xs text-slate-500">{meta.description}</span>
                                                                    </div>
                                                                </div>

                                                                {/* Capability Counter */}
                                                                <div className="flex-1 md:text-center my-2 md:my-0">
                                                                    <span className={`text-xs px-2 py-1 rounded font-bold ${isActive ? 'bg-slate-100 text-slate-700' : 'text-slate-400'}`}>
                                                                        {totalCount} Capabilities Active
                                                                    </span>
                                                                </div>
                                                                
                                                                {/* Toggle */}
                                                                <button
                                                                    onClick={() => toggleModuleActive(modId)}
                                                                    className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded text-xs font-bold uppercase border transition-colors ${
                                                                        isActive 
                                                                            ? 'bg-slate-900 text-white border-slate-900 hover:bg-slate-800' 
                                                                            : 'bg-white text-slate-400 border-slate-200 hover:border-slate-300 hover:text-slate-600'
                                                                    }`}
                                                                >
                                                                    {isActive ? 'Active' : 'Inactive'}
                                                                    {isActive ? <CheckCircle className="w-3 h-3" /> : <div className="w-3 h-3 rounded-full border border-slate-300"></div>}
                                                                </button>
                                                            </div>

                                                            {/* Detailed Features Panel (Only if Active) */}
                                                            {isActive && (
                                                                <div className="border-t border-slate-100 p-4 bg-slate-50/50 rounded-b-lg">
                                                                    <div className="mb-3">
                                                                        <h5 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Active Micro-Capabilities</h5>
                                                                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                                                                            {meta.features.map((feature, idx) => {
                                                                                const isChecked = featureToggles[modId]?.[feature] !== false; // Default true
                                                                                return (
                                                                                    <label key={idx} className={`flex items-start gap-2 cursor-pointer p-2 rounded border transition-colors ${isChecked ? 'bg-white border-slate-200' : 'bg-transparent border-transparent opacity-50'}`}>
                                                                                        <input 
                                                                                            type="checkbox" 
                                                                                            checked={isChecked}
                                                                                            onChange={() => toggleFeature(modId, feature)}
                                                                                            className="mt-0.5 h-3 w-3 rounded border-slate-300 text-slate-900 focus:ring-slate-900"
                                                                                        />
                                                                                        <span className="text-xs text-slate-700 font-medium leading-tight">{feature}</span>
                                                                                    </label>
                                                                                );
                                                                            })}
                                                                            {/* User added features */}
                                                                            {(customFeatures[modId] || []).map((feat, idx) => (
                                                                                <div key={`custom-${idx}`} className="flex items-center justify-between p-2 rounded border bg-blue-50 border-blue-200">
                                                                                    <span className="text-xs text-blue-800 font-medium leading-tight">{feat}</span>
                                                                                    <button onClick={() => removeCustomFeature(modId, feat)} className="text-blue-400 hover:text-red-500 ml-2"><TrashIcon className="w-3 h-3"/></button>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>
                                                                    
                                                                    {/* Custom Input */}
                                                                    <div className="mt-4 pt-3 border-t border-slate-200 flex items-center gap-2">
                                                                        <PlusCircleIcon className="w-4 h-4 text-slate-400" />
                                                                        <input 
                                                                            type="text" 
                                                                            placeholder="Add custom capability..." 
                                                                            className="bg-transparent text-xs font-medium text-slate-700 placeholder-slate-400 outline-none flex-grow"
                                                                            value={newFeatureInputs[modId] || ''}
                                                                            onChange={(e) => setNewFeatureInputs(prev => ({...prev, [modId]: e.target.value}))}
                                                                            onKeyDown={(e) => e.key === 'Enter' && handleAddCustomFeature(modId)}
                                                                        />
                                                                        <button 
                                                                            onClick={() => handleAddCustomFeature(modId)}
                                                                            disabled={!newFeatureInputs[modId]}
                                                                            className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase disabled:opacity-50"
                                                                        >
                                                                            Add
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </div>
                                                    );
                                                })}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-24 text-slate-300 bg-slate-50/50 rounded-lg border-2 border-dashed border-slate-200">
                                    <Layers className="w-12 h-12 mx-auto mb-4 opacity-20" />
                                    <p className="text-sm font-medium">Select a mission profile above to initialize the architecture.</p>
                                </div>
                            )}
                        </div>
                        
                        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200">
                                <button 
                                onClick={handleProceedToDiscovery}
                                disabled={!hasSelected}
                                className="w-full group relative px-8 py-4 bg-slate-900 text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center justify-center gap-3"
                            >
                                Confirm & Begin Discovery
                                <span className="group-hover:translate-x-1 transition-transform">→</span>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // STAGE 3 (NEW): STRATEGIC DISCOVERY & ANALYSIS
    if (stage === 'discovery') {
        return (
            <div className="h-full w-full bg-slate-100 font-sans overflow-y-auto" id="studio-scroll-container">
                <div className="max-w-7xl mx-auto p-6 md:p-8 space-y-8">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
                        <div>
                            <button onClick={() => setStage('intent')} className="text-xs font-bold text-slate-400 hover:text-slate-900 uppercase tracking-widest mb-2 transition-colors">← Back to Intent</button>
                            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
                                <MatchMakerIcon className="w-8 h-8 text-blue-600" />
                                Strategic Discovery
                            </h1>
                            <p className="text-sm text-slate-600 mt-1">
                                Preliminary target assessment and early matchmaking scan.
                            </p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        {/* Column 1: Target Viability & Profile */}
                        <div className="md:col-span-1 space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
                                <div className="bg-slate-50 px-4 py-3 border-b border-slate-200">
                                    <h3 className="font-bold text-sm text-slate-800 uppercase tracking-wide">Target Assessment</h3>
                                </div>
                                <div className="p-4">
                                    {params.targetPartner ? (
                                        <PartnerIntelligenceDashboard params={params} compact={true} />
                                    ) : (
                                        <div className="text-center py-8 text-slate-400">
                                            <p className="text-xs italic mb-4">No specific partner targeted yet.</p>
                                            <div className="p-3 bg-yellow-50 rounded border border-yellow-100 text-yellow-800 text-xs text-left">
                                                <strong>Strategic Fit Rating:</strong> Pending Selection
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="font-bold text-sm text-slate-900 mb-4">Mission Viability Gauge</h3>
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-xs font-bold text-slate-500">Risk</span>
                                    <span className="text-xs font-bold text-slate-500">Reward</span>
                                </div>
                                <div className="h-3 w-full bg-slate-100 rounded-full overflow-hidden flex">
                                    <div className="w-1/3 bg-red-400"></div>
                                    <div className="w-1/3 bg-yellow-400"></div>
                                    <div className="w-1/3 bg-green-500"></div>
                                </div>
                                <div className="mt-2 flex justify-center">
                                    <span className="text-xs font-bold px-3 py-1 bg-green-100 text-green-800 rounded-full border border-green-200">High Potential</span>
                                </div>
                                <p className="text-xs text-slate-500 mt-4 text-center leading-relaxed">
                                    Preliminary scan suggests high compatibility with {params.region} market dynamics.
                                </p>
                            </div>
                        </div>

                        {/* Column 2 & 3: Automated Matchmaking */}
                        <div className="md:col-span-2 space-y-6">
                            <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                                <h3 className="font-bold text-lg text-slate-900 mb-2">Opportunity Scan</h3>
                                <p className="text-xs text-slate-500 mb-6">
                                    Identifying asymmetric opportunities based on your profile ({params.organizationType}) and region ({params.region}).
                                </p>
                                <MatchmakingEngine 
                                    params={params} 
                                    autoRun={true} 
                                    compact={true}
                                    onMatchesFound={(matches) => {
                                        // Optional: Could auto-select best match
                                        console.log("Early matches found:", matches);
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-slate-200">
                        <button 
                            onClick={handleProceedToCanvas}
                            className="group relative px-8 py-4 bg-slate-900 text-white font-bold text-sm tracking-widest uppercase rounded hover:bg-slate-800 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 flex items-center gap-3"
                        >
                            Initialize Full Strategic Canvas
                            <span className="group-hover:translate-x-1 transition-transform">→</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // STAGE 4: STRATEGIC CANVAS
    return (
        <div className="flex h-full w-full bg-slate-100 overflow-hidden">
            <div className="flex-1 flex flex-col h-full overflow-hidden relative">
                <StrategicCanvas 
                    params={{...params, analyticalModules: activeEngines}} // Force pass the active list
                    onParamsChange={onParamsChange}
                    onBack={() => setStage('discovery')}
                />
            </div>
            {/* Persistent AI Co-Pilot */}
            <div className="w-80 flex-shrink-0 hidden xl:block bg-white border-l border-slate-200 shadow-lg z-20">
                <Inquire params={params} />
            </div>
        </div>
    );
};
