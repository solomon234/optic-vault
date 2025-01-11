import {
    DataTypes,
    Model,
} from '@sequelize/core';
import sequelize from "~/server/api/service/db";

interface SettingAttributes {
    id?: number;
    type: string;
    value: string;
}

class Setting extends Model<SettingAttributes> implements SettingAttributes {
    public id!: number;
    public type!: string;
    public value!: string;
}

Setting.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    type: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    value: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
}, {
    sequelize,
    modelName: 'Setting',
    tableName: 'setting',
    timestamps: true,
})

export default Setting;