'use client';
import { useState, useEffect } from 'react';
// Import the separate Splash Screen component
import SplashScreen from '../components/SplashScreen'; 
import { 
  MagnifyingGlassIcon, ChevronDownIcon, Cog6ToothIcon as CogIcon, 
  QuestionMarkCircleIcon, UserCircleIcon, ListBulletIcon, 
  ChartBarIcon, DocumentTextIcon, BriefcaseIcon, 
  AcademicCapIcon, EnvelopeIcon, PhoneIcon, MapPinIcon,
  GlobeAltIcon, CodeBracketIcon, TrophyIcon, InformationCircleIcon
} from '@heroicons/react/24/solid';

export default function SplunkPortfolioHome() {
  const [data, setData] = useState({ stats: [], audit: [] });
  const [view, setView] = useState('search'); 
  const [mountedTime, setMountedTime] = useState('');
  
  // NEW STATES FOR FLOW
  const [showSplash, setShowSplash] = useState(true);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  // The core logging function for hover events
  const logHover = async (action, details) => {
    try {
      await fetch('/api/log', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, details }),
      });
      fetchStats(); // Update dashboard counts immediately
    } catch (err) {
      console.error("Splunk HEC Log Failed:", err);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.stats || json.audit) {
        setData({ stats: json.stats || [], audit: json.audit || [] });
      }
    } catch (err) {
      console.error("Management API Fetch Error:", err);
    }
  };

  useEffect(() => {
    setMountedTime(new Date().toLocaleTimeString());
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f4f5] font-sans text-gray-800 relative">

      {/* --- 1. SPLASH SCREEN --- */}
      {showSplash && (
        <SplashScreen onComplete={() => {
          setShowSplash(false);
          setShowDisclaimer(true);
        }} />
      )}

      {/* --- 2. MISSION BRIEFING / DISCLAIMER --- */}
      {!showSplash && showDisclaimer && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="bg-white border-t-8 border-[#65a637] w-full max-w-2xl p-8 shadow-2xl rounded-sm transform transition-all animate-slide-up">
            <div className="flex items-center space-x-3 mb-6">
              <InformationCircleIcon className="h-8 w-8 text-[#65a637]" />
              <h2 className="text-2xl font-black tracking-tighter uppercase italic">User Guide: Aftab_Observability_Platform</h2>
            </div>
            
            <div className="space-y-4 text-sm leading-relaxed text-gray-700">
              <p className="font-bold border-b pb-2 text-gray-900 uppercase">Initialization Successful. Welcome to the live SOC environment.</p>
              
              <div className="bg-gray-50 p-4 border-l-4 border-gray-300 font-mono text-[11px]">
                <p className="text-[#65a637] mb-2 font-bold uppercase tracking-widest">// Instructions for Recruiters:</p>
                <ol className="list-decimal ml-4 space-y-2">
                  <li>Navigate to the <span className="text-[#65a637] font-bold italic">"My Resume"</span> tab.</li>
                  <li><span className="font-bold underline decoration-[#65a637]">Hover your mouse</span> over my experience, skills, or projects.</li>
                  <li>Immediately check the <span className="text-[#65a637] font-bold">"Search"</span> tab to see your interaction indexed as a real-time JSON log.</li>
                  <li>Visit <span className="text-[#65a637] font-bold">"Dashboards"</span> to see a visualization of your interest heatmap.</li>
                </ol>
              </div>

              <p className="italic text-gray-500 text-[10px] uppercase">This portfolio treats your visit as raw telemetry. Every hover is a data point.</p>
            </div>

            <button 
              onClick={() => {
                setShowDisclaimer(false);
                logHover('guide_read', 'Disclaimer_Closed');
              }}
              className="mt-8 w-full bg-[#1c1e21] hover:bg-[#65a637] text-white font-bold py-4 uppercase tracking-[0.3em] transition-all rounded-sm shadow-lg border-none"
            >
              Enter Dashboard
            </button>
          </div>
        </div>
      )}

      {/* --- 3. TOP BLACK SPLUNK HEADER --- */}
      <header className="bg-[#1c1e21] h-10 flex items-center justify-between px-4 text-white text-[11px] uppercase tracking-wider">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-xl tracking-tight lowercase flex items-center">
            <span className="text-[#65a637] font-black mr-1">splunk{'>'}</span>enterprise
          </span>
          <button className="flex items-center space-x-1 hover:text-gray-300">Apps <ChevronDownIcon className="h-3 w-3"/></button>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-gray-400">DEVLICENSE:AFTABLUE@GMAIL.COM</span>
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-300">Settings</button>
            <button className="hover:text-gray-300 flex items-center">Help <QuestionMarkCircleIcon className="h-3 w-3 ml-1"/></button>
            <UserCircleIcon className="h-5 w-5 text-gray-400"/>
          </div>
        </div>
      </header>

      {/* --- SECONDARY SPLUNK NAVIGATION --- */}
      <div className="bg-[#e1e6eb] h-10 flex items-center px-4 border-b border-gray-300 text-xs font-medium text-gray-600">
        <button onClick={() => setView('search')} className={`px-4 h-full border-b-2 transition-all ${view === 'search' ? 'border-[#65a637] text-[#65a637]' : 'border-transparent hover:text-gray-800'}`}>Search</button>
        <button onClick={() => setView('dashboards')} className={`px-4 h-full border-b-2 transition-all ${view === 'dashboards' ? 'border-[#65a637] text-[#65a637]' : 'border-transparent hover:text-gray-800'}`}>Dashboards</button>
        <button onClick={() => setView('resume')} className={`px-4 h-full border-b-2 transition-all ${view === 'resume' ? 'border-[#65a637] text-[#65a637]' : 'border-transparent hover:text-gray-800'}`}>My Resume</button>
      </div>

      <div className="p-6">
        {view === 'search' && (
          /* --- SEARCH VIEW --- */
          <div className="animate-fade-in">
            <h1 className="text-2xl font-light text-gray-800 mb-4">New Search</h1>
            <div className="flex mb-6 h-12 shadow-sm">
              <div className="flex-grow bg-white border border-gray-300 rounded-l-sm p-2 font-mono text-[13px] flex items-center">index="main" | table _time, action, details, _raw</div>
              <button className="bg-[#65a637] px-4 rounded-r-sm hover:bg-[#5a9431]"><MagnifyingGlassIcon className="h-6 w-6 text-white" /></button>
            </div>
            <div className="bg-white border border-gray-300 p-2 flex justify-between items-center text-xs mb-4 font-mono">
              <span className="font-bold text-[#65a637] italic">✓ {data.audit.length} events found</span>
              <span className="text-gray-500 italic">Sync Time: {mountedTime}</span>
            </div>
            <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-x-auto">
              <table className="w-full text-left text-[10px] font-mono border-collapse">
                <thead className="bg-[#f5f7f8] border-b border-gray-300 text-gray-700 font-bold uppercase">
                  <tr>
                    <th className="p-2 border-r border-gray-300">_time</th>
                    <th className="p-2 border-r border-gray-300">action</th>
                    <th className="p-2 border-r border-gray-300">details</th>
                    <th className="p-2">_raw</th>
                  </tr>
                </thead>
                <tbody>
                  {data.audit.map((event, i) => (
                    <tr key={i} className="border-b border-gray-200 hover:bg-[#f2f4f5]">
                      <td className="p-2 border-r border-gray-200 text-[#006ce6]">{event._time}</td>
                      <td className="p-2 border-r border-gray-200 uppercase">{event.action}</td>
                      <td className="p-2 border-r border-gray-200 font-bold">{event.details}</td>
                      <td className="p-2 text-gray-400 break-all">{JSON.stringify(event)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'resume' && (
          /* --- INSTRUMENTED RESUME VIEW --- */
          <div className="animate-fade-in max-w-5xl mx-auto">
            <div className="bg-white border border-gray-300 p-12 shadow-2xl rounded-sm">
              {/* RESUME HEADER */}
              <header className="border-b-4 border-[#65a637] pb-8 mb-8 flex justify-between items-end">
                <div>
                  <h1 
                    onMouseEnter={() => logHover('hover', 'Header_Name')}
                    className="text-5xl font-black text-gray-900 tracking-tighter uppercase cursor-default"
                  >
                    SHAIK AFTAB AHMED
                  </h1>
                  <div className="flex gap-4 mt-2">
                    <a 
                      href="https://github.com/aftabyo" 
                      target="_blank" 
                      onMouseEnter={() => logHover('hover', 'Header_GitHub')}
                      className="text-sm font-bold text-[#65a637] hover:underline"
                    >
                      github.com/aftabyo
                    </a>
                  </div>
                </div>
                <div className="text-right text-sm font-medium space-y-1">
                  <p onMouseEnter={() => logHover('hover', 'Header_Email')} className="flex items-center justify-end">aftablue@gmail.com <EnvelopeIcon className="h-4 w-4 ml-2 text-gray-400"/></p>
                  <p onMouseEnter={() => logHover('hover', 'Header_Phone')} className="flex items-center justify-end font-bold">+91 8050415152 <PhoneIcon className="h-4 w-4 ml-2 text-gray-400"/></p>
                  <p onMouseEnter={() => logHover('hover', 'Header_Location')} className="flex items-center justify-end">Bengaluru, KA <MapPinIcon className="h-4 w-4 ml-2 text-gray-400"/></p>
                </div>
              </header>

              {/* EXPERIENCE */}
              <section className="mb-10">
                <h2 className="flex items-center text-lg font-black text-gray-800 mb-6 border-b pb-1 uppercase tracking-tighter">
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-[#65a637]"/> Work Experience
                </h2>
                <div className="space-y-6">
                  <div className="p-5 border-l-4 border-transparent hover:border-[#65a637] hover:bg-gray-50 transition-all">
                    <div className="flex justify-between font-bold text-gray-900 mb-1">
                      <span className="text-lg" onMouseEnter={() => logHover('hover', 'Experience_iOPEX_Title')}>iOPEX Technologies | Assistant System Engineer</span>
                      <span onMouseEnter={() => logHover('hover', 'Experience_iOPEX_Date')}>Sept 2024 – Present</span>
                    </div>
                    <ul className="list-disc ml-5 mt-3 text-gray-700 space-y-2 text-sm">
                      <li onMouseEnter={() => logHover('hover', 'iOPEX_Bullet_SPL_Optimization')}>Resolved a wide range of complex customer-facing issues, specializing in troubleshooting and optimizing **Splunk Search Processing Language (SPL)** queries.</li>
                      <li onMouseEnter={() => logHover('hover', 'iOPEX_Bullet_Cloud_Support')}>Provided frontline technical support for **Splunk Cloud** environments, addressing critical platform and data ingestion issues.</li>
                      <li onMouseEnter={() => logHover('hover', 'iOPEX_Bullet_Onboarding')}>Troubleshot and resolved technical problems related to data onboarding, including configuring and managing **Universal Forwarders**.</li>
                      <li onMouseEnter={() => logHover('hover', 'iOPEX_Bullet_Case_Closure')}>Consistently maintained a **100% case closure rate** for all assigned monthly support tickets.</li>
                      <li onMouseEnter={() => logHover('hover', 'iOPEX_Bullet_CSAT')}>Achieved high customer satisfaction (CSAT) scores from a global clientele, receiving multiple commendations for technical support.</li>
                      <li onMouseEnter={() => logHover('hover', 'iOPEX_Bullet_Bug_Doc')}>Identified and documented major product bugs; escalated issues via **Jira and CINC** tickets.</li>
                    </ul>
                  </div>
                </div>
              </section>

              {/* SKILLS */}
              <section className="mb-10">
                <h2 className="flex items-center text-lg font-black text-gray-800 mb-6 border-b pb-1 uppercase tracking-tighter">
                  <CogIcon className="h-5 w-5 mr-2 text-[#65a637]"/> Skills (Granular Observability)
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Splunk Platform</p>
                    <div className="flex flex-wrap gap-2">
                      {['Splunk Enterprise', 'Splunk Cloud', 'SPL', 'Data Onboarding', 'Universal Forwarder', 'Troubleshooting'].map((s) => (
                        <span key={s} onMouseEnter={() => logHover('skill_hover', s)} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold hover:bg-[#65a637] hover:text-white transition-all cursor-crosshair uppercase">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-3">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Networking & Languages</p>
                    <div className="flex flex-wrap gap-2">
                      {['Palo Alto Networks', 'TCP/IP', 'DNS', 'Firewall Basics', 'Python', 'C/C++', 'Jira'].map((s) => (
                        <span key={s} onMouseEnter={() => logHover('skill_hover', s)} className="px-3 py-1 bg-gray-50 border border-gray-200 rounded text-xs font-bold hover:bg-[#65a637] hover:text-white transition-all cursor-crosshair uppercase">{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </section>

              {/* EDUCATION */}
              <section className="mb-10">
                <h2 className="flex items-center text-lg font-black text-gray-800 mb-6 border-b pb-1 uppercase tracking-tighter">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-[#65a637]"/> Education
                </h2>
                <div className="space-y-6 text-sm">
                  <div onMouseEnter={() => logHover('hover', 'Education_VTU')} className="hover:bg-gray-50 p-4 rounded transition-colors">
                    <div className="flex justify-between font-bold">
                      <span>Visvesvaraya Technological University</span>
                      <span>2020 – 2024</span>
                    </div>
                    <p className="text-gray-600">Information Science and Engineering | <span className="text-[#65a637] font-bold">CGPA: 8/10</span></p>
                  </div>
                  <div onMouseEnter={() => logHover('hover', 'Education_KV_12')} className="hover:bg-gray-50 p-4 rounded transition-colors">
                    <div className="flex justify-between font-bold">
                      <span>Kendriya Vidyalaya No 2 (Class 12th CBSE)</span>
                      <span>2019 – 2020</span>
                    </div>
                    <p className="text-gray-600">PCM with Computer Science | <span className="text-[#65a637] font-bold">CGPA: 8.4/10</span></p>
                  </div>
                  <div onMouseEnter={() => logHover('hover', 'Education_KV_10')} className="hover:bg-gray-50 p-4 rounded transition-colors">
                    <div className="flex justify-between font-bold">
                      <span>Kendriya Vidyalaya No 2 (Class 10th CBSE)</span>
                      <span>2017 – 2018</span>
                    </div>
                    <p className="text-gray-600">CGPA: <span className="text-[#65a637] font-bold">8/10</span></p>
                  </div>
                </div>
              </section>

              {/* CERTIFICATIONS & PROJECTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <section>
                  <h2 className="flex items-center text-lg font-black text-gray-800 mb-4 border-b pb-1 uppercase tracking-tighter">
                    <TrophyIcon className="h-5 w-5 mr-2 text-[#65a637]"/> Certifications
                  </h2>
                  <div 
                    onMouseEnter={() => logHover('hover', 'Cert_Splunk_Core_User')} 
                    className="bg-gray-50 p-5 border rounded hover:border-[#65a637] transition-all cursor-default"
                  >
                    <p className="font-bold text-gray-900 italic">Splunk Certified Core User</p>
                    <p className="text-xs text-[#65a637] font-bold mt-1 uppercase tracking-widest">Issued: March 11, 2025</p>
                  </div>
                </section>
                <section>
                  <h2 className="flex items-center text-lg font-black text-gray-800 mb-4 border-b pb-1 uppercase tracking-tighter">
                    <CodeBracketIcon className="h-5 w-5 mr-2 text-[#65a637]"/> Key Projects
                  </h2>
                  <div 
                    onMouseEnter={() => logHover('hover', 'Project_CareerKosh')} 
                    className="bg-gray-50 p-5 border rounded hover:border-[#65a637] transition-all cursor-default"
                  >
                    <p className="font-bold text-gray-900 uppercase tracking-tighter">CareerKosh</p>
                    <p className="text-xs text-gray-600 mt-1 italic">A Job Hunting Platform</p>
                  </div>
                </section>
              </div>
            </div>
          </div>
        )}

        {view === 'dashboards' && (
          /* --- HEATMAP ANALYTICS --- */
          <div className="animate-fade-in max-w-4xl">
            <h1 className="text-2xl font-light text-gray-800 mb-6 italic underline decoration-[#65a637] decoration-2">Recruiter Interaction Heatmap</h1>
            <div className="bg-white border border-gray-300 p-8 rounded-sm shadow-sm">
              <h3 className="text-gray-500 text-[10px] font-bold uppercase mb-8 tracking-[0.2em] border-b pb-2">Top Interest Areas</h3>
              <div className="space-y-6">
                {data.stats.length > 0 ? data.stats.map((stat, i) => (
                  <div key={i}>
                    <div className="flex justify-between text-xs mb-1 font-bold">
                      <span className="text-gray-400 uppercase tracking-tighter italic">{stat.name}</span>
                      <span className="text-[#65a637] font-mono">{stat.value}</span>
                    </div>
                    <div className="h-4 bg-gray-50 rounded-sm overflow-hidden border border-gray-200">
                      <div className="h-full bg-[#65a637] transition-all duration-1000 shadow-[inset_0_0_10px_rgba(0,0,0,0.1)]" style={{ width: `${(stat.value / Math.max(...data.stats.map(s => s.value || 1))) * 100}%` }}></div>
                    </div>
                  </div>
                )) : <p className="text-xs text-gray-400 italic">No interaction logs found. Navigate to "My Resume" and hover over items to see them here.</p>}
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in { animation: fadeIn 0.4s ease-out; }
        .animate-slide-up { animation: slideUp 0.5s cubic-bezier(0.16, 1, 0.3, 1); }
      `}</style>
    </div>
  );
}