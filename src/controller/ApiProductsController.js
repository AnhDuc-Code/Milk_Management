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
        if (req.query.page && req.query.search) {
            console.log("check Req with page and filter", req.query.page, req.query.search);
            const data = await apiProductService.pageProductsSearch(req.query.page, req.query.search);
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
        console.log("chekc req.file", req.file);
        console.log("chekc req.body", req.body);
        const email = req.user.email.email;
        console.log("check req.user", req.user);
        const { title, price, description, category, brand, quantity } = req.body;
        const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

        const result = await apiProductService.createProductService({ title, price, description, imagePath, category, brand, quantity, email });

        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: result.DT
        });
    } catch (error) {
        console.log("check lỗi ", error)
        return res.status(500).json({
            EM: "Lỗi server khi tạo sản phẩm...",
            EC: "-1",
            DT: ""
        });
    }
};
const updateProduct = async (req, res) => {
    try {
        console.log("chekc req.file", req.file);
        console.log("chekc req.body", req.body);
        const email = req.user.email.email;
        console.log("check req.user", req.user);
        let { idProduct, title, price, description, category, brand, quantity } = req.body;
        let imagePath = req.body.image;
        if (req.file) {
            imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;
        }
        let result = await apiProductService.updateProductService({ idProduct, title, price, description, imagePath, category, brand, quantity, email });
        return res.status(200).json({
            EM: result.EM,
            EC: result.EC,
            DT: result.DT
        });
    } catch (error) {
        console.log("check lỗi ", error)
        return res.status(500).json({
            EM: "Lỗi server khi tạo sản phẩm...",
            EC: "-1",
            DT: ""
        });
    }
};

const getUserProducts = async (req, res) => {
    try {
        if (req.user?.email?.email) {
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
        console.log(error);
        return res.status(500).json({
            EM: "Lỗi apiProductController",
            EC: "-1",
            DT: ""
        })
    }
}
const deleteProductSeller = async (req, res) => {
    try {
        if (req.body && req.user?.email?.email) {
            const data = await apiProductService.deleteProduct(req.body.idProduct);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiProductController...",
            EC: "-1",
            DT: ""
        });
    }
}
module.exports = {
    homeProducts, createProductWithImg, updateProduct, getUserProducts, deleteProductSeller
}
