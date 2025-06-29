import db from "../models/index";

const getAccessesAUser = async (userLoginData) => {
    let findUser = await db.Users.findOne({
        where: { email: userLoginData.email },
        raw: true,
        nest: true
    })
    let accessesAUser = await db.Roles.findOne({
        where: { idRole: findUser.idRole },
        attributes: ["idRole", "roleName", "description"],
        include: [{
            model: db.Accesses,
            attributes: ["idAccess", "accessName", "description"],
            through: { attributes: [] }
        }]
    })
    return accessesAUser;

}

const getIdUser = async (userLoginData) => {
    let idUser = await db.Users.findOne({
        attributes: ["idUser"],
        where: { email: userLoginData.email },
        raw: true,
        nest: true
    })
    return idUser;
}
module.exports = {
    getAccessesAUser, getIdUser
}