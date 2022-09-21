import Helpers from './core/helpers';
import { STORAGE_KEY, ATTRIBUTE_NAME, PLURAL } from './core/const';

/**
 * @param initialData<Object>
 */
export default class Lieu {
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
    }

    // Set class field languages if languages from initial data is object or json
    #initLanguages() {
        let initialLanguages = this.#initialData.languages;

        if (!Helpers.isObject(initialLanguages)) {
            initialLanguages = Helpers.fromJson(initialLanguages);
        }

        this.#languages = initialLanguages;
    }

    // Set hooks if they exist in initial data
    #setHooks() {
        if (Helpers.isFunction(this.#initialData.onSetLang)) {
            this.#onSetLang = this.#initialData.onSetLang;
        }

        if (Helpers.isFunction(this.#initialData.onGetLang)) {
            this.#onGetLang = this.#initialData.onGetLang;
        }
    }

    // Set custom data attribute
    #setAttributeName() {
        this.#attributeName = this.#initialData.attributeName ?? ATTRIBUTE_NAME;
    }

    // Set initial language from languages
    #setInitialLanguage() {
        const userKeyLang =
            localStorage.getItem(STORAGE_KEY) ?? // from storage
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
            console.error(
                `Lieu | Language key "${langKey}" not found in languages!`
            );

            return;
        }

        this.#currentLanguage = newLanguage;
        localStorage.setItem(STORAGE_KEY, langKey);

        this.#localizeDomElems();

        this.#onSetLang(oldLanguage, newLanguage);
    }

    // Find all data-attributes by attributeName field in DOM, and localize them
    #localizeDomElems() {
        const $locales = Array.from(
            document.querySelectorAll(`[${this.#attributeName}]`)
        );

        $locales.forEach(($str) => {
            const localeAttributes = $str.getAttributeNames();
            let localeKey;
            let pluralNum;
            const interpolationObj = {};

            localeAttributes.forEach((attr) => {
                // If data-lieu-... attribute (or custom)
                if (attr.includes(this.#attributeName.toLowerCase())) {
                    const attributeValue = $str.getAttribute(attr);

                    // Set locale key, plural number and interpolation properties
                    if (attr === this.#attributeName) {
                        localeKey = attributeValue;
                    } else if (
                        attr.includes(PLURAL) &&
                        !isNaN(attributeValue)
                    ) {
                        pluralNum = Number(attributeValue);
                    } else {
                        const objKey = attr.replace(
                            `${this.#attributeName.toLowerCase()}-`,
                            ''
                        );

                        interpolationObj[objKey] = attributeValue;
                    }
                }
            });

            $str.innerHTML = this.trans(localeKey, interpolationObj, pluralNum);
        });
    }

    /**
     * Return value from currentLanguage.locales or null
     * @param localeKey<String>
     * @param arg1<String|Object> not required
     * @param arg2<String|Object> not required
     */
    trans(localeKey, arg1, arg2) {
        const { locales } = this.#currentLanguage;
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
                console.warn(
                    `Lieu | Locale key "${localeKey}" not found in current language!`
                );
            }
        }

        if (interpolationObj) {
            locale = locale.replace(
                /%\{(.*?)\}/g,
                (match, key) => interpolationObj[key] || match
            );
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
            console.error(
                `Lieu | Language key "${langKey}" not found in languages!`
            );

            return;
        }

        return this.#languages[langKey];
    }

    // Returns object of all languages
    getLangs() {
        return this.#languages;
    }
}
