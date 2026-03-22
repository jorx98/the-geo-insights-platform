import { db } from "@/lib/db";
import { brands, metrics, geoScans } from "@/lib/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import { addBrandAction } from "@/app/actions/brand";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  const workspaceId = orgId || userId;

  if (!workspaceId) return null;

  // Fetch Brands
  const userBrands = await db.select().from(brands).where(eq(brands.workspaceId, workspaceId)).all();

  const latestScans = await db.select().from(geoScans).orderBy(desc(geoScans.createdAt)).limit(10).all();

  return (
    <div className="grid gap-8 md:grid-cols-3">
      {/* Sidebar: Brands & Actions */}
      <div className="md:col-span-1 space-y-6">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Add Brand to Monitor</h2>
          <form action={addBrandAction} className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-400">Brand Name</label>
              <input name="name" required className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="e.g. Acme Corp" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">Domain (Optional)</label>
              <input name="domain" className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="acme.com" />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">Keywords (Comma separated)</label>
              <input name="keywords" required className="w-full mt-1.5 px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg focus:ring-2 focus:ring-blue-600 focus:outline-none" placeholder="best crm, enterprise software" />
            </div>
            <button type="submit" className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors">Start Monitoring</button>
          </form>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Monitored Brands</h2>
          {userBrands.length === 0 ? (
            <p className="text-sm text-zinc-500">No brands monitored yet.</p>
          ) : (
            <ul className="space-y-3">
              {userBrands.map(b => (
                <li key={b.id} className="p-3 bg-zinc-950 border border-zinc-800 rounded-lg flex justify-between items-center">
                  <div>
                    <div className="font-medium text-zinc-200">{b.name}</div>
                    <div className="text-xs text-zinc-500 mt-1">{(b.keywords as string[])?.join(', ') || 'No keywords'}</div>
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
             <div className="text-sm font-medium text-zinc-400">Active Brands</div>
             <div className="text-3xl font-bold mt-2">{userBrands.length}</div>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
             <div className="text-sm font-medium text-zinc-400">Total Scans</div>
             <div className="text-3xl font-bold mt-2">{latestScans.length}</div>
           </div>
           <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6">
             <div className="text-sm font-medium text-zinc-400">Global Share of Voice</div>
             <div className="text-3xl font-bold mt-2 text-emerald-500">N/A</div>
           </div>
        </div>

        <div className="bg-zinc-900/50 border border-zinc-800 rounded-xl p-6 min-h-[400px]">
          <h2 className="text-lg font-semibold tracking-tight mb-4">Latest Engine Scans</h2>
          {latestScans.length === 0 ? (
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-zinc-800 rounded-xl">
               <p className="text-sm text-zinc-500">Waiting for Inngest workers to perform the first AI scan...</p>
            </div>
          ) : (
             <div className="space-y-4">
                {latestScans.map(s => (
                  <div key={s.id} className="p-4 bg-zinc-950 border border-zinc-800 rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                       <span className="text-xs font-mono bg-zinc-800 text-zinc-300 px-2 py-1 rounded">{s.modelName}</span>
                       <span className={`text-xs px-2 py-1 rounded ${s.status === 'success' ? 'bg-emerald-950 text-emerald-400' : 'bg-red-950 text-red-400'}`}>
                         {s.status}
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
  )
}
