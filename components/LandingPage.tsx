
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
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100 selection:text-blue-900">
            
            {/* --- HEADER --- */}
            <header className="fixed top-0 left-0 w-full p-6 z-50 bg-white/90 backdrop-blur-md border-b border-slate-100">
                <div className="max-w-7xl mx-auto flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-slate-900 rounded-lg">
                            <NexusLogo className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg font-bold tracking-wider uppercase text-slate-900">BW Nexus AI</span>
                    </div>
                    <button onClick={onEnter} className="text-sm font-bold uppercase tracking-widest text-slate-600 hover:text-blue-600 transition-colors">
                        Log In
                    </button>
                </div>
            </header>

            {/* --- HERO SECTION --- */}
            <section className="pt-40 pb-24 px-6">
                <div className="max-w-6xl mx-auto text-center">
                    <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-8">
                        Your Region’s Value, <br/>
                        <span className="text-blue-700">Understood Globally.</span>
                    </h1>
                    
                    <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed max-w-4xl mx-auto mb-12">
                        The world’s first intelligence system designed to uncover what everyone else overlooks.
                    </p>

                    <div className="max-w-3xl mx-auto space-y-6 text-lg text-slate-500 leading-relaxed">
                        <p>
                            For decades, regional cities, emerging markets, and overlooked economies have powered national prosperity —
                            yet their true potential has remained invisible to global investors.
                        </p>
                        <p>
                            Not because the opportunities were small.
                            But because no one ever built a system capable of seeing them.
                        </p>
                        <p className="text-slate-900 font-bold text-xl">
                            BW Nexus AI changes that.
                        </p>
                    </div>

                    <div className="mt-12">
                        <button 
                            onClick={onEnter}
                            className="px-10 py-5 bg-slate-900 text-white rounded-xl font-bold text-lg tracking-widest uppercase hover:bg-blue-800 transition-all shadow-xl"
                        >
                            Access Platform
                        </button>
                    </div>
                </div>
            </section>

            <section className="py-20 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xl md:text-2xl font-medium text-slate-800 leading-relaxed">
                        It is the first platform in the world designed to reveal the hidden value inside every region —
                        no matter how small, remote, emerging, or underestimated.
                    </p>
                    <div className="mt-8 grid md:grid-cols-3 gap-8 text-left md:text-center">
                        <div>
                            <div className="text-blue-600 font-bold mb-2">Translates</div>
                            <p className="text-slate-600">Regional value into global language.</p>
                        </div>
                        <div>
                            <div className="text-blue-600 font-bold mb-2">Turns</div>
                            <p className="text-slate-600">Potential into confidence.</p>
                        </div>
                        <div>
                            <div className="text-blue-600 font-bold mb-2">Transforms</div>
                            <p className="text-slate-600">Overlooked places into investable opportunities.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE PROBLEM --- */}
            <section className="py-32 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">The Problem: The 100-Year Confidence Gap</h2>
                        <p className="text-xl text-slate-600 max-w-3xl">
                            For over a century, global opportunity has been blocked by the same three invisible barriers:
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-10 mb-20">
                        {[
                            {
                                id: "01",
                                title: "Intelligence Was Expensive",
                                desc: "Only billion-dollar corporations and elite consulting firms could afford deep research teams. Everyone else was left guessing."
                            },
                            {
                                id: "02",
                                title: "The Unknown Felt Risky",
                                desc: "Regions outside “famous markets” were dismissed — not because they lacked opportunity, but because investors lacked reliable, structured, transparent intelligence."
                            },
                            {
                                id: "03",
                                title: "No Shared Strategic Language",
                                desc: "Local leaders and global decision-makers spoke different frameworks. This misalignment killed opportunities before they ever began."
                            }
                        ].map((item) => (
                            <div key={item.id} className="p-8 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-4xl font-black text-slate-200 mb-4">{item.id}</div>
                                <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                <p className="text-slate-600 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="bg-slate-100 rounded-3xl p-10 md:p-16">
                        <h3 className="text-2xl font-bold text-slate-900 mb-6">These forces created a global bottleneck:</h3>
                        <ul className="space-y-4 text-lg text-slate-700">
                            <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> Capital funnels into the same cities</li>
                            <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> Regional economies remain underestimated</li>
                            <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> Innovation is geographically trapped</li>
                            <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> Entire communities are ignored by global growth</li>
                            <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> Good ideas die because the world cannot “see” them</li>
                        </ul>
                        <div className="mt-10 pt-10 border-t border-slate-200">
                            <p className="text-2xl font-bold text-blue-700">BW Nexus AI exists to eliminate this confidence gap permanently.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CONSULTING TRUTH --- */}
            <section className="py-32 px-6 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-20 items-center">
                    <div>
                        <h2 className="text-4xl md:text-5xl font-black mb-8">The Truth About Today’s Consulting System</h2>
                        <p className="text-xl text-slate-300 mb-8 leading-relaxed">
                            Global consulting firms are now investing millions in AI — but they are not changing their model.
                        </p>
                        <p className="text-2xl font-bold text-white mb-8">
                            They are simply strapping a rocket engine to a horse cart.
                        </p>
                    </div>
                    <div className="bg-white/5 p-10 rounded-3xl border border-white/10">
                        <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-widest">The Legacy Model (Designed in the 1970s)</h3>
                        <ul className="space-y-3 text-slate-300">
                            <li className="flex gap-3"><span className="text-red-400">✕</span> Slow manual research</li>
                            <li className="flex gap-3"><span className="text-red-400">✕</span> Expensive human teams</li>
                            <li className="flex gap-3"><span className="text-red-400">✕</span> Narrow market focus</li>
                            <li className="flex gap-3"><span className="text-red-400">✕</span> High client barriers</li>
                            <li className="flex gap-3"><span className="text-red-400">✕</span> Late in the decision cycle</li>
                            <li className="flex gap-3"><span className="text-red-400">✕</span> No regional scalability</li>
                            <li className="flex gap-3"><span className="text-red-400">✕</span> Built for multinationals — not for emerging regions</li>
                            <li className="flex gap-3"><span className="text-red-400">✕</span> Not designed for early-stage confidence building</li>
                        </ul>
                        <div className="mt-8 pt-8 border-t border-white/10">
                            <p className="text-lg italic text-slate-400">
                                They are hired after confidence already exists.
                                But the place where most progress dies… is the place where confidence has not yet been built.
                            </p>
                            <p className="mt-4 text-xl font-bold text-white">That is where BW Nexus AI begins.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- THE SOLUTION --- */}
            <section className="py-32 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-20">
                        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-8">The Solution: What BW Nexus AI Actually Is</h2>
                        <p className="text-xl text-slate-600 max-w-4xl mx-auto leading-relaxed">
                            BW Nexus AI is the world’s first <span className="font-bold text-slate-900">Strategic Symbiosis System</span>.
                            An intelligence engine built to reveal hidden relationships between regions, industries, supply chains, governments, policy environments, investment capital, development actors, and innovation clusters.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-16 items-center mb-24">
                        <div>
                            <h3 className="text-3xl font-bold text-slate-900 mb-6">It doesn’t just analyze data.</h3>
                            <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                                It understands relationships, alignments, alternatives, risk, confidence, pathways, and real-world execution logic.
                            </p>
                            <p className="text-xl font-bold text-blue-700">
                                Where traditional systems see a bee and a flower, BW Nexus AI sees the entire ecosystem, the pollination network, and the future meadow.
                            </p>
                        </div>
                        <div className="bg-blue-50 p-10 rounded-3xl border border-blue-100">
                            <Layers className="w-20 h-20 text-blue-600 mb-6" />
                            <h4 className="text-2xl font-bold text-slate-900 mb-4">BW Nexus AI Includes Entirely New Classes of Capability</h4>
                        </div>
                    </div>

                    {/* Capabilities Grid */}
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Global Matchmaking Engine",
                                desc: "Discovers and ranks governments, companies, institutions, suppliers, and partners you didn’t even know existed based on strategic fit, velocity, and risk.",
                                icon: <GlobeIcon className="w-8 h-8 text-blue-600" />
                            },
                            {
                                title: "Regional Economic DNA Scanner",
                                desc: "Uses LQ analysis, cluster detection, input–output modeling, trade flows, infrastructure signals, and capital movement to uncover the true identity of an economy.",
                                icon: <ActivityIcon className="w-8 h-8 text-indigo-600" />
                            },
                            {
                                title: "Predictive Symbiosis Engine",
                                desc: "Simulates how projects will ripple across employment, logistics, exports, supply chains, policy, and regional competitiveness before you make the first move.",
                                icon: <Zap className="w-8 h-8 text-amber-600" />
                            },
                            {
                                title: "AI Strategist Co-Pilot",
                                desc: "Not a chatbot. A thinking engine that challenges assumptions, teaches strategy, re-structures weak plans, highlights hidden opportunity, and reduces risk before money moves.",
                                icon: <BrainCircuit className="w-8 h-8 text-emerald-600" />
                            },
                            {
                                title: "Deal-Maker’s Academy",
                                desc: "Models negotiation styles, business culture, regulatory behavior, power dynamics, trust gaps, and communication norms for every country-pairing on Earth.",
                                icon: <Users className="w-8 h-8 text-purple-600" />
                            },
                            {
                                title: "The Partnership Toolkit (Instantly Produced)",
                                desc: "Every mission generates world-class intelligence reports, readiness analysis, investment profiles, partner shortlists, risk diagnostics, cross-cultural playbooks, and outreach letters. Instantly.",
                                icon: <ManualIcon className="w-8 h-8 text-rose-600" />
                            }
                        ].map((cap, i) => (
                            <div key={i} className="p-8 bg-slate-50 rounded-2xl border border-slate-100 hover:border-slate-300 hover:shadow-lg transition-all">
                                <div className="mb-6">{cap.icon}</div>
                                <h4 className="text-xl font-bold text-slate-900 mb-3">{cap.title}</h4>
                                <p className="text-slate-600 leading-relaxed text-sm">{cap.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- WHO IT IS FOR --- */}
            <section className="py-24 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-slate-900 mb-12 text-center">Who BW Nexus AI Is Built For</h2>
                    <div className="grid gap-6">
                        {[
                            { title: "Governments", desc: "To attract global capital, build investor confidence, and modernize economic strategy." },
                            { title: "Private Enterprise", desc: "To enter unfamiliar markets, find hidden partners, and de-risk expansion." },
                            { title: "Financial Institutions", desc: "To identify investable regions others ignore — backed by structured intelligence." },
                            { title: "NGOs, Development Agencies & Multilaterals", desc: "To measure impact, target resources, and design effective intervention strategies." },
                            { title: "Emerging Regions & Local Communities", desc: "To finally compete on equal footing with the world’s largest cities." }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-6 p-6 bg-white rounded-xl border border-slate-200 shadow-sm">
                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 font-bold text-slate-400">
                                    {i + 1}
                                </div>
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">{item.title}</h3>
                                    <p className="text-slate-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- HOW IT WORKS --- */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-slate-900 mb-16 text-center">How BW Nexus AI Works — In Plain Terms</h2>
                    <div className="space-y-12 relative before:absolute before:inset-0 before:ml-6 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-slate-200 before:to-transparent">
                        {[
                            { step: "01", title: "Establish Perspective", desc: "Your identity, goals, constraints, and operating environment calibrate the system." },
                            { step: "02", title: "Reveal What Others Miss", desc: "The AI scans economic signals others never capture." },
                            { step: "03", title: "Explore Alternatives", desc: "Nexus produces multiple strategic pathways — not just one suggestion." },
                            { step: "04", title: "Build Confidence", desc: "Insights replace uncertainty. Clarity replaces hesitation." },
                            { step: "05", title: "Activate", desc: "You receive reports, letters, partner maps, and opportunity models ready for immediate action." }
                        ].map((item, i) => (
                            <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                                <div className="flex items-center justify-center w-12 h-12 rounded-full border-4 border-white bg-slate-100 text-slate-500 group-hover:bg-blue-600 group-hover:text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 font-bold z-10 transition-colors">
                                    {item.step}
                                </div>
                                <div className="w-[calc(100%-4rem)] md:w-[calc(50%-3rem)] p-6 bg-slate-50 rounded-2xl border border-slate-100 shadow-sm">
                                    <h3 className="font-bold text-slate-900 text-lg mb-2">{item.title}</h3>
                                    <p className="text-slate-600">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- PROOF --- */}
            <section className="py-24 px-6 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-black mb-12">Proof That This Has Never Been Built Before</h2>
                    
                    <div className="grid md:grid-cols-2 gap-12 text-left">
                        <div>
                            <h3 className="text-xl font-bold text-red-400 mb-6 uppercase tracking-widest">This is not:</h3>
                            <ul className="space-y-3 text-lg text-slate-400">
                                <li>a chatbot</li>
                                <li>a dashboard</li>
                                <li>a consulting clone</li>
                                <li>a Bloomberg terminal</li>
                                <li>a static report tool</li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="text-xl font-bold text-green-400 mb-6 uppercase tracking-widest">This is:</h3>
                            <ul className="space-y-3 text-lg text-white">
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first AI system for economic confidence</li>
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first symbiosis modeling engine</li>
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first matchmaking intelligence platform</li>
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first ethical economics AI</li>
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first regional-first intelligence system</li>
                                <li className="flex gap-2"><CheckCircle className="w-6 h-6 text-green-500"/> the first system to operationalize trust</li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- ARCHITECTURE --- */}
            <section className="py-24 px-6 bg-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl font-bold text-slate-900 mb-12">System Architecture: Five Integrated Engines Working As One</h2>
                    <div className="grid gap-4 max-w-2xl mx-auto">
                        {["Economic Intelligence Engine", "Matchmaking & Partner Discovery Engine", "Risk & Ethics Engine", "Cultural & Policy Translation Engine", "Strategy & Execution Engine"].map((engine, i) => (
                            <div key={i} className="p-4 bg-slate-50 border border-slate-200 rounded-lg font-bold text-slate-700">
                                {engine}
                            </div>
                        ))}
                        <div className="mt-4 p-4 bg-blue-50 border border-blue-100 rounded-lg font-bold text-blue-800">
                            All coordinated as one intelligence core.
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOUNDER --- */}
            <section className="py-32 px-6 bg-slate-50 border-t border-slate-200 text-center">
                <div className="max-w-3xl mx-auto">
                    <div className="mb-8 text-slate-300">
                        <NexusLogo className="w-16 h-16 mx-auto" />
                    </div>
                    <blockquote className="text-2xl md:text-3xl font-serif italic text-slate-700 leading-relaxed mb-10">
                        “I built BW Nexus AI after working directly with local leaders who had the will, the talent, and the resources — but no way to prove their value to the world.
                        <br/><br/>
                        This platform is the system I wish they had.
                        <br/><br/>
                        It doesn’t sell cities. It reveals truth.
                        It doesn’t chase investors. It builds confidence.
                        <br/><br/>
                        And when confidence exists — capital always follows.”
                    </blockquote>
                    <cite className="font-bold text-slate-900 uppercase tracking-widest not-italic">— Founder, BW Global Advisory</cite>
                </div>
            </section>

            {/* --- ACCESS & PRICING --- */}
            <section className="py-20 px-6 bg-slate-900 text-white text-center">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Simple, Transparent Access</h2>
                    <p className="text-lg text-slate-300 mb-12">Full access to BW Nexus AI. No contracts. No cold sales. No consulting gatekeepers.</p>
                    
                    <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                        <div className="bg-white text-slate-900 p-8 rounded-3xl shadow-2xl transform hover:scale-105 transition-transform">
                            <h3 className="text-xl font-bold text-slate-500 uppercase mb-4">Single Pass</h3>
                            <div className="text-6xl font-black mb-2">$15</div>
                            <div className="text-lg font-medium mb-8">7-day platform access</div>
                            <button onClick={onEnter} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-blue-800 transition-colors">
                                Start Now
                            </button>
                        </div>
                        
                        <div className="bg-slate-800 text-white p-8 rounded-3xl border border-slate-700 flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-slate-400 uppercase mb-6">Subscriptions</h3>
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
