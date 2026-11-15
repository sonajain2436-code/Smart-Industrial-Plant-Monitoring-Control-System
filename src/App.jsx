import React, { useState } from 'react';
import { PlantProvider } from './context/PlantContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { FaultModal } from './components/FaultModal';
import { AlertPanel } from './components/AlertPanel';

// Pages
import { Dashboard } from './pages/Dashboard';
import { Mechanical } from './pages/Mechanical';
import { Chemical } from './pages/Chemical';
import { Electrical } from './pages/Electrical';
import { Integration } from './pages/Integration';
import { Simulation } from './pages/Simulation';
import { Analytics } from './pages/Analytics';
import { Reports } from './pages/Reports';
import { Settings } from './pages/Settings';

function AppContent() {
  const [activePage, setActivePage] = useState('dashboard');
  const [faultModalOpen, setFaultModalOpen] = useState(false);

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <Dashboard setActivePage={setActivePage} onOpenFaultModal={() => setFaultModalOpen(true)} />;
      case 'mechanical':
        return <Mechanical />;
      case 'chemical':
        return <Chemical />;
      case 'electrical':
        return <Electrical />;
      case 'integration':
        return <Integration />;
      case 'simulation':
        return <Simulation />;
      case 'analytics':
        return <Analytics />;
      case 'alerts':
        return <AlertPanel />;
      case 'reports':
        return <Reports />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard setActivePage={setActivePage} onOpenFaultModal={() => setFaultModalOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#F3F5F9] dark:bg-[#0B132B] text-slate-900 dark:text-slate-100 font-sans">
      {/* Left Sidebar */}
      <Sidebar activePage={activePage} setActivePage={setActivePage} />

      {/* Main Content Area */}
      <div className="flex flex-col flex-1 h-full min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar 
          onOpenFaultModal={() => setFaultModalOpen(true)} 
          onOpenAlertsModal={() => setActivePage('alerts')}
        />

        {/* Dynamic Page View */}
        <main className="flex-1 overflow-y-auto">
          {renderPage()}
        </main>
      </div>

      {/* Fault Injection Modal */}
      <FaultModal
        isOpen={faultModalOpen}
        onClose={() => setFaultModalOpen(false)}
      />
    </div>
  );
}

export default function App() {
  return (
    <PlantProvider>
      <AppContent />
    </PlantProvider>
  );
}
