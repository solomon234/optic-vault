import sequelize from "~/server/api/service/db";
import Prescription from "~/server/api/model/prescription";

export default eventHandler(async (e) => {
    try {
        const body = await readBody(e);
        return await Prescription.create({
            ...JSON.parse(body), patientId: e?.context?.params?.id,
        });
    } catch (error) {
        sequelize.close();
        return error
    }
})
