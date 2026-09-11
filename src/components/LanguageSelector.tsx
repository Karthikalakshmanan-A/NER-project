import React, { useState, useRef, useEffect } from 'react';
import { Languages, Check, ChevronDown, Sparkles, Globe2, Search } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface LanguageSelectorProps {
  variant?: 'navbar' | 'inline' | 'floating';
  className?: string;
  onLanguageChanged?: (name: string) => void;
}

export const LanguageSelector: React.FC<LanguageSelectorProps> = ({
  variant = 'navbar',
  className = '',
  onLanguageChanged
}) => {
  const { currentLanguage, setLanguage, languages, t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (code: string, nativeName: string) => {
    setLanguage(code);
    setIsOpen(false);
    if (onLanguageChanged) {
      onLanguageChanged(nativeName);
    }
  };

  const filteredLanguages = languages.filter(l => 
    l.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.nativeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.region.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 border border-slate-700 text-slate-100 text-xs font-semibold shadow-sm transition-all cursor-pointer group"
        title="Change Application Language / மொழியை மாற்றுக"
      >
        <div className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30 flex items-center justify-center font-bold text-[10px]">
          {currentLanguage.badge}
        </div>
        <span className="font-bold text-sky-400 tracking-tight">
          {currentLanguage.nativeName}
        </span>
        <span className="text-[10px] text-slate-400 hidden sm:inline">
          ({currentLanguage.name})
        </span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-700 rounded-2xl shadow-2xl z-50 p-3 animate-in fade-in zoom-in-95 duration-150 text-white">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Globe2 className="w-4 h-4 text-sky-400" />
              <span className="font-bold text-xs">
                Select Language / மொழி தேர்வு
              </span>
            </div>
            <span className="text-[10px] bg-sky-500/10 text-sky-300 px-2 py-0.5 rounded font-mono border border-sky-500/20">
              13 Languages
            </span>
          </div>

          {/* Quick Search */}
          <div className="relative mb-2.5">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search / தேடுக (தமிழ், हिन्दी, English...)"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-800/90 text-xs text-white placeholder-slate-400 pl-8 pr-3 py-1.5 rounded-lg border border-slate-700 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Languages Grid */}
          <div className="max-h-72 overflow-y-auto space-y-1 pr-1 custom-scrollbar">
            {filteredLanguages.map((lang) => {
              const isSelected = currentLanguage.code === lang.code;
              return (
                <button
                  key={lang.code}
                  type="button"
                  onClick={() => handleSelect(lang.code, lang.nativeName)}
                  className={`w-full text-left px-3 py-2 rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-blue-600 text-white shadow-md'
                      : 'hover:bg-slate-800/90 text-slate-200'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-[11px] font-mono border ${
                      isSelected ? 'bg-white/20 border-white/40 text-white' : 'bg-slate-800 border-slate-700 text-slate-300'
                    }`}>
                      {lang.badge}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-sm leading-tight">
                          {lang.nativeName}
                        </span>
                        <span className={`text-[11px] ${isSelected ? 'text-blue-100' : 'text-slate-400'}`}>
                          • {lang.name}
                        </span>
                      </div>
                      <span className={`text-[10px] block leading-tight ${isSelected ? 'text-blue-200' : 'text-slate-500'}`}>
                        {lang.region}
                      </span>
                    </div>
                  </div>

                  {isSelected && (
                    <Check className="w-4 h-4 text-white shrink-0" />
                  )}
                </button>
              );
            })}
          </div>

          <div className="pt-2 mt-2 border-t border-slate-800 text-[10px] text-slate-400 text-center">
            Instant real-time translation across all screens
          </div>
        </div>
      )}
    </div>
  );
};
