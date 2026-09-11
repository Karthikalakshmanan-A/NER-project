import React from 'react';
import { Compass, ShieldCheck, PhoneCall, Building2, ExternalLink } from 'lucide-react';

interface FooterProps {
  onNavigateToPage?: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigateToPage }) => {
  return (
    <footer className="bg-slate-950 border-t border-slate-800 text-slate-400 text-xs">
      {/* Required Prominent Dashboard Message Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-blue-950 border-b border-blue-900/60 py-8 px-4 sm:px-6 lg:px-8 text-center text-white">
        <div className="max-w-4xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-300 text-xs font-semibold uppercase tracking-wider">
            <Compass className="w-3.5 h-3.5" />
            North Eastern Region Smart Logistics Mission
          </div>
          <p className="text-base md:text-xl font-bold text-slate-100 leading-relaxed">
            "NER SmartMove AI provides intelligent route optimization, risk prediction, accessibility intelligence and emergency logistics support for challenging terrain and low-connectivity regions of Northeast India."
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-400 pt-2 font-medium">
            <span>• Ministry of Development of North Eastern Region (MDoNER)</span>
            <span>• NHIDCL Hill Corridors</span>
            <span>• SDRF & NDRF Logistics Protocol</span>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-3 md:col-span-2">
          <div className="flex items-center gap-2 text-white">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
              <Compass className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-base tracking-tight">NER SmartMove AI</span>
          </div>
          <p className="text-slate-400 text-xs leading-relaxed max-w-md">
            Dedicated logistics resiliency platform supporting freight companies, interstate drivers, remote tribal villages, and state disaster response forces across Assam, Meghalaya, Arunachal Pradesh, Nagaland, Manipur, Mizoram, Tripura, and Sikkim.
          </p>
          <div className="flex items-center gap-3 text-xs pt-1">
            <span className="text-emerald-400 flex items-center gap-1 font-semibold">
              <ShieldCheck className="w-4 h-4" /> Hackathon Prototype v2.4
            </span>
            <span>• Real-time GIS Simulation</span>
          </div>
        </div>

        <div className="space-y-2.5 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
            Platform Modules
          </h4>
          <ul className="space-y-1.5">
            <li><button onClick={() => onNavigateToPage?.('dashboard')} className="hover:text-blue-400 transition-colors">Admin Command Dashboard</button></li>
            <li><button onClick={() => onNavigateToPage?.('planner')} className="hover:text-blue-400 transition-colors">Smart Route Planner (AI Engine)</button></li>
            <li><button onClick={() => onNavigateToPage?.('risk')} className="hover:text-blue-400 transition-colors">AI Risk Intelligence & Warnings</button></li>
            <li><button onClick={() => onNavigateToPage?.('freight')} className="hover:text-blue-400 transition-colors">Freight Management & Fleet Tracking</button></li>
            <li><button onClick={() => onNavigateToPage?.('accessibility')} className="hover:text-blue-400 transition-colors">Village Accessibility Score (0-100)</button></li>
            <li><button onClick={() => onNavigateToPage?.('emergency')} className="hover:text-blue-400 transition-colors">Emergency & Disaster Logistics</button></li>
            <li><button onClick={() => onNavigateToPage?.('driver')} className="hover:text-blue-400 transition-colors">Driver Mobile HUD & Navigation</button></li>
          </ul>
        </div>

        <div className="space-y-2.5 text-xs">
          <h4 className="font-bold text-white uppercase tracking-wider text-[11px]">
            Emergency Help & Helplines
          </h4>
          <div className="space-y-2">
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">National Emergency Response:</span>
              <span className="font-mono font-bold text-red-400 text-sm flex items-center gap-1 mt-0.5">
                <PhoneCall className="w-3.5 h-3.5" /> 112 / 108
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-900 border border-slate-800">
              <span className="text-slate-400 block text-[10px]">Highway Patrol & Landslide Helpline:</span>
              <span className="font-mono font-bold text-amber-400 text-sm flex items-center gap-1 mt-0.5">
                <Building2 className="w-3.5 h-3.5" /> 1033 (NHAI / NHIDCL)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="border-t border-slate-900 py-4 px-4 sm:px-6 text-center text-slate-500 text-[11px]">
        NER SmartMove AI • Built for Northeast India Terrain Mobility • College Demonstration & Technical Prototype
      </div>
    </footer>
  );
};
