import React, { useState } from 'react';
import {
  Download,
  FileSpreadsheet,
  FolderArchive,
  Bell,
  CheckCircle2,
  Monitor,
  Smartphone,
  Sparkles,
  Info,
  ShieldCheck,
  Building2,
  Calendar,
  Layers
} from 'lucide-react';
import { MasterJob, MatchScoreExplanation, PlatformNotification, SearchCriteria } from '../types';

interface WindowsExportNotificationViewProps {
  qualifyingJobs: MasterJob[];
  scores: Record<string, MatchScoreExplanation>;
  notifications: PlatformNotification[];
  criteria: SearchCriteria;
  onUpdateCriteria: (updated: SearchCriteria) => void;
  onExportXlsx: () => void;
  onClearNotifications: () => void;
}

export const WindowsExportNotificationView: React.FC<WindowsExportNotificationViewProps> = ({
  qualifyingJobs,
  scores,
  notifications,
  criteria,
  onUpdateCriteria,
  onExportXlsx,
  onClearNotifications
}) => {
  const [exportBundleGenerated, setExportBundleGenerated] = useState<string | null>(null);

  const handleGenerateWindowsBundle = () => {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const folderName = `JobDiscovery_Export_${timestamp}`;
    setExportBundleGenerated(folderName);
    onExportXlsx();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-[#1A1A1A]">Windows Export Pipeline & Notification Hub</h2>
            <span className="px-2 py-0.5 text-[9px] font-bold uppercase tracking-widest bg-[#1A1A1A] text-white">
              Tauri 2 / XLSX Ready
            </span>
          </div>
          <p className="text-xs text-[#5E5A54] mt-1 leading-relaxed max-w-2xl">
            Produces timestamped desktop export directories with tailored DOCX files and standard XLSX discovery spreadsheets.
          </p>
        </div>

        <button
          onClick={handleGenerateWindowsBundle}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#1A1A1A] hover:bg-black text-white text-[10px] sm:text-[11px] uppercase font-bold tracking-widest transition-colors cursor-pointer shadow-xs whitespace-nowrap"
        >
          <Download className="w-3.5 h-3.5" />
          Export Timestamped Bundle & XLSX
        </button>
      </div>

      {/* Grid: Windows Export Engine on Left, Notifications on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Windows Export Manifest */}
        <div className="lg:col-span-7 space-y-6">
          {/* Export Box */}
          <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs space-y-4">
            <div className="flex items-center gap-3 pb-4 border-b border-[#D1CEC7]">
              <div className="p-2 bg-[#F4F1ED] text-[#1A1A1A] border border-[#D1CEC7]">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-serif font-bold text-[#1A1A1A]">Standard XLSX Report Specification</h3>
                <p className="text-xs text-[#5E5A54]">Sorted descending by Match Percentage score.</p>
              </div>
            </div>

            <p className="text-xs text-[#5E5A54] leading-relaxed">
              Every exported spreadsheet adheres strictly to the project contract schema with the following 10 verified columns:
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs font-mono">
              {[
                '1. Company Name',
                '2. Job Title',
                '3. Job Link (External)',
                '4. Match Percentage (0-100%)',
                '5. Referrals Active',
                '6. CV filename (.docx)',
                '7. Cover Letter filename (.docx)',
                '8. Sources (LinkedIn, Indeed, etc.)',
                '9. Date label (Posted / Discovered)',
                '10. Status (Applied, Saved, etc.)'
              ].map((col, idx) => (
                <div key={idx} className="p-2.5 bg-[#F9F9F7] border border-[#D1CEC7] text-[#1A1A1A] text-[11px]">
                  {col}
                </div>
              ))}
            </div>

            {/* Notice */}
            <div className="p-4 bg-[#F4F1ED] border border-[#D1CEC7] text-xs text-[#1A1A1A] flex items-start gap-3">
              <Info className="w-4 h-4 text-[#1A1A1A] shrink-0 mt-0.5" />
              <div>
                <span className="font-bold block uppercase tracking-wider text-[10px] text-[#1A1A1A]">Windows Desktop Native Target:</span>
                In the Tauri 2 Windows desktop runtime, this action automatically creates a physical timestamped directory at <code className="bg-white px-1.5 py-0.5 border border-[#D1CEC7] font-mono text-[11px] mt-1 inline-block">%USERPROFILE%\Documents\JobDiscovery\Export_*</code>.
              </div>
            </div>

            {exportBundleGenerated && (
              <div className="p-4 bg-white border-2 border-[#1A1A1A] space-y-1.5">
                <div className="flex items-center gap-2 text-[#1A1A1A] font-serif font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4 text-[#1A1A1A]" />
                  <span>Export Bundle Created: {exportBundleGenerated}</span>
                </div>
                <p className="text-xs text-[#5E5A54]">
                  Spreadsheet generated with {qualifyingJobs.length} qualifying opportunities and formatted filenames.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Notification Preferences & Feed */}
        <div className="lg:col-span-5 space-y-6">
          {/* Notification Rules Config */}
          <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1CEC7]">
              <div className="flex items-center gap-2">
                <Bell className="w-4 h-4 text-[#1A1A1A]" />
                <h3 className="text-xs font-bold uppercase tracking-widest text-[#1A1A1A]">
                  Alert Preferences
                </h3>
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A847C]">Web & Mobile</span>
            </div>

            <div className="space-y-2 text-xs">
              <label className="flex items-center justify-between p-3 bg-[#F9F9F7] border border-[#D1CEC7] cursor-pointer">
                <span className="font-bold text-[#1A1A1A]">Alert on 80+ High Match Jobs</span>
                <input
                  type="checkbox"
                  checked={criteria.notificationRules.notifyHighMatch}
                  onChange={e =>
                    onUpdateCriteria({
                      ...criteria,
                      notificationRules: { ...criteria.notificationRules, notifyHighMatch: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-[#1A1A1A] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#F9F9F7] border border-[#D1CEC7] cursor-pointer">
                <span className="font-bold text-[#1A1A1A]">Alert on Priority / Monitored Companies</span>
                <input
                  type="checkbox"
                  checked={criteria.notificationRules.notifyPriorityCompanies}
                  onChange={e =>
                    onUpdateCriteria({
                      ...criteria,
                      notificationRules: { ...criteria.notificationRules, notifyPriorityCompanies: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-[#1A1A1A] cursor-pointer"
                />
              </label>

              <label className="flex items-center justify-between p-3 bg-[#F9F9F7] border border-[#D1CEC7] cursor-pointer">
                <span className="font-bold text-[#1A1A1A]">Alert on Any Newly Discovered Job</span>
                <input
                  type="checkbox"
                  checked={criteria.notificationRules.notifyNewDiscovered}
                  onChange={e =>
                    onUpdateCriteria({
                      ...criteria,
                      notificationRules: { ...criteria.notificationRules, notifyNewDiscovered: e.target.checked }
                    })
                  }
                  className="w-4 h-4 accent-[#1A1A1A] cursor-pointer"
                />
              </label>
            </div>
          </div>

          {/* Real-time Alerts Feed */}
          <div className="bg-white p-6 border border-[#D1CEC7] shadow-xs space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-[#D1CEC7]">
              <h3 className="text-xs font-bold uppercase tracking-widest text-[#8A847C]">
                Alerts & Event Stream ({notifications.length})
              </h3>
              <button
                onClick={onClearNotifications}
                className="text-[10px] uppercase font-bold tracking-wider text-[#1A1A1A] hover:underline cursor-pointer"
              >
                Mark all read
              </button>
            </div>

            <div className="space-y-2.5 max-h-80 overflow-y-auto">
              {notifications.map(n => (
                <div
                  key={n.id}
                  className={`p-3.5 border text-xs space-y-1 ${
                    n.isPriority ? 'bg-[#F4F1ED] border-[#1A1A1A]' : 'bg-[#F9F9F7] border-[#D1CEC7]'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold font-serif text-[#1A1A1A] text-sm">{n.title}</span>
                    <span className="text-[10px] text-[#8A847C] font-mono">
                      {new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                  <p className="text-[#5E5A54] leading-relaxed text-xs">{n.message}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
