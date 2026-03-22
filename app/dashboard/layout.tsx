import { UserButton } from "@clerk/nextjs";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <header className="border-b border-border/40 bg-zinc-950/80 backdrop-blur">
        <div className="container mx-auto flex h-16 items-center justify-between px-6">
          <div className="font-bold tracking-tight text-xl text-zinc-100 flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-blue-600 flex items-center justify-center text-white text-xs">G</div>
            GEO Insights
          </div>
          <div className="flex items-center space-x-4">
            <UserButton />
          </div>
        </div>
      </header>
      <main className="flex-1 container mx-auto p-6 md:p-8">
        {children}
      </main>
    </div>
  );
}
