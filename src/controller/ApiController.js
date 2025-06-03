import apiUserService from "../service/apiUserService";
require("dotenv").config();
const handleAPI = (req, res) => {
    return res.status(200).json({ message: "api return" });
}

const handleSignup = async (req, res) => {
    try {
        if (!req.body.email || !req.body.username || !req.body.password) {
            return res.status(200).json({
                EM: "Thiếu thông tin",
                EC: 1,
                DT: ""
            })
        }

        if (req.body.password && req.body.password.length < 8) {
            return res.status(200).json({
                EM: "Password cần có ít nhất 8 ký tự",
                EC: 1,
                DT: ""
            })
        }

        let data = await apiUserService.createUser(req.body);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: ""
        });

    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiController...",
            EC: "-1",
            DT: ""
        });

    }
}
const handleLogin = async (req, res) => {
    try {
        if (!req.body.email || !req.body.password) {
            return res.status(200).json({
                EM: "Thiếu thông tin",
                EC: 1,
                DT: ""
            })
        }

        let data = await apiUserService.userLogin(req.body);
        await res.cookie("jwt", data.DT.access_token, { httpOnly: true, maxAge: process.env.COOKIE_EXPIRES_IN });
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        });
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiController...",
            EC: "-1",
            DT: ""
        });

    }
}

const getUsers = async (req, res) => {
    try {
        let data = await apiUserService.readUser();
        return res.status(200).json({
            EM: "Lấy tất cả thông tin Users thành công",
            EC: 0,
            DT: data
        })
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiController...",
            EC: "-1",
            DT: ""
        });
    }
}

const getAPageOfUsers = async (req, res) => {
    try {
        if (req.query.page) {
            const data = await apiUserService.getAPageUsers(req.query.page);
            return res.status(200).json({
                EM: data.EM,
                EC: data.EC,
                DT: data.DT
            })
        }
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiController...",
            EC: "-1",
            DT: ""
        });
    }
}

const createUserFullData = async (req, res) => {
    try {
        let reqBody = req.body.dataUserFull;
        await console.log("check req create ful user", reqBody);
        if (!reqBody.email || !reqBody.username || !reqBody.password) {
            return res.status(200).json({
                EM: "Thiếu thông tin",
                EC: 1,
                DT: ""
            })
        }

        if (req.body.password && req.body.password.length < 8) {
            return res.status(200).json({
                EM: "Password cần có ít nhất 8 ký tự",
                EC: 1,
                DT: ""
            })
        }

        let data = await apiUserService.createUserFull(reqBody);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: ""
        });

    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiController...",
            EC: "-1",
            DT: ""
        });

    }
}

const updateUserWithId = async (req, res) => {
    try {
        console.log("check req update", req.body);
        let data = await apiUserService.updateUserWithId(req.body.data);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: ""
            // EM: data.EM,
            // EC: data.EC,
            // DT: data.DT
        })
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiController...",
            EC: "-1",
            DT: ""
        })
    }
}
const deleteUser = async (req, res) => {
    try {
        if (!req.body.idUser) {
            return res.status(200).json({
                EM: "Thiếu thông tin",
                EC: 1,
                DT: ""
            })
        }
        let data = await apiUserService.deleteUser(req.body.idUser);
        return res.status(200).json({
            EM: data.EM,
            EC: data.EC,
            DT: data.DT
        })
    } catch (error) {
        return res.status(500).json({
            EM: "Lỗi server ở ApiController...",
            EC: "-1",
            DT: ""
        })
    }
}

module.exports = {
    handleAPI, handleSignup, handleLogin, getUsers, getAPageOfUsers, updateUserWithId, deleteUser, createUserFullData
}
