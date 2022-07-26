/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */
import testDom from './test-dom';
import Lieu from '../dist/lieu.es';
import { STORAGE_KEY, ATTRIBUTE_NAME } from '../src/core/const';

let initialData;
let lieu;

beforeEach(() => {
    document.body.innerHTML = testDom();

    initialData = {
        initialLanguage: 'ru',
        languages: {
            ru: {
                name: 'Русский',
                locales: {
                    Hello: 'Привет!',
                    Bye: 'Пока!',
                },
            },
            en: {
                name: 'English',
                locales: {
                    Hello: 'Hello!',
                    Bye: 'Bye!',
                },
            },
        },
    };

    lieu = new Lieu(initialData);
});

test('Initialization with initial language', () => {
    // Take all elems with attribute from DOM
    const elemsToLocalize = Array.from(
        document.querySelectorAll(`[${ATTRIBUTE_NAME}]`)
    );

    // Check for each elem to have correct text content after translation
    elemsToLocalize.forEach((elem) => {
        const elemAttrValue = elem.getAttribute(ATTRIBUTE_NAME);

        expect(elem.textContent).toBe(
            initialData.languages[initialData.initialLanguage].locales[elemAttrValue]
        );
    })

});

test('Initialization without initial language', () => {
    initialData.initialLanguage = undefined;
    lieu = new Lieu(initialData);

    expect(typeof lieu.getLang()).toBe('object');
});

test('Get current language', () => {
    expect(lieu.getLang()).toBe(
        initialData.languages[initialData.initialLanguage]
    );
});

test('Get initial language', () => {
    expect(lieu.getInitialLang()).toBe(
        initialData.initialLanguage
    );
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
            initialData.languages[initialData.initialLanguage].locales[elemAttrValue]
        );
    })
});

test('String localize method', () => {
    const keyToLocalize = 'Bye';

    const keyFromInitialData = Object.keys(
        initialData.languages.en.locales
    ).find((key) => key === keyToLocalize);

    const localized = lieu.localize(keyFromInitialData);

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
    })
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

test('Get browserLang method', () => {
    expect(typeof lieu.getBrowserLang()).toBe('string');
});

test('Get all languages', () => {
    expect(lieu.getLangs()).toBe(initialData.languages);
});

test('Current language storage save', () => {
    expect(window.localStorage.getItem(STORAGE_KEY)).toBe(
        initialData.initialLanguage
    );
});
