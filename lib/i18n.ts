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
      product: "Main Product",
      service: "Main Service",
      country: "Target Country (e.g. Colombia, Spain)",
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
      noKeywords: "No data",
      edit: "Edit",
      delete: "Delete",
      save: "Save Changes",
      cancel: "Cancel",
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
      product: "¿Qué producto vendes?",
      service: "¿Qué servicio ofreces?",
      country: "País Objetivo (ej: Colombia, España)",
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
      noKeywords: "Sin datos",
      edit: "Editar",
      delete: "Eliminar",
      save: "Guardar Cambios",
      cancel: "Cancelar",
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
