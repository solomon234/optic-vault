import {
    DataTypes,
    Model, NonAttribute,
} from '@sequelize/core';
import sequelize from "~/server/api/service/db";
import Prescription from "~/server/api/model/prescription";

interface PatientAttributes {
    id?: number;
    firstName: string;
    lastName: string;
    email?: string;
    birthDate: Date;
    phoneNumber: string;
    address?: string;
    fullName: string;
    fullNameAndAddress: string;
    prescription?: Prescription;
}

class Patient extends Model<PatientAttributes> implements PatientAttributes {
    public id!: number;
    public firstName!: string;
    public lastName!: string;
    public email!: string;
    public birthDate!: Date;
    public phoneNumber!: string;
    public address?: string;
    public Prescription?: Prescription;

    get fullName(): NonAttribute<string> {
        return this.firstName + " " + this.lastName;
    }

    get fullNameAndAddress(): NonAttribute<string> {
        return this.firstName + " " + this.lastName + this.address;
    }
}

Patient.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    firstName: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    lastName: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    birthDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    email: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    phoneNumber: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    address: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    fullName: {
        type: DataTypes.VIRTUAL,
        get() {
            // @ts-expect-error
            return `${this.firstName} ${this.lastName}`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullName` value!');
        },

    },
    fullNameAndAddress: {
        type: DataTypes.VIRTUAL,
        get() {
            // @ts-expect-error
            return `${this.firstName} ${this.lastName} (${this.address})`;
        },
        set(value) {
            throw new Error('Do not try to set the `fullNameAndAddress` value!');
        },

    }
}, {
    sequelize,
    tableName: 'patient',
    timestamps: true,
});

Patient.hasMany(Prescription)

export default Patient;