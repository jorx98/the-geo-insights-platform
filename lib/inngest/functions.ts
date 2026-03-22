import { inngest } from "./client";
import { db } from "@/lib/db";
import { brands } from "@/lib/db/schema";

export const scheduledScan = inngest.createFunction(
  { id: "scheduled-geo-scan", triggers: [{ cron: "0 */6 * * *" }] },
  async ({ step }) => {
    const allBrands = await step.run("fetch-active-brands", async () => {
      return await db.select().from(brands).all();
    });

    const events = [];
    for (const brand of allBrands) {
      const keywords = (brand.keywords as string[]) || [];
      for (const keyword of keywords) {
         events.push({
           name: "app/scan.keyword",
           data: { brandId: brand.id, keyword }
         });
      }
    }

    if (events.length > 0) {
      await step.sendEvent("trigger-scans", events);
    }
    
    return { brandsProcessed: allBrands.length, scansTriggered: events.length };
  }
);

export const processKeywordScan = inngest.createFunction(
  { id: "process-keyword-scan", concurrency: 2, triggers: [{ event: "app/scan.keyword" }] },
  async ({ event, step }) => {
    const { brandId, keyword } = event.data;

    const result = await step.run("execute-scan-api", async () => {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
      const response = await fetch(`${baseUrl}/api/engine/scan`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brandId, keyword }),
      });
      
      if (!response.ok) {
         throw new Error(`Scan API failed: ${response.statusText}`);
      }
      return await response.json();
    });

    return { success: true, result };
  }
);
