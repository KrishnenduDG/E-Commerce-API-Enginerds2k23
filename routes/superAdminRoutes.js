import express from "express";

import { superAdminSignUp,superAdminLogin,onboardAdmin } from "../controllers/superAdminController.js";
import { checkSuperAdminAuth } from "../middlewares/auth.js";


const router = express.Router();

router.post("/login",superAdminLogin);
router.post("/signUp", superAdminSignUp);
router.post("/onboardAdmin",checkSuperAdminAuth,onboardAdmin)

export default router;