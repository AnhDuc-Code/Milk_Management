import db from '../models/index';

const getAPageProductsService = async (page) => {
    console.log("getAPageProductsService");
    let limit = 5;
    let offset = (page - 1) * limit;
    // let data = [];
    try {
        // data = await db.Users.findAll({
        const { count, rows } = await db.Products.findAndCountAll({
            attributes: ['idProduct', "title", 'image', 'description', 'price', 'brand', 'category'],
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
        console.log("check api page product", data);
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
            DT: ""
        }
    }
}
const pageProductsFiltered = async (page, filter) => {
    console.log("getAPageProductsService");
    let limit = 5;
    let offset = (page - 1) * limit;
    // let data = [];
    try {
        // data = await db.Users.findAll({
        const { count, rows } = await db.Products.findAndCountAll({
            attributes: ['idProduct', "title", 'image', 'description', 'price', 'brand', 'category'],
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
        console.log("check api page product filter", data);
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

const createProductService = async ({ title, price, description, image }) => {
    try {
        await db.Products.create({ title, price, description, image });

        return {
            EM: "Thêm sản phẩm thành công",
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

const userProductSerice = async (email) => {
    console.log("check Email", email);
    try {
        const data = await db.Products.findAll({
            attributes: ['idProduct', 'image', 'title', 'description', 'price', 'brand', 'category'],
            include: {
                model: db.Users,
                where: { email: email }
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
    }
}

module.exports = {
    getAPageProductsService, pageProductsFiltered, createProductService, userProductSerice
}