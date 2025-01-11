import Setting from "~/server/api/model/setting";

export default eventHandler(async () => {
    try {
        const setting = await Setting.findAll();
        return setting ?? {error: 'not found'};
    } catch (error) {
        return error
    }
})
