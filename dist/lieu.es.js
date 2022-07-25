/*!
 * Lieu v0.0.1 (https://github.com/LeadrateMSK/lieu#readme)
 * Copyright 2022 LeadrateMSK <web@leadrate.pro>
 * Licensed under MIT (https://github.com/LeadrateMSK/lieu/blob/master/LICENSE)
 */
class Helpers {
  // Checks if passed data is object or not
  static isObject(data) {
    return typeof data === 'object';
  }
  /** Returns parsed from JSON object or null
  @param data<JSON>
  */


  static fromJson(data) {
    try {
      const languagesFromJson = JSON.parse(data);

      if (this.isObject(languagesFromJson)) {
        return languagesFromJson;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  }

}

const STORAGE_KEY = 'language';

/**
 * @param initialData<Object>
 */

class Lieu {
  initialData;
  languages = null;
  initialLanguage = null;
  currentLanguage = null;
  attributeName = 'data-localize';
  onSetLang = (newLang, oldLang) => {};
  onGetLang = () => {};

  constructor(initialData) {
    this.initialData = initialData;
    this.initLieu();
  } // Class initialization


  initLieu() {
    this.initLanguages();
    this.setHooks();
    this.setAttributeName();
    this.setInitialLanguage();
  } // Set class field languages if languages from inittial data is object or json


  initLanguages() {
    let initialLanguages = this.initialData?.languages;

    if (Helpers.isObject(initialLanguages)) {
      this.setLanguages(initialLanguages);
    } else {
      initialLanguages = Helpers.fromJson(initialLanguages); // return null if lang not in json

      this.setLanguages(initialLanguages);
    }
  } // Set hooks if they exist in inital data


  setHooks() {
    if (typeof this.initialData.onSetLang === 'function') {
      this.onSetLang = this.initialData.onSetLang;
    }

    if (typeof this.initialData.onGetLang === 'function') {
      this.onGetLang = this.initialData.onGetLang;
    }
  } // Set custom data attribute


  setAttributeName() {
    const attr = this.initialData?.attributeName;

    if (attr) {
      this.attributeName = attr;
    }
  }
  /** Set languages from initial data in languages class field
  @param langs<Object>
  */


  setLanguages(langs) {
    this.languages = langs;
  } // Set initial language from languages


  setInitialLanguage() {
    const langKeys = Object.keys(this.languages);
    const initialLangName = this.initialData.initialLanguage;

    if (initialLangName) {
      for (let i = 0; i < langKeys.length; i++) {
        if (initialLangName.includes(langKeys[i])) {
          this.initialLanguage = this.languages[langKeys[i]];
          this.setLang(initialLangName);
          break;
        }
      }
    } else {
      this.setInitialLanguageAuto();
    }
  } // Set initial language if initial language is not set in initial data


  setInitialLanguageAuto() {
    // Todo improve
    const storageLangKey = window.localStorage?.getItem(STORAGE_KEY);
    const langKeys = Object.keys(this.languages);
    let langKey = langKeys[0];

    if (storageLangKey) {
      for (let i = 0; i < langKeys.length; i++) {
        if (langKeys[i] === storageLangKey) {
          langKey = storageLangKey;
          break;
        }
      }
    }

    this.initialLanguage = this.languages[langKey];
    this.setLang(langKey);
  }
  /** Set new lang by string key from languages class field
  @param langKey<String>
  */


  setLang(langKey) {
    const oldLang = this.currentLanguage;
    this.currentLanguage = this.languages[langKey];
    window.localStorage?.setItem(STORAGE_KEY, langKey);
    this.localizeDomElems();
    this.onSetLang(oldLang, this.currentLanguage);
  } // Find all data-attributes by attributeName field in DOM, and localize them


  localizeDomElems() {
    const localeElems = Array.from(document.querySelectorAll(`[${this.attributeName}]`));
    const {
      locales
    } = this.currentLanguage;
    localeElems.forEach(elem => {
      const locale = elem.getAttribute(this.attributeName);
      const localeText = locales[locale];
      elem.innerHTML = localeText;
    });
  }
  /** Return value from currentLanguage.locales or null
  @param localeKey<String>
  */


  localize(localeKey) {
    const {
      locales
    } = this.currentLanguage;
    return locales[localeKey];
  }
  /** Return value from currentLanguage.locales or null
  @param localeKey<String>
  */


  __(localeKey) {
    return this.localize(localeKey);
  } // Return browser language


  getBrowserLang() {
    return navigator?.language;
  }
  /** Return language object from languages class field by its' key
  * or current langauge if @param langKey is not set
  @param langKey<String> not required
  */


  getLang(langKey) {
    this.onGetLang();

    if (langKey) {
      return this.languages[langKey];
    }

    return this.currentLanguage;
  } // Returns object of all languages


  getLangs() {
    return this.languages;
  }

}

export { Lieu as default };
//# sourceMappingURL=lieu.es.js.map
