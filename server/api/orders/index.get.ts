import sequelize from "~/server/api/service/db";
import OrderDetail from "~/server/api/model/orderDetail";
import OrderSummary from "~/server/api/model/orderSummary";

export default eventHandler(async (e) => {
    try {
        const order = await OrderSummary.findByPk(e?.context?.params?.id);
        return order ?? {error: 'not found'};
    } catch (error) {
        return error
    }
})
