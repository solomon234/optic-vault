import sequelize from "~/server/api/service/db";
import Prescription from "~/server/api/model/prescription";

export default eventHandler(async (e) => {
    try {
        return await Prescription.destroy({
            where: {
                id: e?.context?.params?.id,
            },
        });
    } catch (error) {
        return error
    }
})
