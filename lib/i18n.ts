import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Language = 'en' | 'es';

interface I18nState {
  language: Language;
  setLanguage: (lang: Language) => void;
}

export const useI18nStore = create<I18nState>()(
  persist(
    (set) => ({
      language: 'en',
      setLanguage: (language) => set({ language }),
    }),
    {
      name: 'geo-i18n-storage',
    }
  )
);

export const translations = {
  en: {
    dashboard: {
      title: "Dashboard",
      addBrand: "Add Brand to Monitor",
      brandName: "Brand Name",
      domain: "Domain (Optional)",
      keywords: "Keywords (Comma separated)",
      startMonitoring: "Start Monitoring",
      monitoredBrands: "Monitored Brands",
      noBrands: "No brands monitored yet.",
      activeBrands: "Active Brands",
      totalScans: "Total Scans",
      shareOfVoice: "Global Share of Voice",
      latestScans: "Latest Engine Scans",
      waiting: "Waiting for Inngest workers to perform the first AI scan...",
      success: "success",
      error: "error",
      results: "Results",
      noKeywords: "No keywords",
    },
    common: {
      english: "English",
      spanish: "Spanish",
    }
  },
  es: {
    dashboard: {
      title: "Panel de Control",
      addBrand: "Añadir Marca para Monitorear",
      brandName: "Nombre de la Marca",
      domain: "Dominio (Opcional)",
      keywords: "Palabras Clave (Separadas por comas)",
      startMonitoring: "Iniciar Monitoreo",
      monitoredBrands: "Marcas Monitoreadas",
      noBrands: "Aún no hay marcas monitoreadas.",
      activeBrands: "Marcas Activas",
      totalScans: "Escaneos Totales",
      shareOfVoice: "Cuota de Voz Global",
      latestScans: "Últimos Escaneos del Motor",
      waiting: "Esperando que los trabajadores de Inngest realicen el primer escaneo IA...",
      success: "éxito",
      error: "error",
      results: "Resultados",
      noKeywords: "Sin palabras clave",
    },
    common: {
      english: "Inglés",
      spanish: "Español",
    }
  }
};

export const useTranslation = () => {
  const { language, setLanguage } = useI18nStore();
  const t = translations[language];
  
  return { t, language, setLanguage };
};
