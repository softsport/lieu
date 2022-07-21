/**
 * @jest-environment jsdom
 * @jest-environment-options {"url": "https://jestjs.io/"}
 */
import testDom from './test-dom';

beforeAll(() => {
    document.body.innerHTML = testDom();
})


