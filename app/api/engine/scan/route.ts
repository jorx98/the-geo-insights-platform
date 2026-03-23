import { NextResponse } from 'next/server';
import { generateObject } from 'ai';
import { createGoogleGenerativeAI } from '@ai-sdk/google';
import { z } from 'zod';
import { db } from '@/lib/db';
import { geoScans, metrics, brands } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'edge';

const google = createGoogleGenerativeAI({
  apiKey: process.env.GEMINI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { brandId, keyword } = await req.json();

    if (!brandId || !keyword) {
      return NextResponse.json({ error: 'Missing brandId or keyword' }, { status: 400 });
    }

    const brandRecord = await db.select().from(brands).where(eq(brands.id, brandId)).get();
    if (!brandRecord) {
      return NextResponse.json({ error: 'Brand not found' }, { status: 404 });
    }

    const modelName = 'gemini-2.5-flash';
    const isSpanish = brandRecord.language === 'es';
    const country = brandRecord.country || 'Global';
    const offering = brandRecord.product || brandRecord.service || keyword;
    
    const prompt = isSpanish 
      ? `Actúa como un analista experto de mercado y "Juez de IA" en ${country}. Realiza un análisis profundo sobre la marca "${brandRecord.name}" buscando: "${offering}".
         Genera un reporte estratégico de REPUTACIÓN SINTÉTICA que incluya:
         1. Un resumen del análisis (detectando si la información es verídica o alucinada).
         2. Fuentes citadas (donde los modelos suelen sacar esta info: Reddit, Wiki, YouTube, etc).
         3. Detección de alucinaciones (comportamientos erróneos de modelos sobre tu marca).
         4. Recomendaciones de colaboración, contenido y redes sociales.
         5. Principales competidores y cálculo de Share of Voice (SOV) ponderado por adopción del modelo.
         6. Métricas de sentimiento (0.0 a 1.0) y ranking.
         Responde detalladamente en español.`
      : `Act as an expert market analyst and "AI Judge" in ${country}. Perform a deep analysis for the brand "${brandRecord.name}" searching for: "${offering}".
         Generate a SYNTHETIC REPUTATION strategic report including:
         1. Analysis summary (detecting if info is verified or hallucinated).
         2. Sources cited (where models typically get this info: Reddit, Wiki, YouTube, etc).
         3. Hallucination detection (inaccurate model claims about your brand).
         4. Recommendations for collaboration, content, and social media.
         5. Top competitors and Share of Voice (SOV) calculation weighted by model adoption.
         6. Metrics for sentiment (0.0 to 1.0) and rank.
         Respond in detail in English.`;
    
    const { object } = await generateObject({
      model: google(modelName),
      schema: z.object({
        summary: z.string(),
        sources: z.array(z.object({ name: z.string(), importance: z.number().min(0).max(100).describe("How much this source influences AI knowledge (0-100)") })),
        hallucinations: z.array(z.object({ claim: z.string(), correction: z.string(), severity: z.enum(['low', 'medium', 'high']) })),
        recommendations: z.object({
          web: z.array(z.object({ site: z.string(), justification: z.string(), action: z.string() })),
          content: z.array(z.object({ theme: z.string(), justification: z.string(), action: z.string() })),
          social: z.array(z.object({ platform: z.string(), justification: z.string(), action: z.string() })),
          influencers: z.array(z.object({ name: z.string(), justification: z.string(), action: z.string() })),
        }),
        competitors: z.array(z.object({ name: z.string(), position: z.number(), shareOfVoice: z.number().describe("Percentage 0-100") })),
        metrics: z.object({
          sentiment: z.number().min(0).max(1),
          rank: z.number(),
          shareOfVoice: z.number().min(0).max(100).describe("Brand's share of voice weighted by adoption"),
          isRecommended: z.boolean(),
        })
      }),
      prompt,
    });

    const scanId = crypto.randomUUID();
    
    await db.insert(geoScans).values({
      id: scanId,
      brandId: brandId,
      modelName: modelName,
      promptUsed: prompt,
      rawResponse: object.summary,
      status: 'success',
      report: object,
    });

    await db.insert(metrics).values({
      id: crypto.randomUUID(),
      scanId: scanId,
      rank: object.metrics.rank,
      sentiment: object.metrics.sentiment,
      isRecommended: object.metrics.isRecommended,
    });

    return NextResponse.json({ success: true, result: object });

  } catch (error: any) {
    console.error('Scan Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
