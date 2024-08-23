import sequelize from "~/server/api/service/db";
import Patient from "~/server/api/model/patient";

export default eventHandler(async (e) => {
    try {
        const body = await readBody(e);
        const patient = await Patient.findByPk(e?.context?.params?.id)
        return await Patient.update(
            { ...patient, ...body },
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
