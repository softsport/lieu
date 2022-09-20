import { ATTRIBUTE_NAME } from '../src/core/const';

function testDom(customAttr) {
    const attr = customAttr || ATTRIBUTE_NAME;

    return `
        <h1 ${attr}="Bye">Au revoir</h1>
        <p ${attr}="Hello">Bonjour</p>
        <a href="#" ${attr}="Bye">Au revoir</a>
        <span ${attr}="Hello"></span>
    `;
}

function interpolationTestDom(customAttr) {
    const attr = customAttr || ATTRIBUTE_NAME;

    return `
        <h1 ${attr}="HelloName" ${attr}-name="John" ${attr}-surname="Doe"></h1>
        <span ${attr}="Apples" ${attr}-name="apples" ${attr}-plural="4"></span>
        <span ${attr}="Apples" ${attr}-name="oranges" ${attr}-plural="6"></span>
    `;
}

export { testDom, interpolationTestDom };
