import db from '../models/index';

const getCartService = async (email) => {
    try {
        const data = await db.Carts.findAll({
            // attributes: ['idProduct', 'image', 'title', 'price','quantity'],
            attributes: ['idCart', 'product', 'numBuy'],
            where: { user: email },
            include: {
                model: db.Products,
                attributes: ['idProduct', 'image', 'title', 'price', 'category', 'idStore'],
                include: {
                    model: db.Stores,
                    attributes: ['storeName', 'addressStore'],
                    required: false
                },
                required: false
            },
            raw: true,
            nest: true
        });
        console.log(" (Controller) check data getCart1: ", data);
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

const reqBuyItem = async (email, data) => {
    try {
        let storage = await db.Products.findOne({
            attributes: ['idProduct', "quantity"],
            where: { idProduct: data.idProduct },
            raw: true,
            nest: true
        });
        if (Number(storage.quantity) < Number(data.numBuy)) {
            return {
                EM: `Chưa đặt hàng. Kho chỉ còn ${storage.quantity} sản phẩm`,
                EC: 3,
                DT: ""
            }
        }
        console.log("check dataInput", email, "data", data);

        // await db.Bills.create({
        //     email: email,
        //     idProduct: data.idProduct,
        //     title: data.title,
        //     numBuy: data.numBuy,
        //     price: data.price,
        //     totalPrice: data.totalPrice,
        // });
        await delInCartService(email, data.idCart);
        // await updateProduct(storage.quantity, data.numBuy, data.idProduct);
        return {
            EM: "Đặt hàng thành công sản phẩm",
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

const updateProduct = async (oldNumBuy, NumBuy, idProduct) => {
    try {
        let newNumBuy = Number(oldNumBuy) - Number(NumBuy);
        console.log('check data Update products, Old: ', oldNumBuy, "  new: ", NumBuy, "NewNumBuy: ", newNumBuy);
        await db.Products.update(
            {
                quantity: newNumBuy,
            },
            {
                where: {
                    idProduct: idProduct
                },
            }
        )
        console.log('check newest NumBuy:', newNumBuy);
        return {
            EM: "nhận thông tin Edit trong Service thành công",
            EC: 0,
            DT: ""
        };

    } catch (error) {
        return {
            EM: "error from Service",
            EC: -2,
            DT: ""
        }

    }
}

const getBillService = async (page, email) => {
    let limit = 5;
    let offset = (page - 1) * limit;
    // let data = [];
    try {
        // data = await db.Users.findAll({
        const { count, rows } = await db.Bills.findAndCountAll({
            attributes: ['idBill', 'idProduct', 'title', 'price', 'numBuy', 'totalPrice', 'email'],
            where: { email: email },
            include: {
                model: db.Products,
                attributes: ['image', 'brand', 'category']
            },
            col: 'idBill', // Chỉ định cột đếm
            offset: offset,
            limit: limit,
            raw: true,
            nest: true
        })
        const pages = Math.ceil(count / limit);
        const data = {
            totalRows: count,
            totalPages: pages,
            data: rows
        }
        console.log("check api page", data);
        return {
            EM: "Lấy thông tin thành công (CartService)",
            EC: 0,
            DT: data
        };
    } catch (err) {
        console.log(">>>>Lỗi: ", err);
        return {
            EM: "Lỗi Service apiCart",
            EC: -2,
            DT: ""
        }
    }
}

const deleteBillService = async (idBill) => {
    try {
        console.log("check dataInput id: ", idBill);
        await db.Bills.destroy({ where: { idBill: idBill } });
        return {
            EM: "Xóa thông tin thành công (CartService)",
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
    getCartService, addToCartService, delInCartService, reqBuyItem, getBillService, deleteBillService
}