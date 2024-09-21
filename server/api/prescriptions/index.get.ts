import sequelize from "~/server/api/service/db";
import Prescription from "~/server/api/model/prescription";
import {Op} from "@sequelize/core";

export default eventHandler(async (e) => {
    try {
        const body = await readBody(e);
        return await Prescription.findAll({
                where: {
                    patientId: {
                        [Op.eq]: body.patientId
                    }
                }
            }
        );
    }
    catch (error) {
        sequelize.close();
        return error
    }
})
