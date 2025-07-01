import apiCartService from "../service/apiCartService";
const getCart = async (req, res) => {
    try {
        if (req.user?.email?.email) {
            const data = await apiCartService.getCartService(req.user.email.email);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
        // if (req.query.page) {
        //     console.log("check req with page only", req.query.page, req.query.filtered);
        //     const data = await apiProductService.getAPageProductsService(req.query.page);
        //     return res.status(200).json({
        //         EM: data.EM,
        //         EC: data.EC,
        //         DT: data.DT
        //     })
        // }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiCartController...",
            EC: "-1",
            DT: ""
        });
    }
}

const addToCart = async (req, res) => {
    try {
        console.log("check req.body", req.body);
        if (req.body && req.body.idProduct && req.body.numBuy && req.user?.email?.email) {
            console.log("check req.user", req.user);
            const data = await apiCartService.addToCartService(req.user.email.email, req.body.idProduct, req.body.numBuy);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiCartController...",
            EC: -1,
            DT: ""
        });
    }
}

const buyItem = async (req, res) => {
    try {
        console.log("(cartController) check req.body: ", req.body)
        if (req.body && req.body.idProduct === null) {
            return res.status(200).json({
                EM: "Sản phẩm thanh toán đã bị xóa. Vui lòng bỏ sản phẩm.",
                EC: -1,
                DT: ""
            })
        }
        if (req.user?.email?.email) {
            const data = await apiCartService.reqBuyItem(req.user.idUser, req.user.email.email, req.body);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiCartController...",
            EC: -1,
            DT: ""
        });
    }
}

const deleteInCart = async (req, res) => {
    try {
        console.log("check req.body", req.body);
        if (req.body && req.user?.email?.email) {
            console.log("check req.user", req.user);
            const data = await apiCartService.delInCartService(req.user.email.email, req.body.idCart);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiCartController...",
            EC: -1,
            DT: ""
        });
    }
}

// const createProductWithImg = async (req, res) => {
//     try {
//         console.log("chekc req.file", req.file);
//         console.log("chekc req.body", req.body);
//         const email = req.user.email.email;
//         console.log("check req.user", req.user);
//         const { title, price, description, category, brand, quantity } = req.body;
//         const imagePath = req.file ? `/uploads/products/${req.file.filename}` : null;

//         const result = await apiProductService.createProductService({ title, price, description, imagePath, category, brand, quantity, email });

//         return res.status(200).json({
//             EM: result.EM,
//             EC: result.EC,
//             DT: result.DT
//         });
//     } catch (error) {
//         console.log("check lỗi ", error)
//         return res.status(500).json({
//             EM: "Lỗi server khi tạo sản phẩm...",
//             EC: "-1",
//             DT: ""
//         });
//     }
// };

// const getUserProducts = async (req, res) => {
//     try {
//         if (req.user?.email?.email) {
//             let data = await apiProductService.userProductSerice(req.user.email.email);
//             return res.status(200).json({
//                 EM: data.EM,
//                 EC: data.EC,
//                 DT: data.DT
//             })
//         }
//         else {
//             return res.status(403).json({
//                 EM: "Không tìm thấy người dùng",
//                 EC: "-1",
//                 DT: ""
//             })
//         }

//     } catch (error) {
//         console.log(error)
//     }
// }

const getBill = async (req, res) => {
    try {
        console.log("check page getBill Controller", req.query);
        if (req.query.page && req.user.email && req.user.email.email) {
            const data = await apiCartService.getBillService(req.query.page, req.user.email.email);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiCartController...",
            EC: "-1",
            DT: ""
        });
    }
}

const deleteBill = async (req, res) => {
    try {
        if (!req.body.idBill) {
            return res.status(200).json({
                EM: "Thiếu thông tin",
                EC: 1,
                DT: ""
            })
        }
        let data = await apiCartService.deleteBillService(req.body.idBill);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiCartController...",
            EC: "-1",
            DT: ""
        });
    }
}

const getOrder = async (req, res) => {
    try {
        console.log("check page getOrder Controller", req.query);
        if (req.query.page && req.user.idUser) {
            const data = await apiCartService.getOrderService(req.query.page, req.user.idUser);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiCartController...",
            EC: "-1",
            DT: ""
        });
    }
}

const getGuestOrder = async (req, res) => {
    try {
        console.log("check page getOrder Controller", req.query);
        if (req.query.page && req.user.idUser) {
            const data = await apiCartService.getGuestOrderService(req.query.page, req.user.idUser);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiCartController...",
            EC: "-1",
            DT: ""
        });
    }
}

const deleteOrder = async (req, res) => {
    try {
        console.log("check Controller del Order req.body", req.body);
        if (req.body && req.user.idUser) {
            console.log("check req.user", req.user);
            const data = await apiCartService.delOrderService(req.user.idUser, req.body.idOrder);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiCartController...",
            EC: -1,
            DT: ""
        });
    }
}

module.exports = {
    getCart, addToCart, deleteInCart, buyItem, getBill, deleteBill,
    getOrder, deleteOrder,
    getGuestOrder
    // createProductWithImg, getUserProducts
}
