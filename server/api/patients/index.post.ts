import Patient from "~/server/api/model/patient";

export default eventHandler(async (e) => {
    try {
        const body = await readBody(e);
        delete body.id;
        const patient = await Patient.create(JSON.parse(body));
        return patient.id;
    } catch (error) {
        console.log(error)
        return error
    }
})
