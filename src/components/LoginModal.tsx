import React, { useState } from 'react';
import { 
  X, 
  Lock, 
  Truck, 
  Navigation, 
  Users, 
  Building2, 
  ShieldAlert, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectRole: (role: string) => void;
  currentRole: string;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onSelectRole,
  currentRole
}) => {
  const [selected, setSelected] = useState(currentRole || 'admin');

  if (!isOpen) return null;

  const roles = [
    {
      id: 'admin',
      title: 'Government Authority / Admin',
      dept: 'MDoNER / NHIDCL Highway Monitoring',
      icon: Building2,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30',
      landingPage: 'dashboard',
      desc: 'Access regional road grids, 8-state telemetry, GSI landslide feeds, and maintenance alerts.'
    },
    {
      id: 'freight',
      title: 'Freight Company Dispatcher',
      dept: 'Commercial Fleet Logistics Operations',
      icon: Truck,
      color: 'text-blue-500 bg-blue-500/10 border-blue-500/30',
      landingPage: 'freight',
      desc: 'Active cargo orders, fuel estimations, vehicle turnaround times, and AI reroute directives.'
    },
    {
      id: 'driver',
      title: 'Truck / Commercial Driver',
      dept: 'Highway Pilot Mode HUD',
      icon: Navigation,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30',
      landingPage: 'driver',
      desc: 'Turn-by-turn hill navigation, audio alerts, emergency SOS, and offline cache map.'
    },
    {
      id: 'passenger',
      title: 'Passenger / Rural Citizen',
      dept: 'Public Mobility & Village Index',
      icon: Users,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30',
      landingPage: 'accessibility',
      desc: 'Village accessibility scores (0-100), nearest shared Sumos, hospitals, and weather safety.'
    },
    {
      id: 'emergency',
      title: 'Disaster / Emergency Commander',
      dept: 'NDRF / SDRF Rapid Relief Force',
      icon: ShieldAlert,
      color: 'text-red-500 bg-red-500/10 border-red-500/30',
      landingPage: 'emergency',
      desc: 'Disaster zone logistics, landslide evacuations, medical supply green corridors, and relief dispatch.'
    }
  ];

  const handleConfirmLogin = (roleId: string) => {
    onSelectRole(roleId);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                NER SmartMove Portal Access
              </h3>
              <p className="text-xs text-slate-500">
                Choose a role persona to explore specialized capabilities
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Roles List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          {roles.map((r) => {
            const IconComp = r.icon;
            const isCurrent = selected === r.id;

            return (
              <div
                key={r.id}
                onClick={() => setSelected(r.id)}
                className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                  isCurrent
                    ? 'bg-blue-50 dark:bg-blue-950/40 border-blue-500 shadow-sm ring-1 ring-blue-500/40'
                    : 'bg-slate-50 dark:bg-slate-850 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className={`p-3 rounded-xl border shrink-0 ${r.color}`}>
                  <IconComp className="w-5 h-5" />
                </div>
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                      {r.title}
                    </h4>
                    {isCurrent && (
                      <span className="text-xs text-blue-600 dark:text-blue-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-4 h-4" /> Active
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500 block">
                    {r.dept}
                  </span>
                  <p className="text-xs text-slate-600 dark:text-slate-400 pt-0.5">
                    {r.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Action Buttons */}
        <div className="p-6 bg-slate-50 dark:bg-slate-950 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-500">
            Demo credentials active (No password required)
          </span>
          <button
            onClick={() => handleConfirmLogin(selected)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 transition-all shadow-sm cursor-pointer"
          >
            <span>Proceed to Role Workspace</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
