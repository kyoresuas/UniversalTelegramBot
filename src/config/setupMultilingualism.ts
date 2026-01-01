import i18next from "i18next";
import us from "@/locales/en/us.json";
import ru from "@/locales/ru/ru.json";

/**
 * Установить модуль для мультиязычности через i18next
 */
export const setupMultilingualism = async (): Promise<void> => {
  await i18next.init({
    // Язык по умолчанию
    fallbackLng: "ru",
    supportedLngs: ["ru", "en"],

    // Единый namespace для всего проекта
    defaultNS: "translation",
    ns: ["translation"],

    resources: {
      en: { translation: us },
      ru: { translation: ru },
    },

    interpolation: {
      escapeValue: false,
    },

    returnNull: false,
  });
};
