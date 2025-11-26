
import React, { useEffect, useState } from "react";
import EthicsPanel from "../EthicsPanel";
import { ShieldCheckIcon, AlertTriangleIcon } from "../Icons";

interface CaseReviewProps {
    caseId: string;
    onBack: () => void;
}

export default function CaseReview({ caseId, onBack }: CaseReviewProps) {
  const [c, setC] = useState<any>(null);
  const [notes, setNotes] = useState("");
  const [actioning, setActioning] = useState(false);

  const loadCase = () => {
      fetch(`http://localhost:5002/api/cases/${caseId}`)
        .then(r=>r.json())
        .then(d=>setC(d.case))
        .catch(console.error);
  };

  useEffect(()=> {
    if (caseId) loadCase();
  }, [caseId]);

  const doAction = async (decision: "approve" | "reject" | "require_docs") => {
    setActioning(true);
    try {
        await fetch(`http://localhost:5002/api/cases/${caseId}/review`, {
        method: "POST",
        headers: { "content-type":"application/json" },
        body: JSON.stringify({ decision, notes })
        });
        loadCase(); // Reload to show updated status
    } catch (e) {
        console.error(e);
    } finally {
        setActioning(false);
    }
  };

  if (!c) return <div className="p-8 text-center">Loading case details...</div>;

  const adminDecision = c.result?.adminReview?.decision;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
          <button onClick={onBack} className="text-sm text-slate-500 hover:text-slate-900">← Back to List</button>
          <div className="text-xs font-mono text-slate-400">ID: {c.id}</div>
      </div>

      <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
          <div className="flex justify-between items-start mb-6">
              <div>
                  <h2 className="text-2xl font-bold text-slate-900">Case Review</h2>
                  <p className="text-slate-600">Target: <strong>{c.payload?.context?.target || "Unknown"}</strong></p>
              </div>
              {adminDecision && (
                  <div className="px-4 py-2 bg-slate-100 rounded-lg border border-slate-200 text-right">
                      <div className="text-xs text-slate-500 uppercase font-bold">Admin Decision</div>
                      <div className="font-bold text-slate-900 capitalize">{adminDecision}</div>
                  </div>
              )}
          </div>

          <div className="grid md:grid-cols-2 gap-8">
              <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Ethics & Risk Profile</h3>
                  <EthicsPanel ethics={c.result?.ethics} />
              </div>
              
              <div className="space-y-6">
                  <div>
                      <h3 className="text-lg font-bold text-slate-800 mb-4">Case Payload</h3>
                      <pre className="bg-slate-50 p-4 rounded-lg text-xs font-mono overflow-auto max-h-60 border border-slate-200 text-slate-700">
                          {JSON.stringify(c.payload, null, 2)}
                      </pre>
                  </div>

                  {!adminDecision ? (
                      <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
                          <h3 className="text-lg font-bold text-slate-800 mb-2">Admin Action</h3>
                          <label className="block text-sm font-bold text-slate-700 mb-2">Review Notes</label>
                          <textarea 
                              rows={4} 
                              className="w-full p-3 border border-slate-300 rounded-lg mb-4 focus:ring-2 focus:ring-slate-900 outline-none"
                              value={notes} 
                              onChange={e=>setNotes(e.target.value)} 
                              placeholder="Enter rationale for decision..."
                          />
                          <div className="flex gap-3">
                              <button 
                                  onClick={()=>doAction("approve")} 
                                  disabled={actioning}
                                  className="px-4 py-2 bg-green-600 text-white font-bold rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                              >
                                  Approve & Override
                              </button>
                              <button 
                                  onClick={()=>doAction("require_docs")} 
                                  disabled={actioning}
                                  className="px-4 py-2 bg-amber-500 text-white font-bold rounded hover:bg-amber-600 transition-colors disabled:opacity-50"
                              >
                                  Request Documents
                              </button>
                              <button 
                                  onClick={()=>doAction("reject")} 
                                  disabled={actioning}
                                  className="px-4 py-2 bg-red-600 text-white font-bold rounded hover:bg-red-700 transition-colors disabled:opacity-50"
                              >
                                  Reject Case
                              </button>
                          </div>
                      </div>
                  ) : (
                      <div className="bg-green-50 p-5 rounded-xl border border-green-100">
                          <div className="flex items-center gap-2 text-green-800 font-bold mb-2">
                              <ShieldCheckIcon className="w-5 h-5" /> Review Complete
                          </div>
                          <p className="text-sm text-green-700 mb-2">
                              Decision: <strong>{adminDecision}</strong>
                          </p>
                          {c.result?.adminReview?.notes && (
                              <p className="text-sm text-green-700 italic">
                                  "{c.result.adminReview.notes}"
                              </p>
                          )}
                          <div className="text-xs text-green-600 mt-2">
                              {new Date(c.result.adminReview.reviewedAt).toLocaleString()}
                          </div>
                      </div>
                  )}
              </div>
          </div>
      </div>
    </div>
  );
}
