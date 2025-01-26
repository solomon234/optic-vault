import Patient from "~/server/api/model/patient";
import {Op} from "@sequelize/core";
import Prescription from "~/server/api/model/prescription";
import OrderSummary from "~/server/api/model/orderSummary";
import OrderDetail from "~/server/api/model/orderDetail";

export default eventHandler(async (e) => {
    try {
        let {q} = getQuery(e);
        q = q ? q : '';
        return await Patient.findAll({
            where: {
                [Op.or]: [
                    {
                        firstName: {
                            [Op.like]: '%' + q + '%'
                        }
                    },
                    {
                        lastName: {
                            [Op.like]: '%' + q + '%'
                        }
                    }
                ]
            },
            include: [
                Prescription,
                {
                    model: OrderSummary,
                    include: [OrderDetail]
                }
            ],
            order: [
                [Prescription, 'rxDate', 'DESC']
            ]
        })
    } catch (error) {
        console.error(error);
        return error
    }
})