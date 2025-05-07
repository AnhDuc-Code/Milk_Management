import apiProductService from "../service/apiProductService";
const getAPageOfProducts = async (req, res) => {
    try {
        if (req.query.page && req.query.filtered) {
            console.log("check Req with page and filter", req.query.page, req.query.filtered);
            const data = await apiProductService.getAPageProductsService(req.query.page, req.query.filtered);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
        if (req.query.page) {
            console.log("check req with page only", req.query.page, req.query.filtered);
            const data = await apiProductService.getAPageProductsService(req.query.page);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiProductsController...",
            EC: "-1",
            DT: ""
        });
    }
}
module.exports = {
    getAPageOfProducts
}
