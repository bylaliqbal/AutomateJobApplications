import React, { useState } from 'react';
import {
  Briefcase,
  FileText,
  Sliders,
  ShieldCheck,
  Download,
  Bell,
  RefreshCw,
  Server,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Bookmark
} from 'lucide-react';
import { PlatformNotification } from '../types';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  notifications: PlatformNotification[];
  onRunDiscovery: () => void;
  onExportXlsx: () => void;
  isDiscovering: boolean;
  qualifyingCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  notifications,
  onRunDiscovery,
  onExportXlsx,
  isDiscovering,
  qualifyingCount
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const unreadCount = notifications.filter(n => !n.isRead).length;

  const tabs = [
    { id: 'results', label: 'Discovery & Results', icon: Briefcase, badge: qualifyingCount > 0 ? `${qualifyingCount} Match` : undefined },
    { id: 'profile', label: 'Your Profile', icon: FileText },
    { id: 'criteria', label: 'Target Roles & Companies', icon: Sliders },
    { id: 'studio', label: 'Document Studio', icon: ShieldCheck },
    { id: 'export', label: 'Windows Export & Alerts', icon: Download },
    { id: 'providers', label: 'Provider Adapters', icon: Server }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#F4F1ED] border-b border-[#D1CEC7]">
      {/* Top utility bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Brand - Masthead style */}
          <div className="flex items-center gap-6 sm:gap-8">
            <div className="flex items-baseline gap-2">
              <span className="text-2xl sm:text-3xl font-serif font-black tracking-tighter text-[#1A1A1A]">
                SYNCHRON<span className="text-black">.</span>
              </span>
              <span className="hidden md:inline-block text-[9px] uppercase tracking-[0.25em] font-mono text-[#8A847C] font-semibold border-l border-[#D1CEC7] pl-2.5">
                Grounded Discovery Engine
              </span>
            </div>

            <div className="hidden lg:flex items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-[10px] uppercase font-bold tracking-widest bg-white border border-[#D1CEC7] text-[#1A1A1A]">
                <ShieldCheck className="w-3 h-3 text-[#1A1A1A]" />
                Truth-Locked
              </span>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <button
              id="btn-run-discovery"
              onClick={onRunDiscovery}
              disabled={isDiscovering}
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] sm:text-[11px] uppercase font-bold tracking-widest transition-colors disabled:opacity-50 cursor-pointer shadow-xs"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isDiscovering ? 'animate-spin' : ''}`} />
              {isDiscovering ? 'Crawling...' : 'Run Discovery'}
            </button>

            <button
              id="btn-quick-export-xlsx"
              onClick={onExportXlsx}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 bg-white hover:bg-[#EBE7E0] text-[#1A1A1A] border border-[#1A1A1A] text-[10px] sm:text-[11px] uppercase font-bold tracking-widest transition-colors cursor-pointer"
              title="Download Windows XLSX Report with qualifying jobs"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Export</span> XLSX
            </button>

            {/* Notification bell */}
            <div className="relative">
              <button
                id="btn-notifications"
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2.5 bg-white border border-[#D1CEC7] text-[#1A1A1A] hover:bg-[#EBE7E0] transition-colors cursor-pointer"
                title="Notifications"
              >
                <Bell className="w-4 h-4" />
                {unreadCount > 0 && (
                  <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#1A1A1A] rounded-full ring-2 ring-white"></span>
                )}
              </button>

              {/* Notification dropdown */}
              {showNotifications && (
                <div
                  id="notifications-popover"
                  className="absolute right-0 mt-2 w-80 sm:w-96 bg-white border border-[#D1CEC7] shadow-2xl p-5 z-50 animate-in fade-in zoom-in-95 duration-100"
                >
                  <div className="flex items-center justify-between pb-3 border-b border-[#D1CEC7]">
                    <h3 className="text-[10px] uppercase font-bold tracking-widest text-[#8A847C]">
                      Discovery Alerts ({unreadCount})
                    </h3>
                    <span className="text-[10px] font-mono text-[#5E5A54]">REAL-TIME</span>
                  </div>

                  <div className="mt-3 space-y-2.5 max-h-72 overflow-y-auto pr-1">
                    {notifications.map(n => (
                      <div
                        key={n.id}
                        className={`p-3 border text-xs transition-colors ${
                          n.isPriority ? 'bg-[#F9F9F7] border-[#1A1A1A]' : 'bg-white border-[#D1CEC7]'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className="font-bold text-[#1A1A1A]">{n.title}</span>
                          <span className="text-[10px] font-mono text-[#8A847C]">
                            {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="mt-1 text-[#5E5A54] text-[11px] leading-relaxed">{n.message}</p>
                      </div>
                    ))}
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#D1CEC7] text-center">
                    <button
                      onClick={() => {
                        setShowNotifications(false);
                        setActiveTab('export');
                      }}
                      className="text-[10px] uppercase font-bold tracking-widest text-[#1A1A1A] hover:underline"
                    >
                      Manage Alert Preferences →
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Profile Avatar Pill */}
            <div
              onClick={() => setActiveTab('profile')}
              className="h-9 w-9 bg-[#1A1A1A] text-white flex items-center justify-center text-xs font-bold font-mono tracking-tight cursor-pointer hover:opacity-90"
              title="Alexander Vance Profile"
            >
              AV
            </div>
          </div>
        </div>

        {/* Tab navigation with editorial uppercase tracking */}
        <nav className="flex space-x-6 overflow-x-auto no-scrollbar border-t border-[#D1CEC7] py-2 text-[11px] uppercase tracking-[0.2em] font-semibold text-[#5E5A54]">
          {tabs.map(tab => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 pb-1.5 transition-all cursor-pointer whitespace-nowrap ${
                  isActive
                    ? 'text-[#1A1A1A] border-b-2 border-[#1A1A1A] font-bold'
                    : 'text-[#5E5A54] hover:text-[#1A1A1A] border-b-2 border-transparent'
                }`}
              >
                <span>{tab.label}</span>
                {tab.badge && (
                  <span
                    className={`px-1.5 py-0.2 text-[9px] font-mono font-bold uppercase tracking-normal ${
                      isActive ? 'bg-[#1A1A1A] text-white' : 'bg-[#D1CEC7] text-[#1A1A1A]'
                    }`}
                  >
                    {tab.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
