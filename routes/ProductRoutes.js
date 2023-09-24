import express from "express";

import {getAllProducts,addProduct,deleteProduct} from "../controllers/ProductController.js";
import {checkAdmin} from "../middlewares/auth.js"

const router = express.Router();

router.get("/",getAllProducts).post("/",checkAdmin,addProduct).delete("/",checkAdmin,deleteProduct);
export default router;
