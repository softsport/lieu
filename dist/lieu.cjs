/*!
 * Lieu v1.2.0 (https://github.com/LeadrateMSK/lieu#readme)
 * Copyright 2022 LeadrateMSK <web@leadrate.pro>
 * Licensed under MIT (https://github.com/LeadrateMSK/lieu/blob/master/LICENSE)
 */
'use strict';

class Helpers {
  // Checks if passed object is object or not
  static isObject(obj) {
    return typeof obj === 'object';
  } // Checks if passed object is funcion or not


  static isFunction(func) {
    return typeof func === 'function';
  } // Returns parsed from JSON object or null


  static fromJson(obj) {
    try {
      const languagesFromJson = JSON.parse(obj);

      if (this.isObject(languagesFromJson)) {
        return languagesFromJson;
      } else {
        return null;
      }
    } catch {
      return null;
    }
  } // Return browser language


  static getBrowserLang() {
    return navigator.language.slice(0, 2);
  } // Check key existing in object


  static hasKey(key, obj) {
    return Object.keys(obj).indexOf(key) !== -1;
  } // Split string by delimiter, returns array<String>


  static findAllSubstrings(string) {
    const regexp = /\|[[{\d+]/g;
    const subStrings = [];

    function findDelimiter(str) {
      const delimiterIndex = str.search(regexp);

      if (delimiterIndex !== -1) {
        subStrings.push(str.substring(0, delimiterIndex));
        findDelimiter(str.substring(delimiterIndex + 1));
      } else {
        subStrings.push(str);
      }
    }

    findDelimiter(string);
    return subStrings;
  }
  /**
   * Returns pluralized string depending on passed @param count
   * @param string<String>
   * @param count<Number>
   */


  static pluralizeString(string, count) {
    // [num,num] {num,num} [num] {num} [num,*] {num,*}
    const regex = /[[{]\d+,{0,1}\d{0,}\*{0,1}[\]}]/g;
    const subStrings = this.findAllSubstrings(string);
    let locale;

    for (let i = 0; i < subStrings.length; i++) {
      const subString = subStrings[i];
      const result = subString.match(regex);

      if (result) {
        // Set default value for the first time
        if (!locale) {
          locale = subString.replace(regex, '');
          continue;
        }

        const resultNumbers = []; // Remove array/obj brackets and split string by comma

        resultNumbers.push(...result[0].replace(/[[{]|[\]}]/g, '').split(',')); // Check if matched plural count more or equal passed count

        if (resultNumbers.length >= 2) {
          if (resultNumbers[1] === '*' && count >= resultNumbers[0]) {
            locale = subString.replace(regex, '');
            break;
          } else if (resultNumbers[0] <= count && resultNumbers[1] >= count) {
            locale = subString.replace(regex, '');
            break;
          }
        } else {
          if (resultNumbers[0] === count) {
            locale = subString.replace(regex, '');
            break;
          }
        }
      }
    }

    return locale;
  }

}

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

    if (!Helpers.isObject(initialLanguages)) {
      initialLanguages = Helpers.fromJson(initialLanguages);
    }

    this.#languages = initialLanguages;
  } // Set hooks if they exist in initial data


  #setHooks() {
    if (Helpers.isFunction(this.#initialData.onSetLang)) {
      this.#onSetLang = this.#initialData.onSetLang;
    }

    if (Helpers.isFunction(this.#initialData.onGetLang)) {
      this.#onGetLang = this.#initialData.onGetLang;
    }
  } // Set custom data attribute


  #setAttributeName() {
    this.#attributeName = this.#initialData.attributeName ?? ATTRIBUTE_NAME;
  } // Set initial language from languages


  #setInitialLanguage() {
    const userKeyLang = localStorage.getItem(STORAGE_KEY) ?? // from storage
    this.#initialData.initialLanguage ?? // from options
    Helpers.getBrowserLang(); // from navigator

    if (Helpers.hasKey(userKeyLang, this.#languages)) {
      this.setLang(userKeyLang);
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

    if (!Helpers.hasKey(langKey, this.#languages)) {
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
   * @param arg1<String|Object> not required
   * @param arg2<String|Object> not required
   */


  trans(localeKey, arg1, arg2) {
    const {
      locales
    } = this.#currentLanguage;
    const options = [arg1, arg2];
    let locale = locales[localeKey];
    let interpolationObj;
    let pluralNum;

    if (Helpers.isObject(options[0])) {
      interpolationObj = options[0];
      pluralNum = options[1];
    } else {
      interpolationObj = options[1];
      pluralNum = options[0];
    }

    if (!locale) {
      locale = localeKey;

      if (this.#isDebug) {
        console.warn(`Lieu | Locale key "${localeKey}" not found in current language!`);
      }
    }

    if (interpolationObj) {
      locale = locale.replace(/%\{(.*?)\}/g, (match, key) => interpolationObj[key] || match);
    }

    if (pluralNum) {
      locale = Helpers.pluralizeString(locale, pluralNum);
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

    if (!Helpers.hasKey(langKey, this.#languages)) {
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
