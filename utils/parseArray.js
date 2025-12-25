export const parseArray = (value) => {
    if (!value) return [];

    // Already an array
    if (Array.isArray(value)) return value;

    try {
        return JSON.parse(value);
    } catch (err) {
        return [];
    }
};
