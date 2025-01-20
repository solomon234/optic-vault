import sequelize from "~/server/api/service/db";
import Prescription from "~/server/api/model/prescription";

export default eventHandler(async (e) => {
    try {
        const id = e?.context?.params?.id;
        const body = JSON.parse(await readBody(e));
        return await Prescription.create({
            ...body, patientId: id,
        });
    } catch (error) {
        return error
    }
})
