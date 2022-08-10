/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */
import testDom from './test-dom';
import Lieu from '../dist/lieu';
import Helpers from '../src/core/helpers';
import { STORAGE_KEY, ATTRIBUTE_NAME } from '../src/core/const';

let initialData;
let lieu;

beforeEach(() => {
    localStorage.removeItem(STORAGE_KEY);

    document.body.innerHTML = testDom();

    initialData = {
        initialLanguage: 'ru',
        languages: {
            ru: {
                name: 'Русский',
                locales: {
                    Hello: 'Привет!',
                    Bye: 'Пока!',
                    HelloName: 'Привет %{name}, %{surname}!',
                    Apples: '{1}Одно яблоко|[2,5]Немного %{name}|{5,*}Очень много %{name}',
                },
            },
            en: {
                name: 'English',
                locales: {
                    Hello: 'Hello!',
                    Bye: 'Bye!',
                    HelloName: 'Hello %{name}, %{surname}!',
                    Apples: '{1}There is one apple|[2,5]There are some %{name}|{5,*}There are many %{name}',
                },
            },
        },
    };

    lieu = new Lieu(initialData);
});

test('Initialization with initial language and empty storage', () => {
    // Take all elems with attribute from DOM
    const elemsToLocalize = Array.from(
        document.querySelectorAll(`[${ATTRIBUTE_NAME}]`)
    );

    // Check for each elem to have correct text content after translation
    elemsToLocalize.forEach((elem) => {
        const elemAttrValue = elem.getAttribute(ATTRIBUTE_NAME);

        expect(elem.textContent).toBe(
            initialData.languages[initialData.initialLanguage].locales[
                elemAttrValue
            ]
        );
    });
});

test('Initialization with initial language and saved language in storage', () => {
    const initialLang = initialData.initialLanguage;
    const langsKeys = Object.keys(initialData.languages);

    // Find not initial language
    const langToSaveInStore = langsKeys.find((key) => key !== initialLang);

    localStorage.setItem(STORAGE_KEY, langToSaveInStore);

    // Initialize plugin after saving language in localStorage
    lieu = new Lieu(initialData);

    // Take all elems with attribute from DOM
    const elemsToLocalize = Array.from(
        document.querySelectorAll(`[${ATTRIBUTE_NAME}]`)
    );

    // Check for each elem to have correct text content after translation
    elemsToLocalize.forEach((elem) => {
        const elemAttrValue = elem.getAttribute(ATTRIBUTE_NAME);

        expect(elem.textContent).toBe(
            initialData.languages[langToSaveInStore].locales[elemAttrValue]
        );
    });
});

test('Get current language', () => {
    expect(typeof lieu.getLang()).toBe('object');
});

test('Get language by its key', () => {
    expect(lieu.getLang('en')).toBe(initialData.languages.en);
});

test('Initialization with custom data attribute', () => {
    const customAttribute = 'localize';

    document.body.innerHTML = testDom(customAttribute);

    initialData.attributeName = customAttribute;

    lieu = new Lieu(initialData);

    // Take all elems with attribute from DOM
    const elemsToLocalize = Array.from(
        document.querySelectorAll(`[${ATTRIBUTE_NAME}]`)
    );

    // Check for each elem to have correct text content after translation
    elemsToLocalize.forEach((elem) => {
        const elemAttrValue = elem.getAttribute(ATTRIBUTE_NAME);

        expect(elem.textContent).toBe(
            initialData.languages[initialData.initialLanguage].locales[
                elemAttrValue
            ]
        );
    });
});

test('String localize method', () => {
    const keyToLocalize = 'Bye';

    const keyFromInitialData = Object.keys(
        initialData.languages.en.locales
    ).find((key) => key === keyToLocalize);

    const localized = lieu.trans(keyFromInitialData);

    expect(localized).toBe(
        initialData.languages[initialData.initialLanguage].locales[
            keyToLocalize
        ]
    );
});

