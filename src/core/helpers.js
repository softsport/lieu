const helpers = {
    // Checks if passed object is object or not
    isObject: (obj) => {
        return typeof obj === 'object';
    },

    // Checks if passed object is funcion or not
    isFunction: (func) => {
        return typeof func === 'function';
    },

    // Returns parsed from JSON object or null
    fromJson: (obj) => {
        try {
            const languagesFromJson = JSON.parse(obj);

            if (typeof languagesFromJson === 'object') {
                return languagesFromJson;
            } else {
                return null;
            }
        } catch {
            return null;
        }
    },

    // Return browser language
    getBrowserLang: () => {
        return navigator.language.slice(0, 2);
    },

    // Check key existing in object
    hasKey: (key, obj) => {
        return Object.keys(obj).indexOf(key) !== -1;
    },
};

export default helpers;
