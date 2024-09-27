import sequelize from "~/server/api/service/db";
import Patient from "~/server/api/model/patient";
import {Op} from "@sequelize/core";
import Prescription from "~/server/api/model/prescription";

export default eventHandler(async (e) => {
    try {
        let {q} = getQuery(e);
        q = q ? q : '';
        return await Patient.findAll({
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
            include: Prescription
        })

    } catch (error) {
        console.error(error);
        return error
    }
})
