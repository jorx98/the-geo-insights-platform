'use client';

import { useTranslation } from '@/lib/i18n';
import { addBrandAction } from "@/app/actions/brand";
import { useFormStatus } from "react-dom";

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors ${pending ? 'opacity-50 cursor-not-allowed' : ''}`}
    >
      {pending ? '...' : label}
    </button>
  );
}

export default function DashboardContent({ userBrands, latestScans }: { userBrands: any[], latestScans: any[] }) {
  const { t, language } = useTranslation();

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Sidebar: Brands & Actions */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-4">{t.dashboard.addBrand}</h2>
          <form action={addBrandAction} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400">{t.dashboard.brandName}</label>
              <input name="name" required className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. Acme Corp" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">{t.dashboard.domain}</label>
              <input name="domain" className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="acme.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">{t.dashboard.keywords}</label>
              <input name="keywords" required className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="best crm, enterprise software" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">{t.dashboard.country}</label>
              <input name="country" className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="Colombia" />
            </div>
            <input type="hidden" name="language" value={language} />
            <SubmitButton label={t.dashboard.startMonitoring} />
          </form>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-4">{t.dashboard.monitoredBrands}</h2>
          {userBrands.length === 0 ? (
            <p className="text-sm text-zinc-500">{t.dashboard.noBrands}</p>
          ) : (
            <ul className="space-y-3">
              {userBrands.map(b => (
                <li key={b.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium text-zinc-200">{b.name}</div>
                    <div className="text-xs text-zinc-500 mt-1">{(b.keywords as string[])?.join(', ') || t.dashboard.noKeywords}</div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <div className="md:col-span-2 space-y-6">
        <div className="grid grid-cols-3 gap-4">
           <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
             <div className="text-sm font-medium text-zinc-400">{t.dashboard.activeBrands}</div>
             <div className="text-3xl font-bold mt-2">{userBrands.length}</div>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
             <div className="text-sm font-medium text-zinc-400">{t.dashboard.totalScans}</div>
             <div className="text-3xl font-bold mt-2">{latestScans.length}</div>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
             <div className="text-sm font-medium text-zinc-400">{t.dashboard.shareOfVoice}</div>
             <div className="text-3xl font-bold mt-2 text-emerald-500">N/A</div>
           </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 min-h-[400px]">
          <h2 className="text-lg font-semibold tracking-tight mb-4">{t.dashboard.latestScans}</h2>
          {latestScans.length === 0 ? (
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl">
               <p className="text-sm text-zinc-500">{t.dashboard.waiting}</p>
            </div>
          ) : (
             <div className="space-y-4">
                {latestScans.map(s => (
                  <div key={s.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{s.modelName}</span>
                       <span className={`text-xs px-2 py-1 rounded ${s.status === 'success' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                         {s.status === 'success' ? t.dashboard.success : t.dashboard.error}
                       </span>
                    </div>
                    <div className="text-sm text-zinc-300 italic mb-3">"{s.promptUsed}"</div>
                    <div className="text-xs text-zinc-500 line-clamp-3">{s.rawResponse}</div>
                  </div>
                ))}
             </div>
          )}
        </div>
      </div>
    </div>
  );
}
