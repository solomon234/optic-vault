import {
  DataTypes,
  Model,

} from '@sequelize/core';
import sequelize from '../service/db';

interface PatientAttributes {
    id?: number;
    first_name: string;
    last_name: string;
    // birth_date: Date;
    phone_number: string;
    address?: string;
}

class Patient extends Model<PatientAttributes> implements PatientAttributes {
    public id!: number;
    public first_name!: string;
    public last_name!: string;
    // public birth_date!: Date;
    public phone_number!: string;
    public address?: string;
}

Patient.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    first_name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    last_name: {
        type: new DataTypes.STRING(128),
        allowNull: false,
    },
    // birth_date: {
    //     type: DataTypes.DATE,
    //     allowNull: false,
    // },
    phone_number: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    },
    address: {
        type: new DataTypes.STRING(128),
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'patient',
    timestamps: true,
});

export default Patient;