import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Truck, 
  Bus, 
  Navigation, 
  CloudRain, 
  Mountain, 
  Building2, 
  PhoneCall, 
  Compass, 
  Users, 
  CheckCircle2, 
  Lock,
  Layers,
  Languages
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LandingPageProps {
  onGetStarted: () => void;
  onOpenLogin: () => void;
  onSelectRole: (role: string) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onGetStarted,
  onOpenLogin,
  onSelectRole
}) => {
  const { t, currentLanguage } = useLanguage();

  return (
    <div id="landing-page" className="space-y-16 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 border border-slate-800 text-white p-8 md:p-14 shadow-2xl">
        {/* Subtle decorative background circles & mesh */}
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-96 h-96 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 -mb-10 w-80 h-80 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            {t('hero_badge', 'Pan-India & North Eastern Regional Mobility Intelligence')}
          </div>

          <div className="space-y-2">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-tight">
              {t('app_name', 'NER SmartMove AI')}
            </h1>
            <p className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-300 via-sky-200 to-white">
              "{t('hero_title', 'Intelligent Mobility for Challenging Terrain')}"
            </p>
          </div>

          <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl">
            {t('hero_desc', 'An advanced AI-powered logistics, road safety, and accessibility intelligence platform covering all 28 states, 8 Union Territories, and the mountainous North East. Powered by Doppler radar, landslide elevation gradients, and real-time highway telemetry.')}
          </p>

          <div className="flex flex-wrap items-center gap-4 pt-2">
            <button
              id="btn-hero-get-started"
              onClick={onGetStarted}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold px-7 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm tracking-wide cursor-pointer"
            >
              <span>{t('btn_get_started', 'Launch Smart Route Planner')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="btn-hero-login"
              onClick={onOpenLogin}
              className="bg-slate-800/90 hover:bg-slate-700 text-white font-semibold px-6 py-3.5 rounded-xl border border-slate-700 transition-all flex items-center gap-2 text-sm cursor-pointer"
            >
              <Lock className="w-4 h-4 text-blue-400" />
              <span>{t('btn_login_portal', 'Login / Portal Access')}</span>
            </button>
          </div>

          {/* Quick Metrics Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs">
            <div>
              <span className="text-slate-400 block">{t('stat_states', 'States Monitored')}</span>
              <span className="text-xl font-bold text-white">{t('stat_states_val', 'All Indian States')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{t('stat_vehicles', 'Active Fleet in Transit')}</span>
              <span className="text-xl font-bold text-cyan-400">{t('stat_vehicles_val', '1,871 Live')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{t('stat_risk', 'Terrain Risk Precision')}</span>
              <span className="text-xl font-bold text-orange-400">{t('stat_risk_val', '92% Accurate')}</span>
            </div>
            <div>
              <span className="text-slate-400 block">{t('stat_offline', 'Offline GPS Cache')}</span>
              <span className="text-xl font-bold text-emerald-400">{t('stat_offline_val', '100% Resilient')}</span>
            </div>
          </div>
        </div>
      </section>

      {/* Target Users Personas Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
            {t('personas_tag', 'Ecosystem Stakeholders')}
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t('personas_title', 'Designed for 5 Target User Categories')}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            {t('personas_subtitle', 'Select a persona below to immediately inspect tailored views, workflows, and automated safety alerts:')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[
            {
              role: 'freight',
              titleKey: 'role_freight_title',
              descKey: 'role_freight_desc',
              defaultTitle: '1. Freight Companies',
              defaultDesc: 'Fleet routing, cargo priority, fuel cost estimation, and truck turnaround optimization.',
              icon: Truck,
              color: 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-900/60'
            },
            {
              role: 'driver',
              titleKey: 'role_driver_title',
              descKey: 'role_driver_desc',
              defaultTitle: '2. Truck & Vehicle Drivers',
              defaultDesc: 'Mobile-first HUD, audio safety prompts, real-time landslide warnings, and 1-tap SOS.',
              icon: Navigation,
              color: 'text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-900/60'
            },
            {
              role: 'passenger',
              titleKey: 'role_passenger_title',
              descKey: 'role_passenger_desc',
              defaultTitle: '3. Passengers & Locals',
              defaultDesc: 'Rural accessibility scores, shared Sumo counter schedules, and weather safety status.',
              icon: Users,
              color: 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/40 border-indigo-200 dark:border-indigo-900/60'
            },
            {
              role: 'admin',
              titleKey: 'role_admin_title',
              descKey: 'role_admin_desc',
              defaultTitle: '4. Govt Authorities',
              defaultDesc: 'Regional highway command, road maintenance alerts, and cross-border transport monitoring.',
              icon: Building2,
              color: 'text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-900/60'
            },
            {
              role: 'emergency',
              titleKey: 'role_emergency_title',
              descKey: 'role_emergency_desc',
              defaultTitle: '5. Emergency & Disaster Teams',
              defaultDesc: 'NDRF & SDRF green corridors, flood rescue routing, and hospital lifeline supply coordination.',
              icon: ShieldCheck,
              color: 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-900/60'
            }
          ].map((persona) => {
            const IconComponent = persona.icon;
            return (
              <div
                key={persona.role}
                onClick={() => onSelectRole(persona.role)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer hover:shadow-md flex flex-col justify-between ${persona.color}`}
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-white dark:bg-slate-900 flex items-center justify-center shadow-sm">
                    <IconComponent className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t(persona.titleKey, persona.defaultTitle)}
                  </h3>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {t(persona.descKey, persona.defaultDesc)}
                  </p>
                </div>

                <div className="pt-4 flex items-center gap-1 font-semibold text-xs mt-2">
                  <span>Enter Portal</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Core Platform Features Section */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 font-mono">
            Platform Capabilities
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            Next-Generation Northeast India Logistics Grid
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <Mountain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              AI Decision Engine vs. Shortest Path
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Standard GPS algorithms route trucks into impassable Sonapur mudslides simply because the road is 30 km shorter. SmartMove AI scores landslide saturation and elevation gradients to select proven safe corridors.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <CloudRain className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Doppler Rain & Landslide Prediction
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Synthesizing Geological Survey of India (GSI) slope indices with real-time precipitation gauges, issuing proactive 6–12 hour debris warnings to halt or divert freight before rockfalls occur.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
              Offline Cache & Zero-Signal Resilience
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Northeast deep mountain canyons experience zero cellular connectivity. SmartMove caches vector tiles and hazard maps locally, maintaining navigation and queuing telemetry packets for auto-sync upon signal restore.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

