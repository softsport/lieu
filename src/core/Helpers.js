class Helpers {
    // Checks if passed data is object or not
    static isObject(data) {
        return typeof data === 'object';
    }

    /** Returns parsed from JSON object or null
    @param data<JSON>
    */
    static fromJson(data) {
        try {
            const languagesFromJson = JSON.parse(data);

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