test('Text content of DOM elements after setLang method', () => {
    const initialLang = initialData.initialLanguage;
    const langsKeys = Object.keys(initialData.languages);
    const selectedLang = langsKeys.find((key) => key !== initialLang);

    lieu.setLang(selectedLang);

    // Take all elems with attribute from DOM
    const elemsToLocalize = Array.from(
        document.querySelectorAll(`[${ATTRIBUTE_NAME}]`)
    );

    // Check for each elem to have correct text content after translation
    elemsToLocalize.forEach((elem) => {
        const elemAttrValue = elem.getAttribute(ATTRIBUTE_NAME);

        expect(elem.textContent).toBe(
            initialData.languages[selectedLang].locales[elemAttrValue]
        );
    });
});

test('Current language after setLang method', () => {
    lieu.setLang('en');

    expect(lieu.getLang()).toBe(initialData.languages.en);
});

test('Hook onSetLang', () => {
    const hook = jest.fn();
    initialData.onSetLang = hook;

    lieu = new Lieu(initialData);
    lieu.setLang('en');

    expect(hook).toHaveBeenCalled();
});

test('Hook onGetLang', () => {
    const hook = jest.fn();
    initialData.onGetLang = hook;

    lieu = new Lieu(initialData);
    lieu.getLang();

    expect(hook).toHaveBeenCalled();
});

test('Get all languages', () => {
    expect(lieu.getLangs()).toBe(initialData.languages);
});

test('Current language storage save', () => {
    lieu.setLang('en');
    expect(localStorage.getItem(STORAGE_KEY)).toBe('en');
});

test('Change language asynchronously', () => {
    const initialLang = initialData.initialLanguage;
    const langsKeys = Object.keys(initialData.languages);
    const selectedLang = langsKeys.find((key) => key !== initialLang);

    lieu.setLang(selectedLang);

    setTimeout(() => {
        // Take all elems with attribute from DOM
        const elemsToLocalize = Array.from(
            document.querySelectorAll(`[${ATTRIBUTE_NAME}]`)
        );

        // Check for each elem to have correct text content after translation
        elemsToLocalize.forEach((elem) => {
            const elemAttrValue = elem.getAttribute(ATTRIBUTE_NAME);

            expect(elem.textContent).toBe(
                initialData.languages[selectedLang].locales[elemAttrValue]
            );
        });
    }, 1000);
});

test('Translate string with interpolation', () => {
    const options = {
        name: 'John',
        surname: 'Doe',
    };

    expect(lieu.trans('HelloName', options)).toBe(
        `Привет ${options.name}, ${options.surname}!`
    );
});

test('Initialization with browser language (without initial language and language saved in localStorage)', () => {
    // Remove intial lang from initial data
    initialData.initialLanguage = undefined;
    // Remove key from local storage
    localStorage.removeItem(STORAGE_KEY);

    // Create class without initial lang and lang in local storage
    lieu = new Lieu(initialData);

    const browserLang = Helpers.getBrowserLang();
    const langs = lieu.getLangs();
    const currentLang = lieu.getLang();

    // Compare name from browser lang in languages and currentLang name
    expect(langs[browserLang].name).toBe(currentLang.name);
});

describe('String pluralization:', () => {
    beforeEach(() => {
        lieu.setLang('en');
    });

    test('with {num} in string', () => {
        expect(lieu.trans('Apples', 1)).toBe('There is one apple');
    });

    test('with interpolation as the third argument and [num,num] in string', () => {
        expect(lieu.trans('Apples', 3, { name: 'apples' })).toBe(
            'There are some apples'
        );
    });

    test('with interpolation as the second argument', () => {
        expect(lieu.trans('Apples', { name: 'apples' }, 3)).toBe(
            'There are some apples'
        );
    });

    test('with {num,*} in string', () => {
        expect(lieu.trans('Apples', 30, { name: 'apples' })).toBe(
            'There are many apples'
        );
    });
});
