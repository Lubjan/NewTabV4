import { Injectable } from '@angular/core';
import { Language } from 'src/app/interfaces/language.interface';

import { DictionarySet, LanguaDictionary, LanguageSet } from './langua.dictionary';

@Injectable({
  providedIn: 'root',
})
export class LanguaService {

  /**
   * Get or Set the Twitch User auth token
   */
  get languaSelected(): string {
    return localStorage.getItem('langua_selected');
  }
  set languaSelected(val: string) {
    localStorage.setItem('langua_selected', val);
  }

  current = 'en';
  available: Language[] = [];
  availableDetail;

  private dictionary: LanguaDictionary;

  constructor() {
    this.available = Object.values(LanguageSet);
    this.availableDetail = LanguageSet;

    if (!this.getLang()) {
      this.setLang('en');
    }
  }

  /**
   * Get Selected Language
   */
  getLang(): boolean {
    if (this.languaSelected && (this.current = this.languaSelected)) {
      this.getDictionary();
      document.title = this.g('title');
      document.documentElement.lang = this.current;

      return true;
    }

    return false;
  }

  /**
   * Selectes a Language
   * @param id The Id of the Language
   */
  setLang(id: string): void {
    this.languaSelected = id;
    this.getLang();
  }

  /**
   * Gets a Translation by it's key
   * @param translationKey The keyName of the Translation
   */
  g(translationKey: string): string {
    if (!this.dictionary) {
      this.getDictionary();
    }

    return this.dictionary[translationKey] || '/NONE/';
  }

  /**
   * Sets the Current Language Dictionary
   */
  private getDictionary(): void {
    this.dictionary = DictionarySet[this.current];
  }
}
