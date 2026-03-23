'use client';

import { useTranslation } from "@/lib/i18n";
import { ExternalLink, Search, User, Share2, Globe, TrendingUp, AlertTriangle, Link2 } from "lucide-react";

export interface ReportData {
  summary: string;
  sources: { name: string; importance: number }[];
  hallucinations: { claim: string; correction: string; severity: 'low' | 'medium' | 'high' }[];
  recommendations: {
    web: { site: string; justification: string; action: string }[];
    content: { theme: string; justification: string; action: string }[];
    social: { platform: string; justification: string; action: string }[];
    influencers: { name: string; justification: string; action: string }[];
  };
  competitors: { name: string; position: number; shareOfVoice: number }[];
  metrics: {
    sentiment: number;
    rank: number;
    shareOfVoice: number;
    isRecommended: boolean;
  };
}

export default function StrategicReport({ report }: { report: ReportData }) {
  const { t } = useTranslation();

  if (!report) return null;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Summary Card */}
      <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl p-6">
        <div className="flex items-center gap-2 mb-4 text-blue-400">
          <TrendingUp className="w-5 h-5" />
          <h3 className="font-semibold text-lg">{t.dashboard.summary}</h3>
        </div>
        <p className="text-zinc-300 leading-relaxed text-sm">{report.summary}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sources Analysis */}
        <SectionCard title={t.dashboard.sources} icon={<Link2 className="w-4 h-4" />}>
           <div className="p-4 flex flex-wrap gap-2">
              {report.sources?.map((source, i) => (
                <div key={i} className="bg-zinc-800/50 border border-zinc-700/50 px-3 py-1.5 rounded-full flex items-center gap-2 transition-all hover:bg-zinc-700/50">
                  <span className="text-[11px] font-medium text-zinc-200">{source.name}</span>
                  <div className="w-8 h-1 bg-zinc-700 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-500" style={{ width: `${source.importance}%` }} />
                  </div>
                  <span className="text-[9px] text-zinc-500">{source.importance}%</span>
                </div>
              ))}
           </div>
        </SectionCard>

        {/* Hallucinations / Accuracy */}
        <SectionCard title={t.dashboard.hallucinations} icon={<AlertTriangle className="w-4 h-4" />}>
           <div className="divide-y divide-zinc-800">
              {report.hallucinations?.length === 0 ? (
                <div className="p-4 text-center text-[11px] text-zinc-500 italic">No hallucinations detected in this scan. High accuracy.</div>
              ) : (
                report.hallucinations?.map((h, i) => (
                  <div key={i} className="p-4 space-y-2">
                    <div className="flex justify-between items-start gap-3">
                       <span className="text-[10px] font-bold text-red-400 uppercase tracking-tighter">{t.dashboard.claim}:</span>
                       <span className={`text-[9px] px-1.5 py-0.5 rounded uppercase font-bold ${
                         h.severity === 'high' ? 'bg-red-950 text-red-500' : 
                         h.severity === 'medium' ? 'bg-orange-950 text-orange-500' : 
                         'bg-zinc-800 text-zinc-400'
                       }`}>
                         {h.severity}
                       </span>
                    </div>
                    <p className="text-[11px] text-zinc-400 line-through decoration-red-900/50">{h.claim}</p>
                    <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-tighter mt-2">{t.dashboard.correction}:</div>
                    <p className="text-[11px] text-zinc-200">{h.correction}</p>
                  </div>
                ))
              )}
           </div>
        </SectionCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Web Collaboration */}
