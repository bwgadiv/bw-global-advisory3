
import React, { useEffect, useState } from "react";

type CaseSummary = {
  id: string;
  status: string;
  created: number;
  payload: any;
  result?: {
      ethics?: {
          overallFlag: string;
          overallScore: number;
      };
      adminReview?: {
          decision: string;
      };
  };
};

interface CaseListProps {
    onSelectCase: (id: string) => void;
}

export default function CaseList({ onSelectCase }: CaseListProps) {
  const [cases, setCases] = useState<CaseSummary[]>([]);
  const [loading, setLoading] = useState(true);

  const loadCases = () => {
    setLoading(true);
    fetch("http://localhost:5002/api/cases")
      .then(r => r.json())
      .then(d => {
          setCases(d.cases || []);
          setLoading(false);
      })
      .catch(e => {
          console.error(e);
          setLoading(false);
      });
  };

  useEffect(() => {
    loadCases();
    const interval = setInterval(loadCases, 5000); // Poll for updates
    return () => clearInterval(interval);
  }, []);

  if (loading && cases.length === 0) return <div className="p-8 text-center text-gray-500">Loading cases...</div>;

  return (
    <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
          <h3 className="font-bold text-slate-800">Recent Cases</h3>
          <button onClick={loadCases} className="text-xs text-slate-500 hover:text-slate-800">Refresh</button>
      </div>
      <table className="w-full text-sm text-left">
        <thead className="text-xs text-slate-500 uppercase bg-slate-50 border-b border-slate-100">
          <tr>
            <th className="px-6 py-3">Target / Context</th>
            <th className="px-6 py-3">Status</th>
            <th className="px-6 py-3">Ethics Score</th>
            <th className="px-6 py-3">Created</th>
            <th className="px-6 py-3">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {cases.map(c => {
            const target = c.payload?.context?.target || c.payload?.target || "—";
            const score = c.result?.ethics?.overallScore;
            const flag = c.result?.ethics?.overallFlag;
            const review = c.result?.adminReview?.decision;

            return (
            <tr key={c.id} className="hover:bg-slate-50 transition-colors">
              <td className="px-6 py-4 font-medium text-slate-900">{target}</td>
              <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-xs font-bold uppercase ${
                      c.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                      flag === 'BLOCK' ? 'bg-red-100 text-red-700' :
                      flag === 'CAUTION' ? 'bg-orange-100 text-orange-700' :
                      'bg-green-100 text-green-700'
                  }`}>
                      {review ? `${review} (Review)` : c.status === 'complete' ? flag || 'OK' : c.status}
                  </span>
              </td>
              <td className="px-6 py-4 font-mono">{score ?? "—"}</td>
              <td className="px-6 py-4 text-slate-500">{new Date(c.created).toLocaleString()}</td>
              <td className="px-6 py-4">
                  <button 
                    onClick={() => onSelectCase(c.id)}
                    className="text-blue-600 hover:text-blue-800 font-semibold"
                  >
                      Review
                  </button>
              </td>
            </tr>
          )})}
          {cases.length === 0 && (
              <tr>
                  <td colSpan={5} className="p-8 text-center text-slate-400 italic">No cases found in database.</td>
              </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
