const apiUrl = process.env.URL ? process.env.URL : 'http://localhost:3000/';

export const useSetting = () => {
    return {
        getTax: async () => {
            const res: any = await $fetch(`${apiUrl}api/settings/tax`);
            return parseFloat(res.value);
        },
        updateSettings: async (type: string, value: number | string) => {
            return await $fetch(`${apiUrl}api/settings/${type}`, {
                method: 'POST',
                body: JSON.stringify({value}),
            });
        },
        getSettings: async () => {
            return await $fetch(`${apiUrl}api/settings`);
        }
    }
}
