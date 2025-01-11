import Setting from "~/server/api/model/setting";

export default eventHandler(async (e) => {
    try {
        const body = await readBody(e);
        const setting = await Setting.findOne({where: {type: e?.context?.params?.type}});
        if (setting) {
            await setting.update({value: body.value});
        } else {
            await Setting.create({type: e?.context?.params?.type, value: body.value.toString()});
        }
        return true;

    } catch (error) {
        return error
    }
})