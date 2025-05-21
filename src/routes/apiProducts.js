import express from "express";
import upload from "../Middleware/upload";
import ApiProductsController from "../controller/ApiProductsController";
import { checkUserJWT, checkUserAccessible } from "../Middleware/JWTAction";
// import ApiController from "../controller/ApiController";
// import ApiRolesController from "../controller/ApiRolesController";
const routes = express.Router();
const initApiProductRoutes = (app) => {
    routes.all("*", checkUserJWT, checkUserAccessible);
    //     routes.get("/", ApiController.handleAPI);
    //     routes.post("/signup", ApiController.handleSignup);
    routes.post("/product", upload.single("image"), ApiProductsController.createProductWithImg);
    routes.get("/products/user", ApiProductsController.getUserProducts);
    return app.use("/api/", routes);
}

export default initApiProductRoutes;

