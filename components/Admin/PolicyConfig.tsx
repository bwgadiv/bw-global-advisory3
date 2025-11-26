
import React, { useEffect, useState } from "react";
import { Settings } from "../Icons";

export default function PolicyConfig() {
  const [policy, setPolicy] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  useEffect(()=>{
    fetch("http://localhost:5002/api/policy")
        .then(r=>r.json())
        .then(d=>setPolicy(d.policy))
        .catch(console.error);
  }, []);

  if (!policy) return <div className="p-8 text-center text-gray-500">Loading policy configuration...</div>;

  const update = (path:string, val:any) => {
    const p = JSON.parse(JSON.stringify(policy));
    const keys = path.split(".");
    let o:any = p;
    for(let i=0;i<keys.length-1;i++) o=o[keys[i]];
    o[keys[keys.length-1]] = Number(val);
    setPolicy(p);
  };

  const save = async ()=> {
    setSaving(true);
    try {
        await fetch("http://localhost:5002/api/policy", { method:"POST", headers: {"content-type":"application/json"}, body: JSON.stringify(policy) });
        alert("Policy configuration saved successfully.");
    } catch(e) {
        console.error(e);
        alert("Failed to save policy.");
    } finally {
        setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
              <Settings className="w-6 h-6 text-slate-600" />
              Ethics Engine Configuration
          </h2>

          <div className="grid md:grid-cols-2 gap-8">
              <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Risk Weights (Total ~1.0)</h3>
                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      {Object.keys(policy.weights).map((k:string)=>(
                        <div key={k} className="flex justify-between items-center">
                          <label className="text-sm font-medium text-slate-700 capitalize">{k.replace(/([A-Z])/g, ' $1').trim()}</label>
                          <input 
                            type="number" 
                            step="0.01" 
                            min="0"
                            max="1"
                            className="w-24 p-2 border border-slate-300 rounded text-right"
                            value={policy.weights[k]} 
                            onChange={e=>update(`weights.${k}`, e.target.value)} 
                          />
                        </div>
                      ))}
                  </div>
              </div>

              <div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Safety Thresholds</h3>
                  <div className="space-y-4 bg-slate-50 p-4 rounded-lg border border-slate-200">
                      <div className="flex justify-between items-center">
                        <div>
                            <label className="block text-sm font-bold text-red-700">Block Threshold</label>
                            <p className="text-xs text-slate-500">Scores below this trigger an automatic BLOCK.</p>
                        </div>
                        <input 
                            type="number" 
                            className="w-24 p-2 border border-red-200 rounded text-right font-bold text-red-700"
                            value={policy.thresholds.block} 
                            onChange={e=>update("thresholds.block", e.target.value)} 
                        />
                      </div>
                      <div className="flex justify-between items-center">
                        <div>
                            <label className="block text-sm font-bold text-orange-700">Caution Threshold</label>
                            <p className="text-xs text-slate-500">Scores below this trigger CAUTION flags.</p>
                        </div>
                        <input 
                            type="number" 
                            className="w-24 p-2 border border-orange-200 rounded text-right font-bold text-orange-700"
                            value={policy.thresholds.caution} 
                            onChange={e=>update("thresholds.caution", e.target.value)} 
                        />
                      </div>
                  </div>

                  <div className="mt-8">
                      <button 
                        onClick={save} 
                        disabled={saving}
                        className="w-full py-3 bg-slate-900 text-white font-bold rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
                      >
                          {saving ? "Saving Config..." : "Save Policy Configuration"}
                      </button>
                  </div>
              </div>
          </div>
      </div>
    </div>
  );
}
