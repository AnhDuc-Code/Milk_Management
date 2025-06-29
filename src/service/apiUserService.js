import bcrypt from 'bcryptjs';
import db from '../models/index';
import { getAccessesAUser, getIdUser } from "./JWTservice"
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
        let idUser = await getIdUser(userInfo);
        let payload = {
            idUser: idUser.idUser,
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
            attributes: ['username', 'email', 'address', 'phone', 'gender'],
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
            attributes: ['idUser', 'username', 'email', 'address', 'phone', 'gender'],
            include: {
                model: db.Roles,
                attributes: ['idRole', 'roleName']
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

const getPersonalService = async (email) => {
    try {
        let user = await db.Users.findOne({
            attributes: ['idUser', 'username', 'email', 'address', 'phone', 'gender'],
            where: { email: email },
            include: {
                model: db.Roles,
                attributes: ['roleName']
            },
            raw: true,
            nest: true
        })
        console.log("user: ", user)
        if (user) {
            return {
                EM: "Lấy thông tin cá nhân thành công",
                EC: 0,
                DT: user
            };
        } else {
            return {
                EM: "Không có thông tin người dùng",
                EC: 0,
                DT: ""
            }
        }
    } catch (e) {
        return {
            EM: "Lỗi trong getPersonalService (apiUserService)",
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
        console.log('check data Update User trong Service', dataUpdate);
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

const updateInfoService = async (dataUpdate) => {
    try {
        console.log('check data Update Info Personal trong Service', dataUpdate);
        await db.Users.update({
            username: dataUpdate.username,
            address: dataUpdate.address,
            gender: dataUpdate.gender,
            phone: dataUpdate.phone,
        },
            {
                where: { idUser: dataUpdate.idUser }
            }
        )
        return {
            EM: "Đã cập nhật thông tin cá nhân!",
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
const updatePasswordService = async (dataUpdate) => {
    try {
        let hashedPassword = hashPassword(userInfo.newPass1);
        console.log('check data Update Password Personal trong Service', dataUpdate);
        await db.Users.update({
            password: hashedPassword
        },
            {
                where: { idUser: dataUpdate.idUser }
            }
        )
        return {
            EM: "Đã thay đổi mật khẩu thành công!",
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
const toSellerService = async (idUser, email, store) => {
    console.log("check thông tin store khi đăng ký: ", store.storeName, "x", store.taxCode, "x", store.addressStore);
    try {
        await db.Stores.create({
            idStore: idUser,
            storeName: store.storeName,
            taxCode: store.taxCode,
            addressStore: store.addressStore
        })
        await db.Users.update({
            idRole: 2
        },
            {
                where: { email: email }
            }
        )
        return {
            EM: "Đã nâng cấp tài khoản thành người bán hàng!",
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

module.exports = {
    createUser, readUser, deleteUser, userLogin, getAPageUsers, createUserFull, updateUserWithId,
    getPersonalService, updateInfoService, updatePasswordService,
    toSellerService
}