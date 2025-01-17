import OrderSummary from "~/server/api/model/orderSummary";
import OrderDetail from "~/server/api/model/orderDetail";

export default eventHandler(async (e) => {
    try {
        const body = JSON.parse(await readBody(e));
        console.log(body)
        const orderSummaryBody = {
            patientId: body.patientId,
            prescriptionId: body.prescriptionId,
            total: body.total,
        }
        const orderSummary = await OrderSummary.create(orderSummaryBody);
        const orderDetailBody = body.orderDetails.map((e: any) => {
            return {orderSummaryId: orderSummary.id, ...e}
        });
        await OrderDetail.bulkCreate(orderDetailBody);
        return true
    } catch (error) {
        console.log(error)
        return error
    }
})
