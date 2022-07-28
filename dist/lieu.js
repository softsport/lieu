/*!
 * Lieu v0.1.0 (https://github.com/LeadrateMSK/lieu#readme)
 * Copyright 2022 LeadrateMSK <web@leadrate.pro>
 * Licensed under MIT (https://github.com/LeadrateMSK/lieu/blob/master/LICENSE)
 */
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.lieu = factory());
})(this, (function () { 'use strict';

    class Helpers {
      // Checks if passed object is object or not
      static isObject(obj) {
        return typeof obj === 'object';
      } // Checks if passed object is funcion or not


      static isFunction(obj) {
        return typeof obj === 'function';
      }
      /** Returns parsed from JSON object or null
      @param obj<JSON>
      */


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
      }

    }

    const STORAGE_KEY = 'lieu';
    const ATTRIBUTE_NAME = 'data-lieu';

    /**
     * @param initialData<Object>
     */

    class Lieu {
      #isDebug = false; // boolean

      #isPluginInitialized = false; // boolean

      #initialData = null; // object

      #languages = null; // object

      #currentLanguage = null; // object

      #initialLanguage = null; // string

      #attributeName = ATTRIBUTE_NAME; // string

      #onSetLang = (newLang, oldLang) => {};
      #onGetLang = () => {};

      constructor(initialData) {
        this.#initialData = initialData;
        this.#isDebug = initialData.isDebug;
        this.#initLieu();
      } // Class initialization


      #initLieu() {
        this.#initLanguages();
        this.#setHooks();
        this.#setAttributeName();
        this.#setInitialLanguage();
      } // Set class field languages if languages from inittial data is object or json


      #initLanguages() {
        let initialLanguages = this.#initialData?.languages;

        if (Helpers.isObject(initialLanguages)) {
          this.#setLanguages(initialLanguages);
        } else {
          initialLanguages = Helpers.fromJson(initialLanguages); // return null if lang not in json

          this.#setLanguages(initialLanguages);
        }
      } // Set hooks if they exist in inital data


      #setHooks() {
        if (Helpers.isFunction(this.#initialData.onSetLang)) {
          this.#onSetLang = this.#initialData.onSetLang;
        }

        if (Helpers.isFunction(this.#initialData.onGetLang)) {
          this.#onGetLang = this.#initialData.onGetLang;
        }
      } // Set custom data attribute


      #setAttributeName() {
        const attr = this.#initialData?.attributeName;

        if (attr) {
          this.#attributeName = attr;
        }
      }
      /** Set languages from initial data in languages class field
      @param langs<Object>
      */


      #setLanguages(langs) {
        this.#languages = langs;
      } // Set initial language from languages


      #setInitialLanguage() {
        const storageLangKey = window.localStorage?.getItem(STORAGE_KEY);
        const langKeys = Object.keys(this.#languages);
        const initialLangName = this.#initialData.initialLanguage;
        let defaultLangKey;

        if (storageLangKey) {
          const isExistsInLangs = langKeys.find(key => key === storageLangKey); // If it exists in languages set as initial

          if (isExistsInLangs) {
            defaultLangKey = this.#languages[storageLangKey];
          }
        }

        if (initialLangName && !defaultLangKey) {
          const isExistsInLangs = langKeys.find(key => key === initialLangName); // If it exists in languages set as initial

          if (isExistsInLangs) {
            defaultLangKey = initialLangName;
          }
        } else {
          defaultLangKey = langKeys[0];
        }

        this.#initialLanguage = defaultLangKey;
        this.setLang(defaultLangKey);
      }
      /** Set new lang by string key from languages class field
      @param langKey<String>
      */


      setLang(langKey) {
        const newLanguage = this.#languages[langKey];
        const oldLanguage = this.#currentLanguage;

        if (!newLanguage) {
          if (this.#isDebug) {
            console.error(`Lieu | Language key "${langKey}" not found in languages!`);
          }

          return;
        }

        this.#currentLanguage = newLanguage;
        window.localStorage?.setItem(STORAGE_KEY, langKey);
        this.#localizeDomElems();

        if (this.#isPluginInitialized) {
          this.#onSetLang(oldLanguage, newLanguage);
        } else {
          this.#isPluginInitialized = true;
        }
      } // Find all data-attributes by attributeName field in DOM, and localize them


      #localizeDomElems() {
        const localeElems = Array.from(document.querySelectorAll(`[${this.#attributeName}]`));
        const {
          locales
        } = this.#currentLanguage;
        localeElems.forEach(elem => {
          const locale = elem.getAttribute(this.#attributeName);
          let localeText = locales[locale]; // If not found set attr value as text

          if (!localeText) {
            localeText = locale;

            if (this.#isDebug) {
              console.warn(`Lieu | ${this.#attributeName} attribute value "${locale}" not found in current language!`);
            }
          }

          elem.innerHTML = localeText;
        });
      }
      /** Return value from currentLanguage.locales or null
      @param localeKey<String>
      */


      localize(localeKey) {
        const {
          locales
        } = this.#currentLanguage;
        let locale = locales[localeKey];

        if (!locale) {
          locale = localeKey;

          if (this.#isDebug) {
            console.error(`Lieu | Locale key "${localeKey}" not found in current language!`);
          }
        }

        return locale;
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
        this.#onGetLang();

        if (langKey) {
          return this.#languages[langKey];
        }

        return this.#currentLanguage;
      } // Returns object of all languages


      getLangs() {
        return this.#languages;
      } // Returns string of initial language


      getInitialLang() {
        return this.#initialLanguage;
      }

    }

    return Lieu;

}));
//# sourceMappingURL=lieu.js.map
