class Utils {
    static isObject(data) {
        return typeof data === 'object';
    }

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

export default Utils;
