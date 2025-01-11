const apiUrl = 'http://localhost:3000/api';

export const useSetting = () => {
    return {
        getTax: async () => {
            return await $fetch(`${apiUrl}/settings/tax`);
        },
        updateSettings: async (type: string, value: number | string) => {
            return await $fetch(`${apiUrl}/settings/${type}`, {
                method: 'POST',
                body: JSON.stringify({value}),
            });
        },
        getSettings: async () => {
            return await $fetch(`${apiUrl}/settings`);
        }
    }
}
