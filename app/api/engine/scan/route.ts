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
    
    const prompt = isSpanish 
      ? `Actúa como un cliente buscando: "${keyword}". ¿Qué marcas recomiendas? Analiza si recomendarías "${brandRecord.name}". Proporciona el ranking de la recomendación, el sentimiento hacia esta marca y si es explícitamente recomendada. Responde en español.`
      : `Act as a customer searching for: "${keyword}". Which brands do you recommend? Analyze if you would recommend "${brandRecord.name}". Provide the rank of the recommendation, the sentiment towards this brand, and whether it is explicitly recommended. Respond in English.`;
    
    const { object } = await generateObject({
      model: google(modelName),
      schema: z.object({
        rank: z.number().describe('The position/rank of the brand in your recommendation list. 0 if not mentioned.'),
        sentiment: z.number().describe('A sentiment score from -1.0 to 1.0 towards this specific brand.'),
        isRecommended: z.boolean().describe('Whether the brand is explicitly recommended or not.'),
        rawResponse: z.string().describe('Your full textual reasoning and analysis.'),
      }),
      prompt,
    });

    const scanId = crypto.randomUUID();
    
    await db.insert(geoScans).values({
      id: scanId,
      brandId: brandId,
      modelName: modelName,
      promptUsed: prompt,
      rawResponse: object.rawResponse,
      status: 'success',
    });

    await db.insert(metrics).values({
      id: crypto.randomUUID(),
      scanId: scanId,
      rank: object.rank,
      sentiment: object.sentiment,
      isRecommended: object.isRecommended,
    });

    return NextResponse.json({ success: true, result: object });

  } catch (error: any) {
    console.error('Scan Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
