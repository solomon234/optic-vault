import sequelize from "~/server/api/service/db";
import Prescription from "~/server/api/model/prescription";

export default eventHandler(async (e) => {
    try {
        const body = await readBody(e);
        return await Prescription.update(
            {...body},
            {
                where: {
                    id: e?.context?.params?.id,
                },
            },
        );
    } catch (error) {
        return error
    }
})
