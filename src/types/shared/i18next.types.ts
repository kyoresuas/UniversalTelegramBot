import ru from "@/locales/ru/ru.json";

type LeafKeys<T> = T extends Record<string, unknown>
  ? {
      [K in keyof T & string]: T[K] extends Record<string, unknown>
        ? `${K}.${LeafKeys<T[K]>}`
        : K;
    }[keyof T & string]
  : never;

declare module "i18next" {
  interface CustomTypeOptions {
    defaultNS: "translation";
    resources: {
      translation: typeof ru;
    };
  }
}

export type I18n = LeafKeys<typeof ru>;

export type I18nArgs = { [x: string]: I18nArgs | boolean | number | string };
