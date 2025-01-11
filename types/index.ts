import type {decimal} from "vscode-languageserver-types";

declare global {
    export class Patient {
        id: 0;
        hasPrism: false;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        address: string;
        birthDate: Date | string;
        rx: RX;
        orders: Order[];
    }

    interface RX {
        osSphere: string | undefined
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
        rxDate: Date | string;
        comments: string;
    }

    interface Order {
        productType: string;
        frame: string;
        lens: string;
        coating: string;
        tint: string;
        price: number;
        orderDate: Date | string;
        description: string;
        tax: decimal;
    }
}