
import React, { useState, useEffect } from 'react';
import { ReportParameters, SPIResult, EthicalCheckResult } from '../types';
import { generateSpeech, decodeAudioData } from '../services/nexusService';
import { calculateSPI, runEthicalSafeguards } from '../services/spiEngine';
import { FileText, Users, GlobeIcon, Target, ShieldCheck, TrendingUp, BrainCircuit, DownloadIcon, NexusLogo, AlertTriangleIcon, CheckCircle } from './Icons';
import SuccessScoreCard from './SuccessScoreCard';
import EthicsPanel from './EthicsPanel';

interface ReviewStepProps {
    params: ReportParameters;
}

export const ReviewStep: React.FC<ReviewStepProps> = ({ params }) => {
    const [activeTab, setActiveTab] = useState<'identity' | 'mission' | 'modules' | 'artifacts'>('identity');
    const [isPlaying, setIsPlaying] = useState(false);
    const [audioLoading, setAudioLoading] = useState(false);
    const [spiData, setSpiData] = useState<SPIResult | null>(null);
    const [ethicalData, setEthicalData] = useState<EthicalCheckResult | null>(null);
    const [backendEthics, setBackendEthics] = useState<any>(null);
    const [backendStatus, setBackendStatus] = useState<string>('Idle');

    useEffect(() => {
        // 1. Calculate scores locally for immediate UI feedback (Legacy/Fast Path)
        const spi = calculateSPI(params);
        const ethics = runEthicalSafeguards(params);
        setSpiData(spi);
        setEthicalData(ethics);

        // 2. Prepare Backend Payload from calculated sub-scores
        const payload: any = {
            context: {
                project: { industry: params.industry[0], region: params.region },
                target: params.idealPartnerProfile,
            }
        };
        
        // Flatten SPI inputs for payload
        spi.breakdown.forEach(b => {
            if(b.label === 'Economic Readiness') payload.ER = b.value;
            if(b.label === 'Symbiosis Potential') payload.SP = b.value;
            if(b.label === 'Cultural Compatibility') payload.CC = b.value;
            if(b.label === 'Partner Reliability') payload.PR = b.value;
            if(b.label === 'Activation Velocity') payload.CA = b.value;
            if(b.label === 'Ethical Alignment') payload.EA = b.value;
            if(b.label === 'User Transparency') payload.UT = b.value;
        });

        // 3. Submit to Backend & Poll
        const submitAndPoll = async () => {
            try {
                setBackendStatus('Submitting...');
                const res = await fetch("http://localhost:5002/api/cases", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload)
                });
                const data = await res.json();
                if (data.ok && data.case) {
                    const caseId = data.case.id;
                    setBackendStatus('Processing...');
                    
                    const interval = setInterval(async () => {
                        try {
                            const pollRes = await fetch(`http://localhost:5002/api/cases/${caseId}`);
                            const pollData = await pollRes.json();
                            if (pollData.case) {
                                if (pollData.case.status === "complete") {
                                    clearInterval(interval);
                                    setBackendStatus('Verified');
                                    // Update local SPI with verified backend result if available
                                    if (pollData.case.result?.spi) {
                                        // Optional: Merge backend SPI logic if differing
                                    }
                                    // Update Ethics from Backend
                                    if (pollData.case.result?.ethics) {
                                        setBackendEthics(pollData.case.result.ethics);
                                    }
                                } else if (pollData.case.status === "error") {
                                    clearInterval(interval);
                                    setBackendStatus('Error');
                                }
                            }
                        } catch (e) {
                            console.error("Polling error", e);
                        }
                    }, 1500);
                }
            } catch (e) {
                console.error("Backend connectivity issue", e);
                setBackendStatus('Offline (Local Mode)');
            }
        };
        
        submitAndPoll();

    }, [params]);

    const handleListen = async () => {
        if (isPlaying) return;
        setAudioLoading(true);
        
        const textToSay = `Intelligence Dossier for ${params.userName}. 
        Mission Directive: ${params.problemStatement}.
        Strategic Intent: ${params.selectedIntents?.join(' plus ') || 'Standard Analysis'}.
        Target Sector: ${params.industry.join(' and ')}.
        Region: ${params.region}.
        Success Probability Index is ${spiData?.spi} percent.
        Ethical Safeguard status: ${ethicalData?.passed ? 'Passed' : 'Requires Review'}.`;
        
        const base64Audio = await generateSpeech(textToSay);
        
        if (base64Audio) {
            try {
                const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
                const audioBuffer = await decodeAudioData(base64Audio, audioContext);
                const source = audioContext.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContext.destination);
                source.start();
                setAudioLoading(false);
                setIsPlaying(true);
                source.onended = () => { setIsPlaying(false); audioContext.close(); };
            } catch (e) {
                console.error("Audio Playback Error", e);
                setAudioLoading(false);
            }
        } else {
            setAudioLoading(false);
        }
    };

    return (
        <div className="h-full w-full bg-slate-50 overflow-hidden flex flex-col">
            {/* Dossier Header */}
            <div className="bg-slate-900 text-white px-8 py-6 flex justify-between items-center flex-shrink-0 shadow-md z-10">
                <div className="flex items-center gap-4">
                    <div className="bg-white/10 p-2 rounded-lg backdrop-blur-sm border border-white/20">
                        <FileText className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold tracking-tight">Intelligence Dossier</h1>
                        <p className="text-xs text-slate-400 font-mono uppercase tracking-widest">Ref: {params.reportId || 'PENDING'} • Status: {backendStatus}</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button 
                        onClick={handleListen}
                        disabled={isPlaying || audioLoading}
                        className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${isPlaying ? 'bg-green-500 text-white animate-pulse' : 'bg-white/10 text-white hover:bg-white/20'}`}
                    >
                        {audioLoading ? '...' : isPlaying ? 'Broadcasting' : '▶ Audio Brief'}
                    </button>
                    <button onClick={() => window.print()} className="px-6 py-2 bg-white text-slate-900 rounded-lg text-sm font-bold hover:bg-slate-100 transition-colors shadow-lg flex items-center gap-2">
                        <DownloadIcon className="w-4 h-4" /> Export Dossier
                    </button>
                </div>
            </div>

            <div className="flex flex-grow overflow-hidden">
                {/* Sidebar Tabs */}
                <div className="w-64 bg-white border-r border-gray-200 flex flex-col py-6 space-y-2">
                    {[
                        { id: 'identity', label: 'Identity Profile', icon: Users },
                        { id: 'mission', label: 'Mission Directive', icon: Target },
                        { id: 'modules', label: 'Intelligence Modules', icon: BrainCircuit },
                        { id: 'artifacts', label: 'Classified Artifacts', icon: FileText },
                    ].map(tab => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id as any)}
                            className={`px-6 py-3 text-left flex items-center gap-3 text-sm font-medium transition-all border-l-4 ${activeTab === tab.id ? 'border-slate-900 bg-slate-50 text-slate-900' : 'border-transparent text-slate-500 hover:bg-slate-50 hover:text-slate-700'}`}
                        >
                            <tab.icon className="w-4 h-4" />
                            {tab.label}
                        </button>
                    ))}
                </div>

                {/* Main Content Area */}
                <div className="flex-grow overflow-y-auto bg-slate-50 p-8 md:p-12">
                    <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 min-h-[600px] relative overflow-hidden">
                        {/* Watermark */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none">
                            <NexusLogo className="w-96 h-96 text-slate-900" />
                        </div>

                        <div className="p-12 relative z-10">
                            {/* PREDICTIVE SCORE HEADER */}
                            <div className="mb-10 space-y-6">
                                {spiData && <SuccessScoreCard spiResult={spiData} />}
                                
                                {/* Display Backend Ethics Report if available, else local fallback status */}
                                {backendEthics ? (
                                    <EthicsPanel ethics={backendEthics} />
                                ) : (
                                    ethicalData && (
                                        <div className={`p-4 rounded-lg border flex items-start gap-4 ${ethicalData.passed ? 'bg-blue-50 border-blue-200' : 'bg-red-50 border-red-200'}`}>
                                            <div className={`p-2 rounded-full ${ethicalData.passed ? 'bg-blue-100 text-blue-600' : 'bg-red-100 text-red-600'}`}>
                                                {ethicalData.passed ? <ShieldCheck className="w-5 h-5" /> : <AlertTriangleIcon className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <h4 className={`font-bold text-sm ${ethicalData.passed ? 'text-blue-900' : 'text-red-900'}`}>
                                                    Ethical Safeguard Engine: {ethicalData.passed ? 'Pass' : 'Review Required'}
                                                </h4>
                                                <p className="text-xs text-slate-600 mt-1">
                                                    {backendStatus === 'Processing...' ? 'Running deep scan...' : 'Preliminary check complete.'}
                                                </p>
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>

                            {activeTab === 'identity' && (
                                <div className="space-y-8 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Identity Profile</h2>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Principal Agent</label>
                                            <p className="text-lg font-medium text-slate-900 mt-1">{params.userName}</p>
                                            <p className="text-sm text-slate-500">{params.userDepartment}</p>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Organization</label>
                                            <p className="text-lg font-medium text-slate-900 mt-1">{params.organizationType}</p>
                                            <p className="text-sm text-slate-500">{params.userCountry}</p>
                                        </div>
                                        <div className="col-span-2">
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Contact Protocols</label>
                                            <div className="mt-2 p-4 bg-slate-50 rounded-lg border border-slate-100 flex gap-8">
                                                <div>
                                                    <span className="text-xs text-slate-500 block">Email</span>
                                                    <span className="text-sm font-medium text-slate-900">{params.userEmail || 'N/A'}</span>
                                                </div>
                                                <div>
                                                    <span className="text-xs text-slate-500 block">Secure Line</span>
                                                    <span className="text-sm font-medium text-slate-900">{params.userPhone || 'N/A'}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'mission' && (
                                <div className="space-y-8 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Mission Directive</h2>
                                    <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-100">
                                        <label className="text-xs font-bold text-indigo-400 uppercase tracking-wider mb-2 block">Primary Objective</label>
                                        <p className="text-xl font-serif text-indigo-900 leading-relaxed">
                                            "{params.problemStatement}"
                                        </p>
                                    </div>
                                    <div className="grid grid-cols-2 gap-8">
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Target Region</label>
                                            <div className="mt-2 flex items-center gap-2">
                                                <GlobeIcon className="w-5 h-5 text-slate-600" />
                                                <span className="text-lg font-medium text-slate-900">{params.region}</span>
                                            </div>
                                        </div>
                                        <div>
                                            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Sector Focus</label>
                                            <div className="mt-2 flex items-center gap-2">
                                                <Target className="w-5 h-5 text-slate-600" />
                                                <span className="text-lg font-medium text-slate-900">{params.industry[0]}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeTab === 'modules' && (
                                <div className="space-y-8 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Active Intelligence Modules</h2>
                                    <div className="space-y-4">
                                        {(params.selectedIntents || []).length > 0 ? (
                                            <div className="grid gap-4">
                                                <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                                                    <h3 className="font-bold text-slate-800 mb-2">Strategic Intents</h3>
                                                    <div className="flex flex-wrap gap-2">
                                                        {params.selectedIntents?.map(id => (
                                                            <span key={id} className="px-3 py-1 bg-white border border-slate-300 rounded-full text-xs font-bold text-slate-700 uppercase">
                                                                {id.replace(/_/g, ' ')}
                                                            </span>
                                                        ))}
                                                    </div>
                                                </div>
                                                {/* Placeholder for module status visualization */}
                                                <div className="p-4 bg-green-50 rounded-lg border border-green-100 flex items-center gap-3">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                                    <span className="text-sm font-medium text-green-800">All selected engines calibrated and ready for execution on Canvas.</span>
                                                </div>
                                            </div>
                                        ) : (
                                            <p className="text-slate-500 italic">No specific strategic intents selected. Defaulting to general analysis.</p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {activeTab === 'artifacts' && (
                                <div className="space-y-8 animate-fade-in">
                                    <h2 className="text-2xl font-bold text-slate-900 border-b border-gray-100 pb-4 mb-6">Classified Artifacts</h2>
                                    <div className="space-y-3">
                                        {[
                                            { name: 'Full Strategic Report.pdf', size: '2.4 MB', type: 'PDF' },
                                            { name: 'Partner Candidate List.csv', size: '156 KB', type: 'CSV' },
                                            { name: 'Risk Assessment Matrix.xlsx', size: '1.1 MB', type: 'XLSX' },
                                            { name: 'Geopolitical Briefing.pdf', size: '890 KB', type: 'PDF' }
                                        ].map((file, i) => (
                                            <div key={i} className="flex items-center justify-between p-4 bg-white border border-slate-200 rounded-xl hover:border-slate-400 cursor-pointer transition-all group hover:shadow-md">
                                                <div className="flex items-center gap-4">
                                                    <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-slate-200">
                                                        <FileText className="w-5 h-5 text-slate-500 group-hover:text-slate-900" />
                                                    </div>
                                                    <div>
                                                        <span className="text-sm font-bold text-slate-800 block">{file.name}</span>
                                                        <span className="text-xs text-slate-400">{file.type} • {file.size}</span>
                                                    </div>
                                                </div>
                                                <div className="p-2 text-slate-300 group-hover:text-slate-900 transition-colors">
                                                    <DownloadIcon className="w-5 h-5" />
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