...
        <SectionCard title={t.dashboard.webCollaboration} icon={<Globe className="w-4 h-4" />}>
          <Table headers={[t.dashboard.site, t.dashboard.justification, t.dashboard.action]}>
            {report.recommendations.web.map((item, i) => (
              <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
                <td className="py-3 px-4 font-medium text-zinc-200 text-xs">{item.site}</td>
                <td className="py-3 px-4 text-zinc-400 text-[11px] leading-tight">{item.justification}</td>
                <td className="py-3 px-4 text-right">
                  <button className="text-blue-400 hover:text-blue-300 text-[10px] font-medium flex items-center gap-1 justify-end">
                    {item.action} <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </SectionCard>

        {/* Content Creation */}
        <SectionCard title={t.dashboard.contentCreation} icon={<Search className="w-4 h-4" />}>
           <Table headers={[t.dashboard.theme, t.dashboard.justification, t.dashboard.action]}>
            {report.recommendations.content.map((item, i) => (
              <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
                <td className="py-3 px-4 font-medium text-zinc-200 text-xs">{item.theme}</td>
                <td className="py-3 px-4 text-zinc-400 text-[11px] leading-tight">{item.justification}</td>
                <td className="py-3 px-4 text-right">
                   <button className="bg-blue-600/20 hover:bg-blue-600/30 text-blue-400 px-3 py-1 rounded-md text-[10px] whitespace-nowrap">
                    {item.action}
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </SectionCard>

        {/* Social Media */}
        <SectionCard title={t.dashboard.socialMedia} icon={<Share2 className="w-4 h-4" />}>
           <Table headers={[t.dashboard.platform, t.dashboard.justification, t.dashboard.action]}>
            {report.recommendations.social.map((item, i) => (
              <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
                <td className="py-3 px-4 font-medium text-zinc-200 text-xs">{item.platform}</td>
                <td className="py-3 px-4 text-zinc-400 text-[11px] leading-tight">{item.justification}</td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                   <button className="text-blue-400 hover:text-blue-300 text-[10px] font-medium flex items-center gap-1 justify-end">
                    {item.action} <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </SectionCard>

        {/* Influencers */}
        <SectionCard title={t.dashboard.influencers} icon={<User className="w-4 h-4" />}>
           <Table headers={[t.dashboard.name, t.dashboard.justification, t.dashboard.action]}>
            {report.recommendations.influencers.map((item, i) => (
              <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
                <td className="py-3 px-4 font-medium text-zinc-200 text-xs">{item.name}</td>
                <td className="py-3 px-4 text-zinc-400 text-[11px] leading-tight">{item.justification}</td>
                <td className="py-3 px-4 text-right whitespace-nowrap">
                    <button className="text-blue-400 hover:text-blue-300 text-[10px] font-medium flex items-center gap-1 justify-end">
                    {item.action} <ExternalLink className="w-2.5 h-2.5" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </SectionCard>
      </div>

       {/* Competitor Analysis */}
       <SectionCard title={t.dashboard.competitors} icon={<TrendingUp className="w-4 h-4" />}>
           <Table headers={[t.dashboard.name, t.dashboard.position, t.dashboard.sov]}>
            {report.competitors.map((item, i) => (
              <tr key={i} className="border-b border-zinc-800/50 last:border-0 hover:bg-zinc-800/20 transition-colors">
                <td className="py-3 px-4 font-medium text-zinc-200 text-xs">{item.name}</td>
                <td className="py-3 px-4 text-zinc-400 text-xs">{item.position}</td>
                <td className="py-3 px-4 text-right">
                   <div className="flex items-center justify-end gap-2">
                      <div className="w-24 h-1.5 bg-zinc-800 rounded-full overflow-hidden">
                        <div className="h-full bg-blue-600 rounded-full" style={{ width: `${item.shareOfVoice}%` }} />
                      </div>
                      <span className="text-[10px] text-zinc-400 w-8">{item.shareOfVoice}%</span>
                   </div>
                </td>
              </tr>
            ))}
          </Table>
        </SectionCard>
    </div>
  );
}

function SectionCard({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="bg-zinc-900/30 border border-zinc-800 rounded-2xl overflow-hidden">
      <div className="px-4 py-3 bg-zinc-900/50 border-b border-zinc-800 flex items-center gap-2">
        <span className="text-blue-400">{icon}</span>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{title}</h4>
      </div>
      <div className="p-0">
        {children}
      </div>
    </div>
  );
}

function Table({ headers, children }: { headers: string[]; children: React.ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-zinc-950/50 border-b border-zinc-800">
            {headers.map((h, i) => (
              <th key={i} className="py-2.5 px-4 text-[10px] font-bold text-zinc-500 uppercase tracking-widest leading-none">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-zinc-800/50">
          {children}
        </tbody>
      </table>
    </div>
  );
}
