import sequelize from "~/server/api/service/db";
import Prescription from "~/server/api/model/prescription";

export default eventHandler(async (e) => {
    try {
        const prescription = await Prescription.findByPk(e?.context?.params?.id);
        return prescription ?? {error: 'not found'};
    } catch (error) {
        return error
    }
})
