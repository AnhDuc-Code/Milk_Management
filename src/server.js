require("dotenv").config();
import express from "express";
import viewEngine from "./configs/viewEngine";
import initWebRoutes from "./routes/web";
import initApiRoutes from "./routes/api";
import bodyParser from 'body-parser';
import cors from "./configs/configCORS";
import cookieParser from "cookie-parser";
import initApiProductRoutes from "./routes/apiProducts";
import initApiCartRoutes from "./routes/apiCart";
// import { CreateJWTToken, EncodeJWT } from "./Middleware/JWTAction";

const app = express();
const PORT = process.env.PORT || 8000;
cors(app);

//config bodyParser rút gọn thông báo request
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//use cookiesParser
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));
//check JWT
// CreateJWTToken();
// EncodeJWT("<keyEncoded>");

//KHởi động viewEngine biên dịch code import - require
viewEngine.configViewEngine(app);

//Khởi động routes để biết có những routes nào
initWebRoutes(app);
initApiRoutes(app);
initApiProductRoutes(app);
initApiCartRoutes(app);

app.listen(PORT, () => {
    console.log("PORT=" + PORT);
})