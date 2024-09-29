import sequelize from "~/server/api/service/db";
import Patient from "~/server/api/model/patient";

export default eventHandler(async (e) => {
    try {
        const patient = await Patient.findByPk(e?.context?.params?.id);
        return patient ?? {error: 'not found'};
    } catch (error) {
        return error
    }
})
