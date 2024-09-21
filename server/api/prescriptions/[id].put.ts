import sequelize from "~/server/api/service/db";
import Prescription from "~/server/api/model/prescription";

export default eventHandler(async (e) => {
    try {
        const body = await readBody(e);
        const prescription = await Prescription.findByPk(e?.context?.params?.id)
        return await Prescription.update(
            { ...prescription, ...body },
            {
                where: {
                    id: e?.context?.params?.id,
                },
            },
        );
    }
    catch (error) {
        sequelize.close();
        return error
    }
})
