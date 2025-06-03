import bcrypt from 'bcryptjs';
import db from '../models/index';
import { getAccessesAUser } from "./JWTservice"
import { CreateJWTToken } from "../Middleware/JWTAction"
const salt = bcrypt.genSaltSync(10);

const hashPassword = (userPassword) => {
    let hash = bcrypt.hashSync(userPassword, salt);
    return hash;
}

const emailExist = async (emailNew) => {
    let user = await db.Users.findOne({
        where: { email: emailNew }
    })

    if (user) {
        return true;
    }
    return false;
}
const usernameExist = async (usernameNew) => {
    let user_Name = await db.Users.findOne({
        where: { username: usernameNew }
    })

    if (user_Name) {
        return true;
    }
    return false;
}

const createUser = async (userInfo) => {
    try {
        let checkEmail = await emailExist(userInfo.email);
        if (checkEmail) {
            return {
                EM: "Email đã tồn tại",
                EC: 2,
                DT: ""
            }
        }
        let checkUsername = await usernameExist(userInfo.username);
        if (checkUsername) {
            return {
                EM: "Username đã tồn tại",
                EC: 2,
                DT: ""
            }
        }
        let hashedPassword = hashPassword(userInfo.password);
        await db.Users.create({
            email: userInfo.email,
            password: hashedPassword,
            username: userInfo.username,
            phone: userInfo.phone,
            idRole: 1
        })
        return {
            EM: "Tạo thành công người dùng",
            EC: 0,
            DT: ""
        }

    } catch (err) {
        console.log(err);
        return {
            EM: "Lỗi trong khi thực hiện thêm...",
            EC: -2,
            DT: ""
        }
    }
}

const checkPassword = async (passInput, passHashedInDB) => {
    let isMatch = await bcrypt.compare(passInput, passHashedInDB);
    if (isMatch) {
        return isMatch;
    } else {
        console.log("lỗi so sánh");
    }
}

const userLogin = async (userInfo) => {
    try {
        let email = await emailExist(userInfo.email);
        if (!email) {
            return {
                EM: "Email không tồn tại",
                EC: 2,
                DT: ""
            }
        }
        let passInDB = await db.Users.findOne({
            where: { email: userInfo.email }
        })

        let passwordNow = await checkPassword(userInfo.password, passInDB.password);
        if (!passwordNow) {
            return {
                EM: "Sai mật khẩu",
                EC: 2,
                DT: ""
            }
        }

        let userAccesses = await getAccessesAUser(userInfo);
        let payload = {
            email: userInfo,
            userAccesses
        }
        let token = await CreateJWTToken(payload);
        return {
            EM: "Đăng nhập thành công",
            EC: 0,
            DT: {
                access_token: token,
                data: userAccesses
            }
        }
    } catch (error) {
        console.log(error);
        return {
            EM: "Lỗi trong khi thực hiện Login...",
            EC: -2,
            DT: ""
        }
    }
}

const readUser = async () => {
    let ur = [];
    try {
        ur = await db.Users.findAll({
            attributes: ['username', 'email', 'address', 'phone'],
            include: {
                model: db.Roles,
                attributes: ['roleName']
            },
            raw: true,
            nest: true
        })
        console.log(ur)
        return ur;
    } catch (err) {
        console.log(">>>>Lỗi: ", err)
    }

}

const deleteUser = async (id) => {
    try {
        // const [rows, fields] = await conn.execute("delete from Users where id=?", [id]);
        // return rows;
        await db.Users.destroy({
            where: { idUser: id }
        })
        return {
            EM: "Xóa thông tin thành công (service page)",
            EC: 0,
            DT: ""
        }
    } catch (err) {
        console.log(err);
        return {
            EM: "error from Service",
            EC: -2,
            DT: ""
        }
    }
}

const getAPageUsers = async (page) => {
    let limit = 5;
    let offset = (page - 1) * limit;
    // let data = [];
    try {
        // data = await db.Users.findAll({
        const { count, rows } = await db.Users.findAndCountAll({
            attributes: ['idUser', 'username', 'email', 'address', 'phone'],
            include: {
                model: db.Roles,
                attributes: ['roleName']
            },
            col: 'idUser', // Chỉ định cột đếm
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

const createUserFull = async (dataUserFull) => {
    try {
        console.log("check data service ", dataUserFull);
        let checkEmail = await emailExist(dataUserFull.email);
        if (checkEmail) {
            return {
                EM: "Email đã tồn tại",
                EC: 2,
                DT: ""
            }
        }
        let checkUsername = await usernameExist(dataUserFull.username);
        if (checkUsername) {
            return {
                EM: "Username đã tồn tại",
                EC: 2,
                DT: ""
            }
        }
        let hashedPassword = hashPassword(dataUserFull.password);
        await db.Users.create({
            email: dataUserFull.email,
            password: hashedPassword,
            username: dataUserFull.username,
            phone: dataUserFull.phone,
            gender: dataUserFull.gender,
            idRole: dataUserFull.role,
            address: dataUserFull.address
        })
        return {
            EM: "Thêm thành công",
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

const updateUserWithId = async (dataUpdate) => {
    try {
        console.log('check data Update trong Service', dataUpdate);
        await db.Users.update({
            username: dataUpdate.username,
            email: dataUpdate.email,
            address: dataUpdate.address,
            idRole: dataUpdate.role,
            gender: dataUpdate.gender,
        },
            {
                where: { idUser: dataUpdate.idUser }
            }
        )
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

module.exports = { createUser, readUser, deleteUser, userLogin, getAPageUsers, createUserFull, updateUserWithId }