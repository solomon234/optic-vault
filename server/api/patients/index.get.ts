import sequelize from "~/server/api/service/db";
import Patient from "~/server/api/model/patient";

export default eventHandler(async () => {
    try {
        return await Patient.findAll();
    }
    catch (error) {
        sequelize.close();
        return error
    }
})
