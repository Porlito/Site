import React, { useState, useEffect } from "react";
import { 
  BuildingOfficeIcon, 
  UserPlusIcon, 
  KeyIcon, 
  BriefcaseIcon, 
  ShieldCheckIcon, 
  ArrowLeftOnRectangleIcon 
} from "@heroicons/react/24/outline";

// REPLACE THESE WITH YOUR ACTUAL GITHUB RAW TXT/JSON URLS
const GITHUB_USERS_URL = "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/data/users.txt";
const GITHUB_JOBS_URL = "https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/YOUR_REPO/main/data/jobs.txt";

export default function App() {
  const [activeTab, setActiveTab] = useState("browse");
  const [currentUser, setCurrentUser] = useState(null);
  
  // Data states
  const [validUsers, setValidUsers] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Forms
  const [loginEmail, setLoginEmail] = useState("");
  const [loginPass, setLoginPass] = useState("");
  const [loginError, setLoginError] = useState("");

  // Admin New Company Form
  const [newCompany, setNewCompany] = useState({ name: "", logo: "", title: "", description: "" });
  const [generatedJson, setGeneratedJson] = useState("");

  // Fetch TXT/JSON Data from GitHub on Load
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // Fetch Users File
        const usersRes = await fetch(GITHUB_USERS_URL);
        if (usersRes.ok) {
          const usersData = await usersRes.json();
          setValidUsers(usersData);
        }

        // Fetch Jobs File
        const jobsRes = await fetch(GITHUB_JOBS_URL);
        if (jobsRes.ok) {
          const jobsData = await jobsRes.json();
          setJobs(jobsData);
        }
      } catch (err) {
        console.warn("Using fallback demo data. Update GitHub URLs to connect your live txt files.", err);
        // Fallback local mock structure
        setValidUsers([{ email: "demo@student.com", password: "password123", name: "Alex Student" }]);
        setJobs([
          {
            id: 1,
            company: "Apex Technologies",
            logo: "https://via.placeholder.com/60/7c3aed/ffffff?text=Apex",
            title: "Junior Frontend Developer",
            description: "Entry level React role for recent graduates and self-taught devs."
          }
        ]);
      }
      setLoading(false);
    }

    fetchData();
  }, []);

  // Handle Login against Git TXT data
  const handleLogin = (e) => {
    e.preventDefault();
    const found = validUsers.find(u => u.email === loginEmail && u.password === loginPass);
    if (found) {
      setCurrentUser(found);
      setLoginError("");
      setActiveTab("browse");
    } else {
      setLoginError("Invalid credentials. Details must match records in the GitHub database.");
    }
  };

  // Generate TXT payload for Admin to copy to Git
  const handleCreateCompany = (e) => {
    e.preventDefault();
    const newEntry = {
      id: Date.now(),
      ...newCompany
    };
    const updatedJobs = [...jobs, newEntry];
    setGeneratedJson(JSON.stringify(updatedJobs, null, 2));
  };

  return (
    <div className="flex h-screen bg-[#1c122c] text-[#e0d6f6] font-sans">
      
      {/* SIDEBAR LAYOUT */}
      <aside className="w-64 bg-[#120a1f] border-r border-[#31204b] flex flex-col justify-between p-4">
        <div>
          <div className="flex items-center gap-3 px-3 py-4 border-b border-[#31204b] mb-6">
            <div className="w-8 h-8 rounded-lg bg-[#ff6b6b] flex items-center justify-center font-bold text-slate-900">
              P
            </div>
            <span className="text-xl font-black text-[#ff6b6b] tracking-wide">PORLITO</span>
          </div>

          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab("browse")}
              className={`w-[#100%] flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === "browse" ? "bg-[#31204b] text-[#ff6b6b]" : "hover:bg-[#1f1333] text-[#a492c4]"
              }`}
            >
              <BriefcaseIcon className="w-5 h-5" /> Browse Opportunities
            </button>

            {!currentUser ? (
              <>
                <button
                  onClick={() => setActiveTab("login")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    activeTab === "login" ? "bg-[#31204b] text-[#ff6b6b]" : "hover:bg-[#1f1333] text-[#a492c4]"
                  }`}
                >
                  <KeyIcon className="w-5 h-5" /> Student Login
                </button>
                <button
                  onClick={() => setActiveTab("signup")}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                    activeTab === "signup" ? "bg-[#31204b] text-[#ff6b6b]" : "hover:bg-[#1f1333] text-[#a492c4]"
                  }`}
                >
                  <UserPlusIcon className="w-5 h-5" /> Student Sign Up
                </button>
              </>
            ) : null}

            <button
              onClick={() => setActiveTab("admin")}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition ${
                activeTab === "admin" ? "bg-[#31204b] text-[#ff6b6b]" : "hover:bg-[#1f1333] text-[#a492c4]"
              }`}
            >
              <ShieldCheckIcon className="w-5 h-5" /> Admin Panel
            </button>
          </nav>
        </div>

        {/* USER PROFILE CARD */}
        {currentUser && (
          <div className="bg-[#26163d] p-3 rounded-lg border border-[#3f2a5f] flex items-center justify-between">
            <div>
              <p className="text-xs text-[#a492c4]">Logged in as</p>
              <p className="text-sm font-bold text-white truncate">{currentUser.name}</p>
            </div>
            <button 
              onClick={() => setCurrentUser(null)} 
              title="Logout"
              className="text-[#ff6b6b] hover:text-red-400 p-1"
            >
              <ArrowLeftOnRectangleIcon className="w-5 h-5" />
            </button>
          </div>
        )}
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 overflow-y-auto p-8">
        
        {/* VIEW 1: BROWSE JOBS */}
        {activeTab === "browse" && (
          <div>
            <h1 className="text-2xl font-bold mb-2 text-white">Verified Opportunities</h1>
            <p className="text-[#a492c4] mb-6">Exclusively curated positions added directly by site admins.</p>
            
            {loading ? (
              <p className="text-[#a492c4]">Loading positions from GitHub TXT database...</p>
            ) : (
              <div className="grid gap-4">
                {jobs.map((job) => (
                  <div key={job.id} className="bg-[#25183e] border border-[#3f2a5f] p-5 rounded-xl flex items-center gap-5 hover:border-[#ff6b6b] transition">
                    <img src={job.logo || "https://via.placeholder.com/60"} alt={job.company} className="w-14 h-14 rounded-lg object-cover bg-[#120a1f]" />
                    <div className="flex-1">
                      <span className="text-xs text-[#ff6b6b] font-bold uppercase tracking-wider">{job.company}</span>
                      <h3 className="text-lg font-bold text-white">{job.title}</h3>
                      <p className="text-sm text-[#b8a8d9] mt-1">{job.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* VIEW 2: SIGNUP (Sends to email) */}
        {activeTab === "signup" && (
          <div className="max-w-md mx-auto bg-[#25183e] border border-[#3f2a5f] p-6 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-2">Student Registration</h2>
            <p className="text-sm text-[#a492c4] mb-6">Applications are strictly for students and grads. Details are routed to admin verification.</p>
            
            <form action="https://formspree.io/f/dimphomagoro5@gmail.com" method="POST" className="space-y-4">
              <div>
                <label className="block text-xs mb-1 text-[#b8a8d9]">Full Name</label>
                <input required type="text" name="name" className="w-full bg-[#120a1f] border border-[#3f2a5f] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#ff6b6b]" />
              </div>
              <div>
                <label className="block text-xs mb-1 text-[#b8a8d9]">Email Address</label>
                <input required type="email" name="email" className="w-full bg-[#120a1f] border border-[#3f2a5f] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#ff6b6b]" />
              </div>
              <div>
                <label className="block text-xs mb-1 text-[#b8a8d9]">Requested Password</label>
                <input required type="password" name="password" className="w-full bg-[#120a1f] border border-[#3f2a5f] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#ff6b6b]" />
              </div>
              <button type="submit" className="w-full bg-[#ff6b6b] text-slate-900 font-bold py-3 rounded-lg hover:bg-[#ff5252] transition">
                Submit Signup Request
              </button>
            </form>
          </div>
        )}

        {/* VIEW 3: LOGIN (Checks GitHub txt) */}
        {activeTab === "login" && (
          <div className="max-w-md mx-auto bg-[#25183e] border border-[#3f2a5f] p-6 rounded-xl">
            <h2 className="text-xl font-bold text-white mb-2">Student Login</h2>
            <p className="text-sm text-[#a492c4] mb-6">Authenticate against the active GitHub text database.</p>
            
            {loginError && <div className="p-3 mb-4 text-xs bg-red-900/40 border border-red-500 text-red-200 rounded-lg">{loginError}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs mb-1 text-[#b8a8d9]">Email Address</label>
                <input required type="email" value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full bg-[#120a1f] border border-[#3f2a5f] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#ff6b6b]" />
              </div>
              <div>
                <label className="block text-xs mb-1 text-[#b8a8d9]">Password</label>
                <input required type="password" value={loginPass} onChange={(e) => setLoginPass(e.target.value)} className="w-full bg-[#120a1f] border border-[#3f2a5f] rounded-lg p-2.5 text-white focus:outline-none focus:border-[#ff6b6b]" />
              </div>
              <button type="submit" className="w-full bg-[#ff6b6b] text-slate-900 font-bold py-3 rounded-lg hover:bg-[#ff5252] transition">
                Log In
              </button>
            </form>
          </div>
        )}

        {/* VIEW 4: ADMIN PANEL */}
        {activeTab === "admin" && (
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="bg-[#25183e] border border-[#3f2a5f] p-6 rounded-xl">
              <h2 className="text-xl font-bold text-white mb-2">Admin Entry Generator</h2>
              <p className="text-sm text-[#a492c4] mb-6">Fill out company details to generate formatted text for your GitHub database.</p>
              
              <form onSubmit={handleCreateCompany} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs mb-1 text-[#b8a8d9]">Company Name</label>
                    <input required type="text" value={newCompany.name} onChange={(e) => setNewCompany({...newCompany, name: e.target.value})} className="w-full bg-[#120a1f] border border-[#3f2a5f] rounded-lg p-2.5 text-white" />
                  </div>
                  <div>
                    <label className="block text-xs mb-1 text-[#b8a8d9]">Logo URL</label>
                    <input required type="text" placeholder="https://..." value={newCompany.logo} onChange={(e) => setNewCompany({...newCompany, logo: e.target.value})} className="w-full bg-[#120a1f] border border-[#3f2a5f] rounded-lg p-2.5 text-white" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs mb-1 text-[#b8a8d9]">Job Title</label>
                  <input required type="text" value={newCompany.title} onChange={(e) => setNewCompany({...newCompany, title: e.target.value})} className="w-full bg-[#120a1f] border border-[#3f2a5f] rounded-lg p-2.5 text-white" />
                </div>
                <div>
                  <label className="block text-xs mb-1 text-[#b8a8d9]">Job Description</label>
                  <textarea required rows={3} value={newCompany.description} onChange={(e) => setNewCompany({...newCompany, description: e.target.value})} className="w-full bg-[#120a1f] border border-[#3f2a5f] rounded-lg p-2.5 text-white" />
                </div>
                <button type="submit" className="bg-[#ff6b6b] text-slate-900 font-bold px-6 py-2.5 rounded-lg hover:bg-[#ff5252] transition">
                  Generate Database Text
                </button>
              </form>
            </div>

            {generatedJson && (
              <div className="bg-[#120a1f] border border-[#3f2a5f] p-4 rounded-xl">
                <h3 className="text-sm font-bold text-[#ff6b6b] mb-2">Copy this text and paste it into your `jobs.txt` file on GitHub:</h3>
                <textarea readOnly rows={8} value={generatedJson} className="w-full bg-[#0a0512] font-mono text-xs text-green-400 p-3 rounded-lg border border-[#3f2a5f]" />
              </div>
            )}
          </div>
        )}

      </main>
    </div>
  );
}