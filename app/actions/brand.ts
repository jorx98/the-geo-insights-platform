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
  const product = data.get("product") as string;
  const service = data.get("service") as string;
  const country = (data.get("country") as string) || 'Global';
  const language = (data.get("language") as string) || 'en';
  
  // Backwards compatibility: use product/service as keywords
  const keywords = [product, service].filter(Boolean);

  await db.insert(brands).values({
    id: crypto.randomUUID(),
    workspaceId,
    name,
    domain,
    keywords,
    product,
    service,
    country,
    language,
  });

  revalidatePath("/dashboard");
}

export async function updateBrandAction(data: FormData) {
  const id = data.get("id") as string;
  const name = data.get("name") as string;
  const product = data.get("product") as string;
  const service = data.get("service") as string;
  const country = data.get("country") as string;

  await db.update(brands)
    .set({ name, product, service, country, keywords: [product, service].filter(Boolean) })
    .where(eq(brands.id, id));

  revalidatePath("/dashboard");
}

export async function deleteBrandAction(data: FormData) {
  const id = data.get("id") as string;
  await db.delete(brands).where(eq(brands.id, id));
  revalidatePath("/dashboard");
}
