import { Injectable } from '@angular/core';
import { Language } from 'src/app/interfaces/language.interface';
import { LanguaDictonary, DictonarySet, LanguageSet } from './langua.dictonary';

@Injectable({
  providedIn: 'root'
})
export class LanguaService {

  public current = 'en';
  public available: Language[] = [];
  public availableDetail;

  private dictonary: LanguaDictonary;

  constructor () {
    this.available = Object.values(LanguageSet);
    this.availableDetail = LanguageSet;

    if (!this.getLang()) {
      this.setLang('en');
    }
  }

  /**
   * Get Selected Language
   */
  public getLang = (): boolean => {
    if (localStorage.getItem('langua_selected')) {
      if (this.current = localStorage.getItem('langua_selected')) {
        this.getDictonary();
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  }

  /**
   * Selectes a Language
   * @param id The Id of the Language
   */
  public setLang = (id: string): void => {
    localStorage.setItem('langua_selected', id);
    this.getLang();
    document.title = `${this.g('title')}`;
  }

  /**
   * Gets a Translation by it's key
   * @param translationKey The keyName of the Translation
   *        -> See [[LanguaDictonary]] for available keys
   */
  public g = (translationKey: string): string => {
    if (!this.dictonary) {
      this.getDictonary();
    }
    return this.dictonary[translationKey] || '/NONE/';
  }

  /**
   * Sets the Current Language Dictonary
   */
  private getDictonary = (): void => {
    this.dictonary = DictonarySet[this.current];
  }

}
