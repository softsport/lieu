class Helpers {
    // Checks if passed object is object or not
    static isObject(obj) {
        return typeof obj === 'object';
    }

    // Checks if passed object is funcion or not
    static isFunction(func) {
        return typeof func === 'function';
    }

    // Returns parsed from JSON object or null
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

    // Return browser language
    static getBrowserLang() {
        return navigator.language.slice(0, 2);
    }

    // Check key existing in object
    static hasKey(key, obj) {
        return Object.keys(obj).indexOf(key) !== -1;
    }

    // Split string by delimiter, returns array<String>
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

                const resultNumbers = [];

                // Remove array/obj brackets and split string by comma
                resultNumbers.push(
                    ...result[0].replace(/[[{]|[\]}]/g, '').split(',')
                );

                // Check if matched plural count more or equal passed count
                if (resultNumbers.length >= 2) {
                    if (resultNumbers[1] === '*' && count >= resultNumbers[0]) {
                        locale = subString.replace(regex, '');

                        break;
                    } else if (
                        resultNumbers[0] <= count &&
                        resultNumbers[1] >= count
                    ) {
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

export default Helpers;
