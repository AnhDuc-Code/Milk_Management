import express from "express";
import ApiController from "../controller/ApiController";
import ApiRolesController from "../controller/ApiRolesController";
import ApiProductsController from "../controller/ApiProductsController";
const routes = express.Router();
import { checkUserJWT, checkUserAccessible, checkJWT_Exist } from "../Middleware/JWTAction";

// const checkUserLogin = (req, res, next) => {
//     const nonCheckPath = ["/", "/signup", "login"];
//     if (nonCheckPath.includes(req.path)) {
//         return next();
//         if (user) {
//             next();
//         } else {

//         }
//     }
// }

const initApiRoutes = (app) => {
    routes.all("*", checkUserJWT, checkUserAccessible);
    routes.get("/", ApiController.handleAPI);
    routes.post("/signup", ApiController.handleSignup);
    routes.post("/login", ApiController.handleLogin);
    routes.get("/logout", ApiController.handleLogout);

    routes.get("/users", ApiController.getUsers);
    routes.get("/userspage", ApiController.getAPageOfUsers);
    routes.put("/user/update", ApiController.updateUserWithId);
    routes.delete("/user/delete", ApiController.deleteUser);
    routes.post("/user/createFullUser", ApiController.createUserFullData);

    routes.get("/users/roles", ApiRolesController.readRoles);

    routes.get("/home", ApiProductsController.homeProducts);
    routes.get("/checkJWT", checkJWT_Exist);

    return app.use("/api/", routes);
}

export default initApiRoutes;