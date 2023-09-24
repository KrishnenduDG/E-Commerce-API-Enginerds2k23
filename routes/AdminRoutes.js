import express from "express";
import { adminLogin } from "../controllers/AdminController.js";

const router = express.Router();

// Admin Routes
router.post('/login',adminLogin);

export default router;