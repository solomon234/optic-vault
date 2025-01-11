import Setting from "~/server/api/model/setting";

export default eventHandler(async (e) => {
    try {
        const setting = await Setting.findOne({where: {type: e?.context?.params?.type}});
        return setting ?? {error: 'not found'};
    } catch (error) {
        return error
    }
})
