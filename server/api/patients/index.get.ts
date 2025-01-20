import Patient from "~/server/api/model/patient";
import {Op} from "@sequelize/core";
import Prescription from "~/server/api/model/prescription";
import OrderSummary from "~/server/api/model/orderSummary";
import OrderDetail from "~/server/api/model/orderDetail";

export default eventHandler(async (e) => {
    try {
        let {q} = getQuery(e);
        q = q ? q : '';
        const patients = await Patient.findAll({
            where: {
                [Op.or]: [
                    {
                        firstName: {
                            [Op.like]: '%' + q + '%'
                        }
                    },
                    {
                        lastName: {
                            [Op.like]: '%' + q + '%'
                        }
                    }
                ]
            },
            include: [Prescription, OrderSummary]
        })
        patients.forEach(patient => {
            patient.prescriptions?.sort(function (a, b) {
                const dateA = new Date(a.rxDate), dateB = new Date(b.rxDate)
                return dateB - dateA
            });
        })

        return patients;

    } catch (error) {
        console.error(error);
        return error
    }
})