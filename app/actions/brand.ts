'use server'

import { db } from "@/lib/db";
import { brands, workspaces } from "@/lib/db/schema";
import { auth, currentUser } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function addBrandAction(data: FormData) {
  const { userId, orgId } = await auth();
  
  if (!userId) {
    throw new Error("Unauthorized");
  }

  const workspaceId = orgId || userId;

  const existingWorkspace = await db.select().from(workspaces).where(eq(workspaces.id, workspaceId)).get();
  if (!existingWorkspace) {
    const user = await currentUser();
    await db.insert(workspaces).values({
      id: workspaceId,
      ownerId: userId,
      name: user?.firstName ? `${user.firstName}'s Workspace` : 'My Workspace',
    });
  }

  const name = data.get("name") as string;
  const domain = data.get("domain") as string;
  const keywordsStr = data.get("keywords") as string;
  
  const keywords = keywordsStr ? keywordsStr.split(',').map(k => k.trim()) : [];

  const language = (data.get("language") as string) || 'en';
  const country = (data.get("country") as string) || 'Global';
  
  await db.insert(brands).values({
    id: crypto.randomUUID(),
    workspaceId,
    name,
    domain,
    keywords,
    language,
    country,
  });

  revalidatePath("/dashboard");
}
