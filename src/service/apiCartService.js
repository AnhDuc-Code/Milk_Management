import db from '../models/index';

const getCartService = async (email) => {
    try {
        const data = await db.Carts.findAll({
            // attributes: ['idProduct', 'image', 'title', 'price','quantity'],
            attributes: ['idCart', 'product', "numBuy"],
            where: { user: email },
            include: {
                model: db.Products,
                attributes: ['idProduct', "image", "title", "price", "category"],
            },
            raw: true,
            nest: true
        })
        return {
            EM: "Lấy thông tin giỏ hàng của user thành công",
            EC: 0,
            DT: data
        }
    } catch (error) {
        console.log("Lỗi Service apiCart", error);
    }
}

const addToCartService = async (email, idProduct, numBuy) => {
    try {
        console.log("check dataInput", email, "id", idProduct, "numBuy", numBuy);
        let a = await db.Carts.create({ user: email, product: idProduct, numBuy: numBuy });
        return {
            EM: "Đã thêm sản phẩm vào giỏ hàng",
            EC: 0,
            DT: ""
        }
    } catch (error) {
        console.log("lỗi Service apiCart", error);
        return {
            EM: "Lỗi Service apiCart",
            EC: -2,
            DT: ""
        }
    }
}
const delInCartService = async (email, idCart) => {
    try {
        console.log("check dataInput", email, "id", idCart);
        await db.Carts.destroy({ where: { idCart: idCart } });
        return {
            EM: "Xóa thông tin thành công (service page)",
            EC: 0,
            DT: ""
        }
    } catch (error) {
        console.log("lỗi Service apiCart", error);
        return {
            EM: "Lỗi Service apiCart",
            EC: -2,
            DT: ""
        }
    }
}

module.exports = {
    getCartService, addToCartService, delInCartService
}