import React, { useState, useEffect } from 'react';

// Custom Hash Router Hook for Single Page Navigation
function useHashRoute() {
  const [route, setRoute] = useState(window.location.hash || '#/');

  useEffect(() => {
    const handleHashChange = () => setRoute(window.location.hash || '#/');
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  return route;
}

// Animated SVG Pipeline Visual
function PipelineVisual() {
  return (
    <div className="pipeline-container">
      <svg className="pipeline-svg" viewBox="0 0 800 100">
        {/* Base Connecting Line */}
        <line x1="50" y1="50" x2="750" y2="50" className="pipeline-line" />
        
        {/* Animated Traveling Blue Signal */}
        <circle r="5" className="traveling-dot">
          <animateMotion 
            path="M 50 50 L 750 50" 
            dur="4s" 
            repeatCount="indefinite" 
          />
        </circle>

        {/* Nodes */}
        {[
          { x: 50, label: "University" },
          { x: 225, label: "Real Project" },
          { x: 400, label: "Contribution" },
          { x: 575, label: "Verified" },
          { x: 750, label: "Experience" }
        ].map((node, i) => (
          <g key={i}>
            <circle cx={node.x} cy="50" r="10" className="node-circle" />
            <circle cx={node.x} cy="50" r="4" fill="var(--accent-blue)" />
            <text 
              x={node.x} 
              y="85" 
              textAnchor="middle" 
              fill="var(--text-secondary)" 
              fontSize="12"
              fontFamily="IBM Plex Mono, monospace"
            >
              {node.label}
            </text>
          </g>
        ))}
      </svg>
    </div>
  );
}

// Sub-Views
function HomeView() {
  return (
    <div className="view container">
      <div className="hero">
        <h1>Proof of Engineering Capability</h1>
        <p>A black-and-blue status pipeline mapping student contributions directly into verified, professional credentials.</p>
        <a href="#/pilot" className="btn-primary">Join Pilot Program</a>
      </div>

      <PipelineVisual />

      <div className="grid">
        <div className="card">
          <span className="pulse-dot"></span>
          <h3>Target Metrics</h3>
          <p>Pilot Phase: Tracking 50+ early engineering contributions with zero fluff.</p>
        </div>
        <div className="card">
          <span className="pulse-dot"></span>
          <h3>Blue Signal Tech</h3>
          <p>Pure state verification replacing decoration with direct code telemetry.</p>
        </div>
      </div>
    </div>
  );
}

function HowItWorksView() {
  return (
    <div className="view container">
      <h2>How It Works</h2>
      <p className="subtitle">Horizontal pipeline tracking from academic origination to industry integration.</p>
      <PipelineVisual />
    </div>
  );
}

function PilotView({ onToast }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onToast("Pilot registration recorded! Backend wiring pending.");
  };

  return (
    <div className="view container form-container">
      <h2>Pilot Registration</h2>
      <p className="subtitle">Sign up to participate in the initial test group.</p>
      <form onSubmit={handleSubmit} className="card">
        <div className="form-group">
          <label>Email Address</label>
          <input type="email" required placeholder="engineer@university.edu" />
        </div>
        <div className="form-group">
          <label>Organization / University</label>
          <input type="text" required placeholder="Name of institution" />
        </div>
        <button type="submit" className="btn-primary btn-full">Submit Registration</button>
      </form>
    </div>
  );
}

function SimpleView({ title, content }) {
  return (
    <div className="view container">
      <h2>{title}</h2>
      <p className="subtitle">{content}</p>
    </div>
  );
}

// Main App Component
export default function PorlitoSite() {
  const route = useHashRoute();
  const [toastMsg, setToastMsg] = useState(null);

  const showToast = (msg) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 4000);
  };

  const renderView = () => {
    switch (route) {
      case '#/how-it-works':
        return <HowItWorksView />;
      case '#/students':
        return <SimpleView title="For Students" content="Verify real project contributions directly from your repository history." />;
      case '#/companies':
        return <SimpleView title="For Companies" content="Access verified technical talent with honest, un-faked contribution metrics." />;
      case '#/about':
        return <SimpleView title="About Porlito" content="Architected to provide transparent capability proof systems for emerging software engineers." />;
      case '#/pilot':
        return <PilotView onToast={showToast} />;
      case '#/':
      default:
        return <HomeView />;
    }
  };

  return (
    <div className="porlito-app">
      <nav>
        <div className="container nav-inner">
          <a href="#/" className="logo">
            <span className="pulse-dot"></span>
            PORLITO
          </a>
          <ul className="nav-links">
            <li><a href="#/" className={route === '#/' ? 'active' : ''}>Home</a></li>
            <li><a href="#/how-it-works" className={route === '#/how-it-works' ? 'active' : ''}>How It Works</a></li>
            <li><a href="#/students" className={route === '#/students' ? 'active' : ''}>Students</a></li>
            <li><a href="#/companies" className={route === '#/companies' ? 'active' : ''}>Companies</a></li>
            <li><a href="#/about" className={route === '#/about' ? 'active' : ''}>About</a></li>
          </ul>
          <a href="#/pilot" className="btn-primary">Pilot</a>
        </div>
      </nav>

      <main>
        {renderView()}
      </main>

      {toastMsg && (
        <div className="toast">
          <span className="pulse-dot"></span>
          <span>{toastMsg}</span>
        </div>
      )}
    </div>
  );
}