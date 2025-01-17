import {
    DataTypes,
    Model,
} from '@sequelize/core';
import sequelize from "~/server/api/service/db";
import Patient from "~/server/api/model/patient";

export interface OrderSummaryAttribute {
    id: number;
    patientId: number;
    prescriptionId: number;
    total: number;
    comments?: string;
}

class OrderSummary extends Model<OrderSummaryAttribute> implements OrderSummaryAttribute {
    public id!: number;
    public patientId!: number;
    public prescriptionId!: number;
    public total!: number;
    public comments!: string;
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
        comments: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'order_summary',
        timestamps: true,
    }
)

Patient.hasMany(OrderSummary)

export default OrderSummary;