declare global {
    export interface Patient {
        id: number;
        hasPrism: boolean;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        address: string;
        birthDate: string;
        rx: RX;
        orders: OrderDetail[];
    }

    export interface RX {
        id: number;
        osSphere: string | undefined;
        osCylinder: string | undefined;
        osAxis: number | undefined;
        osPrism: number | undefined;
        osBase: string | undefined;
        osAdd: string | undefined;
        osPD: number | undefined;
        odSphere: string | undefined;
        odCylinder: string | undefined;
        odAxis: number | undefined;
        odPrism: number | undefined;
        odBase: string | undefined;
        odAdd: string | undefined;
        odPD: number | undefined;
        rxDate: string;
        comments: string;
    }

    export interface OrderDetail {
        id: number;
        orderId: number;
        productType: string;
        frame: string;
        lens: string;
        price: number;
        description: string;
        tax: number;
    }

    export interface OrderSummary {
        id: number;
        patientId: number;
        prescriptionId: number;
        total: number;
        comments: string;
        createdDate: string;
    }
}

export {};