const apiUrl = process.env.URL ? process.env.URL : 'http://localhost:3000/';

export const usePatient = () => {
    return {
        // Patient
        getPatient: async () => {
            return await $fetch(`${apiUrl}/api/patients`);
        },
        getPatients: async (params: any = '') => {
            return await $fetch(`${apiUrl}api/patients`, params) as Patient[];
        },
        updatePatient: async (type: string, value: Patient) => {
            return await $fetch(`${apiUrl}api/patients/${type}`, {
                method: 'PUT',
                body: value,
            });
        },
        deletePatient: async (id: string) => {
            return await $fetch(`${apiUrl}api/patients/${id}`, {
                method: 'DELETE',
            });
        },
        addPatient: async (patient: any) => {
            return await $fetch(`${apiUrl}api/patients`, {
                method: 'POST',
                body: patient,
            }) as number;
        },
        //Patient RX
        deleteRX: async (id: string) => {
            return await $fetch(`${apiUrl}api/prescriptions/${id}`, {
                method: 'DELETE',
            });
        },
        updateRX: async (rx: any) => {
            return await $fetch(`${apiUrl}api/prescriptions`, {
                method: 'PUT',
                body: rx,
            })
        },
        addRX: async (id: int, rx: any) => {
            return await $fetch(`${apiUrl}api/prescriptions/${id}`, {
                method: 'POST',
                body: rx,
            });
        },
        // Orders
        addOrders: async (orders: any) => {
            return await $fetch(`${apiUrl}api/orders`, {
                method: 'POST',
                body: orders,
            });
        },
        getOrderDetails: async (id: string) => {
            return await $fetch(`${apiUrl}api/orders/${id}`);
        }
    }
}
