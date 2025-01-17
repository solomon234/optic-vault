import {
    DataTypes,
    Model,
} from '@sequelize/core';
import sequelize from "~/server/api/service/db";
import OrderSummary from "~/server/api/model/orderSummary";

export interface OrderDetailAttribute {
    id: number;
    orderId: number;
    productType: string;
    frame: string;
    lens: string;
    price: number;
    description: string;
    tax: number;
}

class OrderDetail extends Model<OrderDetailAttribute> implements OrderDetailAttribute {
    public id!: number;
    public orderId!: number;
    public productType!: string;
    public frame!: string;
    public lens!: string;
    public price!: number;
    public description!: string;
    public tax!: number;
}

OrderDetail.init(
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
        },
        orderId: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        productType: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        frame: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        lens: {
            type: DataTypes.STRING(128),
            allowNull: false,
        },
        price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        description: {
            type: DataTypes.STRING(255),
            allowNull: true,
        },
        tax: {
            type: DataTypes.DOUBLE,
            allowNull: true,
        },
    },
    {
        sequelize,
        tableName: 'order_detail',
        timestamps: true,
    }
)
OrderSummary.hasMany(OrderDetail)

export default OrderDetail;