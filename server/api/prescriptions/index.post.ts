import sequelize from "~/server/api/service/db";
import Prescription from "~/server/api/model/prescription";

export default eventHandler(async (e) => {
    try {
        const body = await readBody(e);
        return await Prescription.create({
            ...body
        });
    }
    catch (error) {
        sequelize.close();
        return error
    }
})
