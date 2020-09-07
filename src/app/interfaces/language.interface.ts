export type LanguageIds = string | 'en' | 'de';

export interface Language {
  id: LanguageIds;
  display: string | 'English' | 'German';
}

export type Languages = {
  [k in LanguageIds]: Language;
};
