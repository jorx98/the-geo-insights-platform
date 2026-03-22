import { useTranslation } from '@/lib/i18n';
import { addBrandAction, updateBrandAction, deleteBrandAction } from "@/app/actions/brand";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { Pencil, Trash2, X, Check } from "lucide-react";

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
  const [editingBrandId, setEditingBrandId] = useState<string | null>(null);

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
              <label className="text-sm font-medium text-zinc-400">{t.dashboard.product}</label>
              <input name="product" required className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. SaaS CRM" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">{t.dashboard.service}</label>
              <input name="service" required className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. Enterprise Consulting" />
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
                <li key={b.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg group">
                  {editingBrandId === b.id ? (
                    <form action={async (fd) => {
                      await updateBrandAction(fd);
                      setEditingBrandId(null);
                    }} className="space-y-2">
                       <input type="hidden" name="id" value={b.id} />
                       <input name="name" defaultValue={b.name} className="w-full text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded" />
                       <input name="product" defaultValue={b.product} className="w-full text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded" />
                       <input name="service" defaultValue={b.service} className="w-full text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded" />
                       <input name="country" defaultValue={b.country} className="w-full text-xs px-2 py-1 bg-zinc-900 border border-zinc-800 rounded" />
                       <div className="flex gap-2 mt-2">
                         <button type="submit" className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white text-[10px] py-1 rounded flex items-center justify-center gap-1">
                           <Check className="w-3 w-3" /> {t.dashboard.save}
                         </button>
                         <button type="button" onClick={() => setEditingBrandId(null)} className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white text-[10px] py-1 rounded flex items-center justify-center gap-1">
                           <X className="w-3 w-3" /> {t.dashboard.cancel}
                         </button>
                       </div>
                    </form>
                  ) : (
                    <div className="flex justify-between items-start">
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-zinc-200 truncate">{b.name}</div>
                        <div className="text-[10px] text-zinc-500 mt-1 line-clamp-1">
                          {b.product || b.service || t.dashboard.noKeywords} • {b.country}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
                        <button onClick={() => setEditingBrandId(b.id)} className="p-1 hover:bg-zinc-800 rounded text-zinc-400 hover:text-white">
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <form action={deleteBrandAction}>
                          <input type="hidden" name="id" value={b.id} />
                          <button type="submit" className="p-1 hover:bg-red-950 rounded text-zinc-400 hover:text-red-400">
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </form>
                      </div>
                    </div>
                  )}
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

