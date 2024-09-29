import {
    DataTypes, ForeignKey,
    Model
} from "@sequelize/core";
import sequelize from "~/server/api/service/db";
import Patient from "~/server/api/model/patient";

interface PrescriptionAttributes {
    id: number;
    patientId: number;
    osSphere: string;
    osCylinder: string;
    osAxis: number;
    osPrism: number;
    osBase: string;
    odSphere: string;
    odCylinder: string;
    odAxis: number;
    odPrism: number;
    odBase: string;
    rxDate: Date;
    comment: string;
}

class Prescription extends Model<Prescription> implements PrescriptionAttributes {
    public id!: number;
    public patientId!: ForeignKey<Patient['id']>;
    public osSphere!: string;
    public osCylinder!: string;
    public osAxis!: number;
    public osPrism!: number;
    public osBase!: string;
    public odSphere!: string;
    public odCylinder!: string;
    public odAxis!: number;
    public odPrism!: number;
    public odBase!: string;
    public rxDate!: Date;
    public comment!: string;
}

Prescription.init({
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    osSphere: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    osCylinder: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    osAxis: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    osPrism: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    osBase: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    osPD: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    osAdd: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    odSphere: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    odCylinder: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    odAxis: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    odPrism: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    odBase: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    odPD: {
        type: DataTypes.INTEGER,
        allowNull: true,
    },
    odAdd: {
        type: DataTypes.STRING(128),
        allowNull: true,
    },
    rxDate: {
        type: DataTypes.DATE,
        allowNull: true,
    },
    comments: {
        type: DataTypes.STRING(256),
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'prescription',
    timestamps: true
})

export default Prescription;