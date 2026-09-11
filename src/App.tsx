import React, { useState } from 'react';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { LandingPage } from './components/LandingPage';
import { AdminDashboard } from './components/AdminDashboard';
import { SmartRoutePlanner } from './components/SmartRoutePlanner';
import { RiskIntelligencePage } from './components/RiskIntelligencePage';
import { FreightManagementPage } from './components/FreightManagementPage';
import { PassengerAccessibilityPage } from './components/PassengerAccessibilityPage';
import { EmergencyResponsePage } from './components/EmergencyResponsePage';
import { DriverMobileView } from './components/DriverMobileView';
import { AIAssistantModal } from './components/AIAssistantModal';
import { LoginModal } from './components/LoginModal';
import { RouteOption } from './types';
import { Bot, Sparkles, AlertTriangle, WifiOff, CheckCircle2 } from 'lucide-react';

export default function App() {
  const [activePage, setActivePage] = useState<string>('landing');
  const [isOffline, setIsOffline] = useState<boolean>(false);
  const [userRole, setUserRole] = useState<string>('admin');
  const [isAssistantOpen, setIsAssistantOpen] = useState<boolean>(false);
  const [isLoginOpen, setIsLoginOpen] = useState<boolean>(false);
  const [activeRoute, setActiveRoute] = useState<RouteOption | null>(null);
  const [systemNotice, setSystemNotice] = useState<string | null>(null);

  const triggerNotice = (msg: string) => {
    setSystemNotice(msg);
    setTimeout(() => setSystemNotice(null), 4000);
  };

  const handleToggleOffline = () => {
    const next = !isOffline;
    setIsOffline(next);
    if (next) {
      triggerNotice('Offline Mode Activated: Maps cached locally. Satellite GPS mode engaged.');
    } else {
      triggerNotice('Online Mode Restored: Live cloud sync, Doppler radar, and GSI feeds refreshed.');
    }
  };

  const handleRoleSelection = (role: string) => {
    setUserRole(role);
    triggerNotice(`Active Persona switched to: ${role.toUpperCase()}`);
    // route to appropriate view
    if (role === 'admin') setActivePage('dashboard');
    else if (role === 'freight') setActivePage('freight');
    else if (role === 'driver') setActivePage('driver');
    else if (role === 'passenger') setActivePage('accessibility');
    else if (role === 'emergency') setActivePage('emergency');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-100 dark:bg-slate-900 text-slate-900 dark:text-slate-100 selection:bg-blue-600 selection:text-white transition-colors">
      {/* Top Navbar */}
      <Navbar
        activePage={activePage}
        onSelectPage={setActivePage}
        isOffline={isOffline}
        onToggleOffline={handleToggleOffline}
        onOpenAssistant={() => setIsAssistantOpen(true)}
        onOpenLogin={() => setIsLoginOpen(true)}
        userRole={userRole}
      />

      {/* Floating System Toast Notice */}
      {systemNotice && (
        <div className="fixed top-20 right-6 z-50 bg-slate-900/95 border border-blue-500/50 text-white text-xs px-4 py-3 rounded-2xl shadow-2xl flex items-center gap-2.5 animate-in slide-in-from-top-4 backdrop-blur-md">
          <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-medium">{systemNotice}</span>
        </div>
      )}

      {/* Main Content View Switcher */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activePage === 'landing' && (
          <LandingPage
            onGetStarted={() => setActivePage('planner')}
            onOpenLogin={() => setIsLoginOpen(true)}
            onSelectRole={handleRoleSelection}
          />
        )}

        {activePage === 'dashboard' && (
          <AdminDashboard
            onNavigateToPage={setActivePage}
            isOffline={isOffline}
          />
        )}

        {activePage === 'planner' && (
          <SmartRoutePlanner
            onNavigateToMobileView={(route) => {
              setActiveRoute(route);
              setActivePage('driver');
            }}
            isOffline={isOffline}
          />
        )}

        {activePage === 'risk' && (
          <RiskIntelligencePage />
        )}

        {activePage === 'freight' && (
          <FreightManagementPage />
        )}

        {activePage === 'accessibility' && (
          <PassengerAccessibilityPage />
        )}

        {activePage === 'emergency' && (
          <EmergencyResponsePage />
        )}

        {activePage === 'driver' && (
          <DriverMobileView
            initialRoute={activeRoute}
            isGlobalOffline={isOffline}
            onToggleGlobalOffline={handleToggleOffline}
          />
        )}
      </main>

      {/* Floating Quick AI Assistant Bubble (Always accessible on any page) */}
      {!isAssistantOpen && (
        <button
          onClick={() => setIsAssistantOpen(true)}
          className="fixed bottom-6 right-6 z-40 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white p-3.5 rounded-full shadow-2xl transition-transform hover:scale-105 flex items-center gap-2 group cursor-pointer border-2 border-white/20"
          title="Open SmartMove AI Assistant"
        >
          <Bot className="w-6 h-6" />
          <span className="max-w-0 overflow-hidden whitespace-nowrap group-hover:max-w-xs transition-all duration-300 font-bold text-xs pr-1">
            SmartMove AI Assistant
          </span>
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 rounded-full bg-emerald-400 border-2 border-slate-900 animate-ping" />
        </button>
      )}

      {/* AI Assistant Modal */}
      <AIAssistantModal
        isOpen={isAssistantOpen}
        onClose={() => setIsAssistantOpen(false)}
        onNavigateToPage={setActivePage}
      />

      {/* Role Selection & Login Modal */}
      <LoginModal
        isOpen={isLoginOpen}
        onClose={() => setIsLoginOpen(false)}
        onSelectRole={handleRoleSelection}
        currentRole={userRole}
      />

      {/* Global Footer */}
      <Footer onNavigateToPage={setActivePage} />
    </div>
  );
}
