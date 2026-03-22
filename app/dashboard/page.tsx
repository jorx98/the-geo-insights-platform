import { db } from "@/lib/db";
import { brands, metrics, geoScans } from "@/lib/db/schema";
import { auth } from "@clerk/nextjs/server";
import { eq, desc } from "drizzle-orm";
import DashboardContent from "@/components/DashboardContent";

export default async function DashboardPage() {
  const { userId, orgId } = await auth();
  const workspaceId = orgId || userId;

  if (!workspaceId) return null;

  // Fetch Brands
  const userBrands = await db.select().from(brands).where(eq(brands.workspaceId, workspaceId)).all();
  const latestScans = await db.select().from(geoScans).orderBy(desc(geoScans.createdAt)).limit(10).all();

  return <DashboardContent userBrands={userBrands} latestScans={latestScans} />;
}

