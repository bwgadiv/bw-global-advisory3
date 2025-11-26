
import React, { useState } from 'react';
import CaseList from './CaseList';
import PolicyConfig from './PolicyConfig';
import CaseReview from './CaseReview';
import { ShieldCheckIcon, Settings, LayoutDashboardIcon } from '../Icons';

const AdminDashboard: React.FC = () => {
    const [view, setView] = useState<'cases' | 'policy' | 'review'>('cases');
    const [selectedCaseId, setSelectedCaseId] = useState<string | null>(null);

    const handleSelectCase = (id: string) => {
        setSelectedCaseId(id);
        setView('review');
    };

    const handleBackToList = () => {
        setSelectedCaseId(null);
        setView('cases');
    };

    return (
        <div className="min-h-full bg-slate-100 text-slate-900 font-sans">
            <header className="bg-slate-900 text-white px-8 py-4 shadow-md flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <ShieldCheckIcon className="w-6 h-6 text-orange-500" />
                    <h1 className="text-xl font-bold tracking-tight">Nexus Governance Console</h1>
                </div>
                <nav className="flex gap-4">
                    <button 
                        onClick={() => setView('cases')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === 'cases' || view === 'review' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Case Management
                    </button>
                    <button 
                        onClick={() => setView('policy')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold transition-colors ${view === 'policy' ? 'bg-slate-800 text-white' : 'text-slate-400 hover:text-white'}`}
                    >
                        Policy Engine
                    </button>
                </nav>
            </header>

            <main className="p-8 max-w-7xl mx-auto">
                {view === 'cases' && <CaseList onSelectCase={handleSelectCase} />}
                {view === 'review' && selectedCaseId && <CaseReview caseId={selectedCaseId} onBack={handleBackToList} />}
                {view === 'policy' && <PolicyConfig />}
            </main>
        </div>
    );
};

export default AdminDashboard;
