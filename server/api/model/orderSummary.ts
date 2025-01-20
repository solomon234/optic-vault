import {
    DataTypes, ForeignKey,
    Model,
} from '@sequelize/core';
import sequelize from "~/server/api/service/db";
import Patient from "~/server/api/model/patient";
import OrderDetail from "~/server/api/model/orderDetail";
import Prescription from "~/server/api/model/prescription";

export interface OrderSummaryAttribute {
    id: number;
    patientId: number;
    prescriptionId: number;
    total: number;
}

class OrderSummary extends Model<OrderSummaryAttribute> implements OrderSummaryAttribute {
    public id!: number;
    public patientId!: ForeignKey<Patient['id']>;
    public prescriptionId!: ForeignKey<Prescription['id']>;
    public total!: number;
    public orderDetails?: OrderDetail[];
}

OrderSummary.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        patientId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        prescriptionId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        total: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
    },
    {
        sequelize,
        tableName: 'order_summary',
        timestamps: true,
    }
)

export default OrderSummary;