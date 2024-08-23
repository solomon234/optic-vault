import sequelize from "~/server/api/service/db";
import Patient from "~/server/api/model/patient";

export default eventHandler(async (e) => {
    try {
        return await Patient.destroy({
            where: {
                id: e?.context?.params?.id,
            },
        });
    }
    catch (error) {
        sequelize.close();
        return error
    }
})
