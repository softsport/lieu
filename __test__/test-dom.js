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

export default testDom;
