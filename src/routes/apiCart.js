import express from "express";
import upload from "../Middleware/upload";
import ApiCartController from "../controller/ApiCartController.js";
import { checkUserJWT, checkUserAccessible } from "../Middleware/JWTAction.js";
// import ApiController from "../controller/ApiController";
// import ApiRolesController from "../controller/ApiRolesController";
const routes = express.Router();
const initApiCartRoutes = (app) => {
    routes.all("*", checkUserJWT, checkUserAccessible);
    routes.get("/cart", ApiCartController.getCart);
    routes.post("/cart/product", ApiCartController.addToCart);
    routes.post("/cart/bill", ApiCartController.buyItem);
    routes.delete("/cart/delete", ApiCartController.deleteInCart);
    //     routes.post("/signup", ApiController.handleSignup);
    // routes.post("/product", upload.single("image"), ApiProductsController.createProductWithImg);
    // routes.get("/products/user", ApiProductsController.getUserProducts);
    return app.use("/api/", routes);
}

export default initApiCartRoutes;

