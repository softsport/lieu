import Utils from './utils';

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
        if (!Utils.isObject(initialData)) {
            throw Error('Initial data is not an object type!');
        }

        this.initialData = initialData;

        this.initLieu();
    }

    // Class initialization
    initLieu() {
        this.initLanguages();
        this.setHooks();
        this.setAttributeName();
        this.setInitialLanguage();
    }

    // Set class field languages if languages from inittial data is object or json
    initLanguages() {
        let initialLanguages = this.initialData?.languages;

        if (Utils.isObject(initialLanguages)) {
            this.setLanguages(initialLanguages);
        } else {
            initialLanguages = Utils.fromJson(initialLanguages); // return null if lang not in json

            if (initialLanguages) {
                this.setLanguages(initialLanguages);
            } else {
                throw Error(
                    'Initial data property "languages" is not an object or json type!'
                );
            }
        }
    }

    // Set hooks if they exist in inital data
    setHooks() {
        if (typeof this.initialData.onSetLang === 'function') {
            this.onSetLang = this.initialData.onSetLang;
        }

        if (typeof this.initialData.onGetLang === 'function') {
            this.onGetLang = this.initialData.onGetLang;
        }
    }

    // Set custom data attribute
    setAttributeName() {
        const attr = this.initialData?.attributeName;

        if (attr) {
            if (typeof attr === 'string') {
                this.attributeName = attr;
            } else {
                throw Error('Property "attributeName" is not a string!');
            }
        }
    }

    /** Set languages class field from initial data if languages number two or more
    @param langs<Object>
    */
    setLanguages(langs) {
        const langsCount = Object.keys(langs).length;

        if (langsCount >= 2) {
            this.languages = langs;
        } else {
            throw Error(
                `Set two or more languages in initial data! You have set ${
                    langsCount === 1 ? 'one language' : 'none'
                }.`
            );
        }
    }

    // Set initial language from languages
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

            if (!this.initialLanguage) {
                console.warn(
                    'Initial language not found in "languages". Initial language will be set automatically.'
                );

                this.setInitialLanguageAuto();
            }
        } else {
            this.setInitialLanguageAuto();
        }
    }

    // Set initial language if initial language is not set in initial data
    setInitialLanguageAuto() {
        // Todo improve
        const storageLangKey = localStorage.getItem('language');
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
        if (!langKey) {
            throw Error(`Argument for setLang is ${typeof langKey}`);
        }

        const oldLang = this.currentLanguage;

        this.currentLanguage = this.languages[langKey];
        localStorage.setItem('language', langKey);

        this.localizeDomElems();

        this.onSetLang(oldLang, this.currentLanguage);
    }

    // Find all data-attributes by attributeName field in DOM, and localize them
    localizeDomElems() {
        const localeElems = Array.from(
            document.querySelectorAll(`[${this.attributeName}]`)
        );

        const locales = this.currentLanguage.locales;

        localeElems.forEach((elem) => {
            const locale = elem.dataset.localize;

            const localeText = locales[locale];

            if (localeText) {
                elem.innerHTML = localeText;
            } else {
                console.warn(
                    `Data-localize attribute '${locale}' not found in current language`
                );
            }
        });
    }

    /** Return value from currentLanguage.locales or null
    @param localeKey<String>
    */
    localize(localeKey) {
        const locales = this.currentLanguage.locales;
        let locale = null;

        if (locales[locale]) {
            locale = locales[locale];
        } else {
            console.warn(`Locale with key ${localeKey} not found!`);
        }

        return locale;
    }

    /** Return value from currentLanguage.locales or null
    @param localeKey<String>
    */
    __(localeKey) {
        return this.localize(localeKey);
    }

    // Return browser language
    getBrowserLang() {
        return navigator?.language;
    }

    /** Return language object from languages class field by its' key
    * or current langauge if @param langKey is not set
    @param langKey<String> not required
    */
    getLang(langKey) {
        let language;

        if (langKey) {
            if (this.languages[langKey]) {
                language = this.languages[langKey];
            } else {
                console.warn(
                    `Language with ${langKey} key not found! Return current language`
                );

                language = this.currentLanguage;
            }
        } else {
            language = this.currentLanguage;
        }

        this.onGetLang();

        return language;
    }
}

export default Lieu;
