
import React from 'react';
import { 
    NexusLogo, Target, GlobeIcon, ActivityIcon, ShieldCheck, 
    BrainCircuit, Users, Zap, RocketIcon, Layers, CheckCircle, 
    ManualIcon, LockIcon
} from './Icons';

interface LandingPageProps {
    onEnter: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onEnter }) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-bronze-100 selection:text-bronze-900">
            
            {/* --- HEADER --- */}
            <header className="fixed top-0 left-0 w-full p-6 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg">
                            <NexusLogo className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-wider uppercase text-slate-900">BW Nexus AI</span>
                    </div>
                    <button onClick={onEnter} className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-bronze-600 transition-colors">
                        Log In
                    </button>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="pt-40 pb-20 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-black text-slate-900 leading-tight mb-8">
                        Your Region’s Value, <br/>
                        <span className="text-bronze-600">Understood Globally.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-4xl mx-auto mb-10">
                        The world’s first intelligence system designed to uncover what everyone else overlooks.
                    </p>

                    <div className="max-w-3xl mx-auto space-y-4 text-lg text-slate-500 leading-relaxed mb-12">
                        <p>
                            For decades, vast potential in regional economies has remained invisible to global investors—simply because no system could see it.
                        </p>
                        <p className="text-slate-900 font-bold text-xl">
                            BW Nexus AI changes that.
                        </p>
                    </div>

                    <div>
                        <button 
                            onClick={onEnter}
                            className="px-10 py-5 bg-slate-900 text-white rounded-xl font-bold text-lg tracking-widest uppercase hover:bg-bronze-800 transition-all shadow-xl"
                        >
                            Access Platform
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-16 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">
                        It is the first platform in the world designed to reveal the hidden value inside every region —
                        no matter how small, remote, emerging, or underestimated.
                    </p>
                    <div className="mt-8 grid md:grid-cols-3 gap-8 text-left md:text-center">
                        <div>
                            <div className="text-bronze-600 font-bold mb-2">Translates</div>
                            <p className="text-slate-600">Regional value into global language.</p>
                        </div>
                        <div>
                            <div className="text-bronze-600 font-bold mb-2">Turns</div>
                            <p className="text-slate-600">Potential into confidence.</p>
                        </div>
                        <div>
                            <div className="text-bronze-600 font-bold mb-2">Transforms</div>
                            <p className="text-slate-600">Overlooked places into investable opportunities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE PROBLEM --- */}
            <section className="py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-12 text-center md:text-left">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">The Problem: The 100-Year Confidence Gap</h2>
                        <p className="text-xl text-slate-600 max-w-3xl">
                            Global opportunity has been blocked by three invisible barriers:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-16">
                        {[
                            {
                                id: "01",
                                title: "Intelligence Was Expensive",
                                desc: "Only elite firms could afford deep research. Everyone else was left guessing."
                            },
                            {
                                id: "02",
                                title: "The Unknown Felt Risky",
                                desc: "Investors dismissed regions lacking reliable, structured, transparent intelligence."
                            },
                            {
                                id: "03",
                                title: "No Shared Language",
                                desc: "Local leaders and global decision-makers spoke different strategic frameworks."
                            }
                        ].map((item) => (
                            <div key={item.id} className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-3xl font-black text-slate-200 mb-3">{item.id}</div>
                                <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed text-sm">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-100 rounded-3xl p-8 md:p-12">
                        <h3 className="text-xl font-bold text-slate-900 mb-4">The Result: A Global Bottleneck</h3>
                        <ul className="grid md:grid-cols-2 gap-4 text-slate-700">
                            <li className="flex items-center gap-3"><span className="text-red-500 font-bold">✕</span> Capital funnels into the same cities</li>
                            <li className="flex items-center gap-3"><span className="text-red-500 font-bold">✕</span> Regional economies remain underestimated</li>
                            <li className="flex items-center gap-3"><span className="text-red-500 font-bold">✕</span> Innovation is geographically trapped</li>
                            <li className="flex items-center gap-3"><span className="text-red-500 font-bold">✕</span> Good ideas die unseen</li>
                        </ul>
                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <p className="text-xl font-bold text-bronze-600">BW Nexus AI exists to eliminate this confidence gap permanently.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CONSULTING TRUTH --- */}
            <section className="py-24 px-6 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
                    <div>
                        <h2 className="text-3xl md:text-4xl font-black mb-6">The Truth About Today’s Consulting</h2>
                        <p className="text-lg text-slate-300 mb-6 leading-relaxed">
                            Global firms are investing millions in AI—but they aren't changing their model. They are simply strapping a rocket engine to a horse cart.
                        </p>
                    </div>
                    <div className="bg-white/5 p-8 rounded-3xl border border-white/10">
                        <h3 className="text-lg font-bold text-white mb-4 uppercase tracking-widest">The Legacy Model</h3>
                        <div className="grid grid-cols-2 gap-3 text-sm text-slate-300">
                            <div className="flex gap-2"><span className="text-red-400">✕</span> Slow manual research</div>
                            <div className="flex gap-2"><span className="text-red-400">✕</span> Late in decision cycle</div>
                            <div className="flex gap-2"><span className="text-red-400">✕</span> Expensive human teams</div>
                            <div className="flex gap-2"><span className="text-red-400">✕</span> No regional scalability</div>
                        </div>
                        <div className="mt-6 pt-6 border-t border-white/10">
                            <p className="text-base italic text-slate-400">
                                They are hired after confidence exists.
                                Most progress dies where confidence has not yet been built.
                            </p>
                            <p className="mt-3 text-lg font-bold text-white">That is where BW Nexus AI begins.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE SOLUTION --- */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">The Solution: Strategic Symbiosis</h2>
                        <p className="text-lg text-slate-600 max-w-4xl mx-auto leading-relaxed">
                            BW Nexus AI is an intelligence engine built to reveal hidden relationships. 
                            It understands risk, confidence, and execution logic.
                        </p>
                    </div>

                    {/* Capabilities Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            {
                                title: "Global Matchmaking Engine",
                                desc: "Discovers partners you didn’t know existed based on strategic fit & velocity.",
                                icon: <GlobeIcon className="w-8 h-8 text-bronze-600" />
                            },
                            {
                                title: "Regional Economic DNA Scanner",
                                desc: "Uses LQ analysis and trade flows to uncover the true identity of an economy.",
                                icon: <ActivityIcon className="w-8 h-8 text-indigo-600" />
                            },
                            {
                                title: "Predictive Symbiosis Engine",
                                desc: "Simulates how projects will ripple across employment & supply chains.",
                                icon: <Zap className="w-8 h-8 text-amber-600" />
                            },
                            {
                                title: "AI Strategist Co-Pilot",
                                desc: "A thinking engine that challenges assumptions & structures plans.",
                                icon: <BrainCircuit className="w-8 h-8 text-emerald-600" />
                            },
                            {
                                title: "Deal-Maker’s Academy",
                                desc: "Models negotiation styles & culture for every country-pairing.",
                                icon: <Users className="w-8 h-8 text-purple-600" />
                            },
                            {
                                title: "The Partnership Toolkit",
                                desc: "Instantly produces intelligence reports, risk diagnostics & outreach letters.",
                                icon: <ManualIcon className="w-8 h-8 text-rose-600" />
                            }
                        ].map((cap, i) => (
                            <div key={i} className="p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all">
                                <div className="mb-4">{cap.icon}</div>
                                <h4 className="text-lg font-bold text-slate-900 mb-2">{cap.title}</h4>
                                <p className="text-slate-600 leading-relaxed text-sm">{cap.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- WHO IT IS FOR (CONDENSED GRID) --- */}
            <section className="py-20 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-6xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-10 text-center">Who BW Nexus AI Is Built For</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[
                            { title: "Governments", desc: "Attract capital & build investor confidence." },
                            { title: "Private Enterprise", desc: "Enter new markets & de-risk expansion." },
                            { title: "Financial Institutions", desc: "Identify investable regions others ignore." },
                            { title: "NGOs & Agencies", desc: "Target resources & design interventions." },
                            { title: "Emerging Regions", desc: "Compete on equal footing globally." },
                            { title: "Local Communities", desc: "Reveal value to the world." }
                        ].map((item, i) => (
                            <div key={i} className="flex items-start gap-4 p-5 bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
                                <div className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 font-bold text-slate-400 text-sm">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="text-base font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-sm text-slate-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS (HORIZONTAL FLOW) --- */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-7xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-16 text-center">How BW Nexus AI Works</h2>
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative">
                        {/* Connector Line (Desktop) */}
                        <div className="hidden md:block absolute top-6 left-0 w-full h-0.5 bg-slate-100 -z-10"></div>
                        
                        {[
                            { step: "01", title: "Establish Perspective", desc: "Identity & goals calibrate the system." },
                            { step: "02", title: "Reveal Opportunity", desc: "AI scans signals others miss." },
                            { step: "03", title: "Explore Alternatives", desc: "Multiple strategic pathways produced." },
                            { step: "04", title: "Build Confidence", desc: "Insights replace uncertainty." },
                            { step: "05", title: "Activate", desc: "Ready-to-use strategic artifacts." }
                        ].map((item, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className="w-12 h-12 rounded-full bg-white border-4 border-slate-100 text-slate-400 group-hover:text-bronze-600 group-hover:border-bronze-600 font-bold flex items-center justify-center mb-4 transition-colors z-10 shadow-sm">
                                    {item.step}
                                </div>
                                <h3 className="font-bold text-slate-900 text-lg mb-1">{item.title}</h3>
                                <p className="text-sm text-slate-500 leading-snug px-2">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PROOF --- */}
            <section className="py-24 px-6 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-10">Proof That This Has Never Been Built Before</h2>
                    
                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        <div>
                            <h3 className="text-lg font-bold text-red-400 mb-4 uppercase tracking-widest">This is not:</h3>
                            <ul className="space-y-2 text-slate-400">
                                <li>a chatbot</li>
                                <li>a dashboard</li>
                                <li>a consulting clone</li>
                                <li>a Bloomberg terminal</li>
                                <li>a static report tool</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-green-400 mb-4 uppercase tracking-widest">This is:</h3>
                            <ul className="space-y-2 text-white">
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first AI system for economic confidence</li>
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first symbiosis modeling engine</li>
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first ethical economics AI</li>
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first regional-first intelligence system</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ARCHITECTURE --- */}
            <section className="py-20 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-2xl font-bold text-slate-900 mb-8">System Architecture: Five Integrated Engines</h2>
                    <div className="flex flex-wrap justify-center gap-3 max-w-3xl mx-auto">
                        {["Economic Intelligence", "Matchmaking & Discovery", "Risk & Ethics", "Cultural Translation", "Strategy & Execution"].map((engine, i) => (
                            <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm font-bold text-slate-700">
                                {engine} Engine
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 text-bronze-600 font-bold text-sm uppercase tracking-widest">
                        Coordinated as one intelligence core.
                    </div>
                </div>
            </section>

            {/* --- FOUNDER --- */}
            <section className="py-24 px-6 bg-slate-50 border-t border-slate-200 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 text-slate-300">
                        <NexusLogo className="w-16 h-16 mx-auto" />
                    </div>
                    <blockquote className="text-xl md:text-2xl font-serif italic text-slate-700 leading-relaxed mb-8">
                        “I built BW Nexus AI after working directly with local leaders who had the will, the talent, and the resources — but no way to prove their value to the world.
                        It doesn’t sell cities. It reveals truth.
                        It doesn’t chase investors. It builds confidence.”
                    </blockquote>
                    <cite className="font-bold text-slate-900 uppercase tracking-widest not-italic text-sm">— Founder, BW Global Advisory</cite>
                </div>
            </section>

            {/* --- ACCESS & PRICING --- */}
            <section className="py-20 px-6 bg-slate-900 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Simple, Transparent Access</h2>
                    <p className="text-lg text-slate-300 mb-12">No contracts. No cold sales. No consulting gatekeepers.</p>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform">
                            <h3 className="text-lg font-bold text-slate-500 uppercase mb-4">Single Pass</h3>
                            <div className="text-5xl font-black mb-2">$15</div>
                            <div className="text-base font-medium mb-8">7-day platform access</div>
                            <button onClick={onEnter} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-bronze-800 transition-colors">
                                Start Now
                            </button>
                        </div>
                        
                        <div className="bg-slate-800 text-white p-8 rounded-3xl border border-slate-700 flex flex-col justify-center">
                            <h3 className="text-lg font-bold text-slate-400 uppercase mb-6">Subscriptions</h3>
                            <ul className="space-y-4 text-lg font-medium">
                                <li className="flex justify-between border-b border-slate-700 pb-2">
                                    <span>3 months</span>
                                    <span>$175</span>
                                </li>
                                <li className="flex justify-between border-b border-slate-700 pb-2">
                                    <span>6 months</span>
                                    <span>$395</span>
                                </li>
                                <li className="flex justify-between">
                                    <span>12 months</span>
                                    <span>$395</span>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};
