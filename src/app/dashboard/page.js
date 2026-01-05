'use client';
import { useState, useEffect } from 'react';
import { 
  MagnifyingGlassIcon, 
  ChevronDownIcon, 
  Cog6ToothIcon as CogIcon, 
  QuestionMarkCircleIcon, 
  UserCircleIcon,
  PauseIcon,
  StopIcon,
  ShareIcon,
  PrinterIcon,
  ListBulletIcon,
  ChartBarIcon,
  DocumentTextIcon,
  ArrowsUpDownIcon,
  FunnelIcon,
  BriefcaseIcon,
  AcademicCapIcon,
  EnvelopeIcon
} from '@heroicons/react/24/solid';

export default function SplunkUnifiedPortfolio() {
  const [data, setData] = useState({ stats: [], audit: [] });
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('search'); // 'search', 'dashboards', or 'resume'
  const [mountedTime, setMountedTime] = useState('');

  const searchQuery = 'index="main" | table _time, action, details, _raw';

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/stats');
      const json = await res.json();
      if (json.stats || json.audit) {
        setData({
          stats: json.stats || [],
          audit: json.audit || []
        });
      }
    } catch (err) {
      console.error("Failed to fetch data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMountedTime(new Date().toLocaleTimeString());
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#f2f4f5] font-sans text-gray-800">
      {/* --- TOP BLACK HEADER --- */}
      <header className="bg-[#1c1e21] h-10 flex items-center justify-between px-4 text-white text-[11px] uppercase tracking-wider">
        <div className="flex items-center space-x-4">
          <span className="font-bold text-xl tracking-tight lowercase flex items-center">
            <span className="text-[#65a637] font-black mr-1">splunk{'>'}</span>enterprise
          </span>
          <button className="flex items-center space-x-1 hover:text-gray-300">
            <span>Apps</span><ChevronDownIcon className="h-3 w-3"/>
          </button>
        </div>
        <div className="flex items-center space-x-6">
          <span className="text-gray-400">DEVLICENSE:AFTABLUE@GMAIL.COM</span>
          <div className="flex items-center space-x-4">
            <button className="hover:text-gray-300">Settings</button>
            <button className="hover:text-gray-300">Activity</button>
            <button className="hover:text-gray-300 flex items-center">Help <QuestionMarkCircleIcon className="h-3 w-3 ml-1"/></button>
            <UserCircleIcon className="h-5 w-5 text-gray-400"/>
          </div>
        </div>
      </header>

      {/* --- SECONDARY NAVIGATION --- */}
      <div className="bg-[#e1e6eb] h-10 flex items-center px-4 border-b border-gray-300 text-xs font-medium text-gray-600">
        <button 
          onClick={() => setView('search')}
          className={`px-4 h-full border-b-2 transition-all ${view === 'search' ? 'border-[#65a637] text-[#65a637]' : 'border-transparent hover:text-gray-800'}`}
        >
          Search
        </button>
        <button 
          onClick={() => setView('dashboards')}
          className={`px-4 h-full border-b-2 transition-all ${view === 'dashboards' ? 'border-[#65a637] text-[#65a637]' : 'border-transparent hover:text-gray-800'}`}
        >
          Dashboards
        </button>
        <button 
          onClick={() => setView('resume')}
          className={`px-4 h-full border-b-2 transition-all ${view === 'resume' ? 'border-[#65a637] text-[#65a637]' : 'border-transparent hover:text-gray-800'}`}
        >
          My Resume
        </button>
        <button className="px-4 h-full border-b-2 border-transparent hover:text-gray-800">Alerts</button>
      </div>

      <div className="p-6">
        {view === 'search' && (
          /* --- SEARCH VIEW --- */
          <div className="animate-fade-in">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-2xl font-light text-gray-800">Search Logs</h1>
              <div className="flex space-x-2">
                <button className="splunk-btn">Save As</button>
                <button className="splunk-btn bg-[#65a637] text-white border-none">Close</button>
              </div>
            </div>
            <div className="flex-grow flex shadow-sm mb-6 h-12">
              <div className="flex-grow bg-white border border-gray-300 rounded-l-sm p-2 font-mono text-[13px] flex items-center">
                {searchQuery}
              </div>
              <button className="bg-[#65a637] px-4 rounded-r-sm hover:bg-[#5a9431]">
                <MagnifyingGlassIcon className="h-6 w-6 text-white" />
              </button>
            </div>
            <div className="bg-white border border-gray-300 p-2 flex justify-between items-center text-xs mb-4">
              <span className="font-bold text-[#65a637] italic">✓ {data.audit.length} events</span>
              <span className="text-gray-500 font-mono">(before {mountedTime || '--:--:--'})</span>
            </div>
            <div className="bg-white border border-gray-300 rounded-sm shadow-sm overflow-hidden overflow-x-auto">
              <table className="w-full text-left text-[11px] font-mono border-collapse">
                <thead className="bg-[#f5f7f8] border-b border-gray-300 text-gray-700 font-bold">
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
                      <td className="p-2 border-r border-gray-200">{event.action}</td>
                      <td className="p-2 border-r border-gray-200">{event.details}</td>
                      <td className="p-2 text-gray-500 break-all">{JSON.stringify(event)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {view === 'dashboards' && (
          /* --- DASHBOARDS VIEW --- */
          <div className="animate-fade-in">
            <h1 className="text-2xl font-light text-gray-800 mb-6">Portfolio Interaction Dashboard</h1>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white border border-gray-300 p-6 rounded-sm shadow-sm">
                <h3 className="text-gray-800 font-bold text-sm mb-6 border-b pb-2">Interaction Volume by Detail</h3>
                <div className="space-y-4">
                  {data.stats.map((stat, i) => (
                    <div key={i}>
                      <div className="flex justify-between text-xs mb-1 font-bold">
                        <span className="text-gray-600 uppercase">{stat.name}</span>
                        <span className="text-[#65a637]">{stat.value}</span>
                      </div>
                      <div className="h-5 bg-gray-100 rounded-sm overflow-hidden border">
                        <div 
                          className="h-full bg-[#65a637] transition-all duration-1000" 
                          style={{ width: `${(stat.value / Math.max(...data.stats.map(s => s.value || 1))) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {view === 'resume' && (
          /* --- RESUME VIEW: Shaik Aftab Ahmed --- */
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="bg-white border border-gray-300 p-8 rounded-sm shadow-md">
              <div className="flex justify-between items-start border-b-4 border-[#65a637] pb-6 mb-8">
                <div>
                  <h1 className="text-4xl font-bold text-gray-800">Shaik Aftab Ahmed</h1>
                  <p className="text-lg text-[#65a637] font-semibold mt-1">Assistant System Engineer @ iOPEX Technologies</p>
                </div>
                <div className="text-right text-sm text-gray-500">
                  <p className="flex items-center justify-end"><EnvelopeIcon className="h-4 w-4 mr-2"/> aftablue@gmail.com</p>
                  <p className="mt-1 underline">Bengaluru, Karnataka, India</p>
                </div>
              </div>

              <section className="mb-8">
                <h2 className="flex items-center text-xl font-bold text-gray-700 mb-4 border-b pb-1">
                  <BriefcaseIcon className="h-5 w-5 mr-2 text-[#65a637]"/> Experience
                </h2>
                <div className="mb-6">
                  <div className="flex justify-between font-bold">
                    <span>iOPEX Technologies</span>
                    <span className="text-gray-500">Sept 2024 – Present</span>
                  </div>
                  <p className="italic text-gray-600">Assistant System Engineer</p>
                  <ul className="list-disc ml-5 mt-2 text-gray-700 text-sm space-y-1">
                    <li>1.3 years of experience specializing in Splunk products.</li>
                    <li>Utilizing Splunk HEC and Management APIs for real-time observability.</li>
                  </ul>
                </div>
              </section>

              <section className="mb-8">
                <h2 className="flex items-center text-xl font-bold text-gray-700 mb-4 border-b pb-1">
                  <CogIcon className="h-5 w-5 mr-2 text-[#65a637]"/> Skills & Expertise
                </h2>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="bg-gray-50 p-3 rounded border">
                    <span className="font-bold text-[#65a637]">Splunk:</span> HEC, Management API, SPL, Dashboarding
                  </div>
                  <div className="bg-gray-50 p-3 rounded border">
                    <span className="font-bold text-[#65a637]">Web Development:</span> Next.js, JavaScript, Firebase
                  </div>
                </div>
              </section>

              <section>
                <h2 className="flex items-center text-xl font-bold text-gray-700 mb-4 border-b pb-1">
                  <AcademicCapIcon className="h-5 w-5 mr-2 text-[#65a637]"/> Key Projects
                </h2>
                <div className="text-sm space-y-3">
                  <div>
                    <span className="font-bold">Zauk Interiors Website:</span> Full-scale Next.js development for interior design firm.
                  </div>
                  <div>
                    <span className="font-bold">Multi-tenant PG Website:</span> Next.js and Firebase integration for property management.
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .splunk-btn {
          @apply px-4 py-1.5 border border-gray-300 bg-white text-gray-700 text-sm font-medium rounded-sm hover:bg-gray-50 transition-all shadow-sm;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}