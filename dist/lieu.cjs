/*!
 * Lieu v1.0.0 (https://github.com/LeadrateMSK/lieu#readme)
 * Copyright 2022 LeadrateMSK <web@leadrate.pro>
 * Licensed under MIT (https://github.com/LeadrateMSK/lieu/blob/master/LICENSE)
 */
'use strict';

const helpers = {
  // Checks if passed object is object or not
  isObject: obj => {
    return typeof obj === 'object';
  },
  // Checks if passed object is funcion or not
  isFunction: func => {
    return typeof func === 'function';
  },
  // Returns parsed from JSON object or null
  fromJson: obj => {
    try {
      const languagesFromJson = JSON.parse(obj);

      if (typeof languagesFromJson === 'object') {
        return languagesFromJson;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  },
  // Return browser language
  getBrowserLang: () => {
    return navigator.language.slice(0, 2);
  },
  // Check key existing in object
  hasKey: (key, obj) => {
    return Object.keys(obj).indexOf(key) !== -1;
  }
};

const STORAGE_KEY = 'lieu';
const ATTRIBUTE_NAME = 'data-lieu';

/**
 * @param initialData<Object>
 */

class Lieu {
  #isDebug = false; // boolean

  #initialData = null; // object

  #languages = null; // object

  #currentLanguage = null; // object

  #attributeName; // string

  #onSetLang = (newLang, oldLang) => {};
  #onGetLang = () => {};

  constructor(initialData) {
    this.#initialData = initialData;
    this.#isDebug = initialData.isDebug;
    this.#init();
  }

  #init() {
    this.#initLanguages();
    this.#setAttributeName();
    this.#setInitialLanguage();
    this.#setHooks();
  } // Set class field languages if languages from initial data is object or json


  #initLanguages() {
    let initialLanguages = this.#initialData.languages;

    if (!helpers.isObject(initialLanguages)) {
      initialLanguages = helpers.fromJson(initialLanguages);
    }

    this.#languages = initialLanguages;
  } // Set hooks if they exist in initial data


  #setHooks() {
    if (helpers.isFunction(this.#initialData.onSetLang)) {
      this.#onSetLang = this.#initialData.onSetLang;
    }

    if (helpers.isFunction(this.#initialData.onGetLang)) {
      this.#onGetLang = this.#initialData.onGetLang;
    }
  } // Set custom data attribute


  #setAttributeName() {
    this.#attributeName = this.#initialData.attributeName ?? ATTRIBUTE_NAME;
  } // Set initial language from languages


  #setInitialLanguage() {
    const initialLang = this.#initialData.initialLanguage;
    const userKeyLang = localStorage.getItem(STORAGE_KEY) ?? // from storage
    this.#initialData.initialLanguage ?? // from options
    helpers.getBrowserLang(); // from userAgent

    if (helpers.hasKey(userKeyLang, this.#languages)) {
      this.setLang(userKeyLang);
    } else if (helpers.hasKey(initialLang, this.#languages)) {
      this.setLang(initialLang);
    } else {
      this.setLang(Object.keys(this.#languages)[0]);
    }
  }
  /*
   * Set new lang by string key from languages class field
   * @param langKey<String>
   */


  setLang(langKey) {
    const newLanguage = this.#languages[langKey];
    const oldLanguage = this.#currentLanguage;

    if (!helpers.hasKey(langKey, this.#languages)) {
      console.error(`Lieu | Language key "${langKey}" not found in languages!`);
      return;
    }

    this.#currentLanguage = newLanguage;
    localStorage.setItem(STORAGE_KEY, langKey);
    this.#localizeDomElems();
    this.#onSetLang(oldLanguage, newLanguage);
  } // Find all data-attributes by attributeName field in DOM, and localize them


  #localizeDomElems() {
    const $locales = Array.from(document.querySelectorAll(`[${this.#attributeName}]`));
    $locales.forEach($str => {
      const locale = $str.getAttribute(this.#attributeName);
      $str.innerHTML = this.trans(locale);
    });
  }
  /**
   * Return value from currentLanguage.locales or null
   * @param localeKey<String>
   * @param options<Object>
   */


  trans(localeKey, options) {
    const {
      locales
    } = this.#currentLanguage;
    let locale = locales[localeKey];

    if (!locale) {
      locale = localeKey;

      if (this.#isDebug) {
        console.warn(`Lieu | Locale key "${localeKey}" not found in current language!`);
      }
    }

    if (options) {
      locale = locale.replace(/%\{(.*?)\}/g, (match, key) => options[key] || match);
    }

    return locale;
  }
  /** Return language object from languages class field by its' key
  * or current langauge if @param langKey is not set
  @param langKey<String> not required
  */


  getLang(langKey) {
    this.#onGetLang();

    if (!langKey) {
      return this.#currentLanguage;
    }

    if (!helpers.hasKey(langKey, this.#languages)) {
      console.error(`Lieu | Language key "${langKey}" not found in languages!`);
      return;
    }

    return this.#languages[langKey];
  } // Returns object of all languages


  getLangs() {
    return this.#languages;
  }

}

module.exports = Lieu;
//# sourceMappingURL=lieu.cjs.map
