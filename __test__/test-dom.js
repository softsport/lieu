function testDom(customAttr) {
    return `
        <p id="locale" ${customAttr || 'data-localize'}="Hello">Bonjour</p>
    `;
}

export default testDom;
