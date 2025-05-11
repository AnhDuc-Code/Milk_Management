import apiProductService from "../service/apiProductService";
const homeProducts = async (req, res) => {
    try {
        if (req.query.page && req.query.filtered) {
            console.log("check Req with page and filter", req.query.page, req.query.filtered);
            const data = await apiProductService.pageProductsFiltered(req.query.page, req.query.filtered);
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

const createProductWithImg = async (req, res) => {
    try {
        const { title, price, description } = req.body;
        const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

        const result = await apiProductService.createProductService({
            title,
            price,
            description,
            image: imagePath
        });

        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: result.DT
        });
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server khi tạo sản phẩm...",
            EC: "-1",
            DT: ""
        });
    }
};

const getUserProducts = async (req, res) => {
    try {
        if (req.user && req.user.email && req.user.email.email) {
            let data = await apiProductService.userProductSerice(req.user.email.email);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
        else {
            return res.status(403).json({
                EM: "Không tìm thấy người dùng",
                EC: "-1",
                DT: ""
            })
        }

    } catch (error) {
        console.log(error)
    }
}

module.exports = {
    homeProducts, createProductWithImg, getUserProducts
}
