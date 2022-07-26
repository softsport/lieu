class Helpers {
    // Checks if passed object is object or not
    static isObject(obj) {
        return typeof obj === 'object';
    }

    // Checks if passed object is funcion or not
    static isFunction(obj) {
        return typeof obj === 'function';
    }

    /** Returns parsed from JSON object or null
    @param obj<JSON>
    */
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
}

export default Helpers;
