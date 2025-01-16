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
        orders: Order[];
    }

    export interface RX {
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

    export interface Order {
        productType: string;
        frame: string;
        lens: string;
        coating: string;
        tint: string;
        price: number;
        orderDate: string;
        description: string;
        tax: number;
    }
}

export {};