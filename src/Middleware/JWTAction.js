import jwt from 'jsonwebtoken';
require("dotenv").config();

const nonCheckPath = ["/", "/signup", "/login", "/home"];

const CreateJWTToken = (payload) => {
    let secretKey = process.env.JWTKEY;
    try {
        let token = jwt.sign(payload, secretKey, { expiresIn: process.env.JWT_EXPIRES_IN });
        console.log("created Token JWT", token);
        return token;
    } catch (error) {
        console.log(error);
        return;
    }
}

const decodeJWT = (token) => {
    let secretKey = process.env.JWTKEY;
    try {
        let decodedData = jwt.verify(token, secretKey);
        // console.log("thông tin đã giải mã", decodedData);
        return decodedData;
    } catch (err) {
        console.log(err);
        return;
    }
}

const checkUserJWT = (req, res, next) => {
    if (nonCheckPath.includes(req.path)) {
        return next();
    }
    let cookies = req.cookies;
    if (cookies && cookies.jwt) {
        let token = cookies.jwt;
        let decoded = decodeJWT(token);
        if (decoded) {
            req.user = decoded;
            next();
        } else {
            return res.status(401).json({
                EM: "Not authenticated JWT1",
                EC: -1,
                DT: ""
            })
        }
    } else {
        return res.status(401).json({
            EM: "Not authenticated JWT2",
            EC: -1,
            DT: ""
        })
    }
}

const checkUserAccessible = (req, res, next) => {
    if (nonCheckPath.includes(req.path)) {
        return next();
    }
    if (req.user) {
        let email = req.user.email.email;
        let roles = req.user.userAccesses.Accesses;
        let currentURL = req.path;
        if (!roles || roles.length === 0) {
            console.log("lỗi ko có quyền truy cập");
            return res.status(403).json({
                EM: "Không có quyền truy cập tính năng này",
                EC: -1,
                DT: ""
            })
        }
        // console.log("check currentURL", currentURL);
        // console.log("check roles", roles);
        let canAccess = roles.some(item => { return item.accessName === currentURL });
        if (canAccess === true) {
            next();
        } else {
            console.log("lỗi 2");
            return res.status(403).json({
                EM: "Không có quyền truy cập tính năng này #2",
                EC: -1,
                DT: ""
            })
        }
    } else {
        console.log("lỗi 3");
        return res.status(401).json({
            EM: "Not authenticated JWT3",
            EC: -1,
            DT: ""
        })
    }
}


module.exports = {
    CreateJWTToken, decodeJWT, checkUserJWT, checkUserAccessible
}