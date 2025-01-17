export const useUtils = () => {
    return {
        generateAddValues(min: number, max: number, step: number) {
            const values = [''];
            for (let i = min; i <= max; i += step) {
                values.push(i > 0 ? '+' + i.toFixed(2).toString() : i.toFixed(2).toString()); // Ensure the value has two decimal places
            }
            return values;
        }
    }
}