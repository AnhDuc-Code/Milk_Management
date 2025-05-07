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
module.exports = {
    getAPageProductsService
}