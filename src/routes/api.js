import express from "express";
import ApiController from "../controller/ApiController";
const routes = express.Router();


const initApiRoutes = (app) => {
    routes.get("/", ApiController.handleAPI);
    routes.post("/signup", ApiController.handleSignup);
    routes.post("/login", ApiController.handleLogin);

    routes.get("/users", ApiController.getUsers);
    routes.get("/userspage", ApiController.getAPageOfUsers);
    return app.use("/api/", routes);
}

export default initApiRoutes;