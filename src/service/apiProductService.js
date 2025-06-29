import db from '../models/index';
const { Op } = require("sequelize");
const getAPageProductsService = async (page) => {
    let limit = 10;
    let offset = (page - 1) * limit;
    // let data = [];
    try {
        // data = await db.Users.findAll({
        const { count, rows } = await db.Products.findAndCountAll({
            attributes: ['idProduct', "title", 'image', 'description', 'price', 'brand', 'category', 'quantity'],
            // include: {
            //     model: db.Roles,
            //     attributes: ['roleName']
            // },
            col: 'idProduct', // Chỉ định cột đếm
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
        return {
            EM: "Lấy thông tin thành công (service page)",
            EC: 0,
            DT: data
        };
    } catch (err) {
        console.log(">>>>Lỗi: ", err);
        return {
            EM: "error from Service",
            EC: -2,
            DT: {}
        }
    }
}
const pageProductsFiltered = async (page, filter) => {
    let limit = 10;
    let offset = (page - 1) * limit;
    // let data = [];
    try {
        // data = await db.Users.findAll({
        const { count, rows } = await db.Products.findAndCountAll({
            attributes: ['idProduct', "title", 'image', 'description', 'price', 'brand', 'category', 'quantity'],
            where: { category: filter },
            // include: {
            //     model: db.Roles,
            //     attributes: ['roleName']
            // },
            col: 'idProduct', // Chỉ định cột đếm
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
        return {
            EM: "Lấy thông tin thành công filter (service page)",
            EC: 0,
            DT: data
        };
    } catch (err) {
        console.log(">>>>Lỗi: ", err);
        return {
            EM: "error from Service",
            EC: -2,
            DT: ""
        }
    }
}

const pageProductsSearch = async (page, search) => {
    let limit = 10;
    let offset = (page - 1) * limit;
    // let data = [];
    try {
        // data = await db.Users.findAll({
        const { count, rows } = await db.Products.findAndCountAll({
            attributes: ['idProduct', "title", 'image', 'description', 'price', 'brand', 'category', 'quantity'],
            where: {
                title: {
                    [Op.like]: `%${search}%`
                }
            },
            // include: {
            //     model: db.Roles,
            //     attributes: ['roleName']
            // },
            col: 'idProduct', // Chỉ định cột đếm
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
        return {
            EM: "Lấy thông tin thành công filter (service page)",
            EC: 0,
            DT: data
        };
    } catch (err) {
        console.log(">>>>Lỗi: ", err);
        return {
            EM: "error from Service",
            EC: -2,
            DT: ""
        }
    }
}

const getProductDetailService = async (idProduct) => {
    try {
        let data = await db.Products.findOne({
            attributes: ["idProduct", "image", "title", "price", "description", "brand", "category", "quantity"],
            where: { idProduct: idProduct },
            include: {
                model: db.Stores,
                attributes: ['storeName', 'addressStore']
            },
            raw: true,
            nest: true
        })
        console.log("check productD:", data)
        if (data) {
            return {
                EM: "Lấy thông tin chi tiết sản phẩm thành công",
                EC: 0,
                DT: data
            };
        } else {
            return {
                EM: "Không tồn tại sản phẩm cần tìm",
                EC: 0,
                DT: ""
            };
        }

    } catch (error) {
        return {
            EM: "error from Service",
            EC: -2,
            DT: ""
        }
    }
}

const createProductService = async ({ title, price, description, imagePath, category, brand, quantity, idUser }) => {
    try {
        await db.Products.create({ title, price, description: description, image: imagePath, category: category, brand: brand, quantity: quantity, idStore: idUser });
        return {
            EM: "Thêm sản phẩm thành công service",
            EC: 0,
            DT: ""
        };
    } catch (error) {
        return {
            EM: "Lỗi khi thêm sản phẩm vào CSDL",
            EC: -1,
            DT: ""
        };
    }
};

const updateProductService = async ({ idProduct, title, price, description, imagePath, category, brand, quantity, idUser }) => {
    try {
        await db.Products.update({ title, price, description: description, image: imagePath, category: category, brand: brand, quantity: quantity },
            {
                where: {
                    idStore: idUser,
                    idProduct: idProduct
                }
            }
        );
        return {
            EM: "Sửa sản phẩm thành công service",
            EC: 0,
            DT: ""
        };
    } catch (error) {
        return {
            EM: "Lỗi khi thêm sản phẩm vào CSDL",
            EC: -1,
            DT: ""
        };
    }
};

const userProductSerice = async (idStore) => {
    console.log("check Email", idStore);
    try {
        const data = await db.Products.findAll({
            attributes: ['idProduct', 'image', 'title', 'description', 'price', 'brand', 'category', 'quantity', "idStore"],
            where: { idStore: idStore },
            include: {
                model: db.Stores,
                attributes: ['storeName', 'addressStore']
            },
            raw: true,
            nest: true
        })
        console.log('check dataa', data);

        return {
            EM: "Lấy thông tin sản phẩm của user thành công",
            EC: 0,
            DT: data
        }
    } catch (error) {
        console.log("Lỗi apiProductService", error);
        return {
            EM: "Lỗi khi đọc sản phẩm apiProductService",
            EC: -1,
            DT: ""
        };
    }
}

const deleteProduct = async (idProduct) => {
    try {
        await db.Products.destroy({
            where: { idProduct: idProduct }
        })
        return {
            EM: "Xóa Sản phẩm thành công",
            EC: 0,
            DT: ""
        }
    }


    catch (error) {
        console.log("Lỗi apiProductService", error);
        return {
            EM: "Lỗi khi xóa sản phẩm apiProductService",
            EC: -1,
            DT: ""
        };
    }
}
module.exports = {
    getAPageProductsService, pageProductsFiltered, pageProductsSearch, getProductDetailService,
    createProductService, updateProductService, userProductSerice, deleteProduct
}