import React, { useState } from 'react';
import { 
  Compass, 
  LayoutDashboard, 
  Navigation, 
  Activity, 
  Truck, 
  Users, 
  ShieldAlert, 
  Smartphone, 
  Bot, 
  Wifi, 
  WifiOff, 
  Lock, 
  Menu, 
  X,
  PhoneCall,
  Sparkles,
  Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { LanguageSelector } from './LanguageSelector';

interface NavbarProps {
  activePage: string;
  onSelectPage: (page: string) => void;
  isOffline: boolean;
  onToggleOffline: () => void;
  onOpenAssistant: () => void;
  onOpenLogin: () => void;
  userRole: string;
}

export const Navbar: React.FC<NavbarProps> = ({
  activePage,
  onSelectPage,
  isOffline,
  onToggleOffline,
  onOpenAssistant,
  onOpenLogin,
  userRole
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, currentLanguage } = useLanguage();

  const navItems = [
    { id: 'landing', labelKey: 'nav_home', fallback: 'Home', icon: Compass },
    { id: 'dashboard', labelKey: 'nav_dashboard', fallback: 'Admin Dashboard', icon: LayoutDashboard },
    { id: 'planner', labelKey: 'nav_planner', fallback: 'Route Planner', icon: Navigation },
    { id: 'risk', labelKey: 'nav_risk', fallback: 'AI Risk Intel', icon: Activity },
    { id: 'freight', labelKey: 'nav_freight', fallback: 'Freight Ops', icon: Truck },
    { id: 'accessibility', labelKey: 'nav_accessibility', fallback: 'Passenger & Village', icon: Users },
    { id: 'emergency', labelKey: 'nav_emergency', fallback: 'Emergency Logistics', icon: ShieldAlert },
    { id: 'driver', labelKey: 'nav_driver', fallback: 'Driver Mobile HUD', icon: Smartphone },
  ];

  const handleNavClick = (pageId: string) => {
    onSelectPage(pageId);
    setMobileMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white transition-colors">
      {/* Offline Alert Strip if offline */}
      {isOffline && (
        <div className="bg-amber-500 text-slate-950 px-4 py-1 text-xs font-bold flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <WifiOff className="w-3.5 h-3.5" />
            <span>OFFLINE MODE ACTIVE: Operating on locally cached NER terrain vectors & GPS telemetry. Cloud sync will trigger upon network restoration.</span>
          </div>
          <button
            onClick={onToggleOffline}
            className="bg-slate-950 text-amber-300 px-2 py-0.5 rounded text-[10px] font-mono hover:bg-slate-900 uppercase"
          >
            Switch to Online
          </button>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 gap-2">
          {/* Brand Logo & Regional Tag */}
          <div 
            onClick={() => onSelectPage('landing')}
            className="flex items-center gap-3 cursor-pointer group shrink-0"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition-transform">
              <Compass className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-white">
                  {t('app_name', 'NER SmartMove AI')}
                </span>
                <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-400/40 font-mono font-bold tracking-wider">
                  {t('all_states', 'ALL STATES')}
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block font-medium">
                {t('app_tagline', 'Logistics & Accessibility Intelligence')}
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden xl:flex items-center space-x-1 text-xs font-medium">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`px-2.5 py-2 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{t(item.labelKey, item.fallback)}</span>
                </button>
              );
            })}
          </nav>

          {/* Right Action Tools: Language Selector, Offline Switch, AI Assistant, Login Role */}
          <div className="flex items-center gap-2">
            {/* Multi-language Selector */}
            <LanguageSelector />

            {/* Offline Mode Toggle Button */}
            <button
              onClick={onToggleOffline}
              className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1.5 border transition-all cursor-pointer ${
                isOffline
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/50 hover:bg-amber-500/30'
                  : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700'
              }`}
              title="Simulate Offline Terrain Navigation"
            >
              {isOffline ? (
                <>
                  <WifiOff className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden md:inline font-mono">{t('btn_offline', 'Offline')}</span>
                </>
              ) : (
                <>
                  <Wifi className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden md:inline font-mono">{t('btn_online', 'Online')}</span>
                </>
              )}
            </button>

            {/* AI Assistant Chat Trigger */}
            <button
              onClick={onOpenAssistant}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold shadow-md flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Bot className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{t('btn_ai_assistant', 'AI Assistant')}</span>
            </button>

            {/* Login / Role Selector */}
            <button
              onClick={onOpenLogin}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <Lock className="w-3.5 h-3.5 text-blue-400" />
              <span className="capitalize">{userRole || t('btn_login', 'Login')}</span>
            </button>

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="xl:hidden p-2 rounded-lg bg-slate-800 text-slate-300 hover:text-white"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="xl:hidden border-t border-slate-800 bg-slate-900 px-4 py-3 space-y-2 animate-in slide-in-from-top-2">
          <div className="flex items-center justify-between py-1 border-b border-slate-800 pb-2">
            <span className="text-xs text-slate-400 font-medium">
              {t('lang_selector', 'Language')}:
            </span>
            <LanguageSelector />
          </div>

          <div className="space-y-1">
            {navItems.map((item) => {
              const IconComponent = item.icon;
              const isActive = activePage === item.id;

              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`w-full px-3 py-2.5 rounded-lg text-xs font-semibold flex items-center gap-2.5 transition-all ${
                    isActive
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{t(item.labelKey, item.fallback)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};

