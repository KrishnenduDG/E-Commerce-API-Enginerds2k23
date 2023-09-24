import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import fs from "fs";

// Routes Imports
import superAdminRoutes from "./routes/superAdminRoutes.js";
import adminRoutes from "./routes/AdminRoutes.js";
import productRoutes from "./routes/ProductRoutes.js";
import { adminDBPath, productDBPath, superAdminDBPath } from "./constants/db.js";

dotenv.config();

// Global App Decl.
const app = express();

// Global Constants
const PORT = process.env.PORT || 8080;

// Parsing the Request Body
app.use(express.json());

// CORS Setup
app.use(cors());

/* Routes Setup */
app.use("/superadmin",superAdminRoutes);
app.use("/admin", adminRoutes);
app.use("/products",productRoutes);


app.get("/",(req,res) => {
    res.send("Running!")
});


app.listen(PORT,() => {
    // fs.writeFileSync(superAdminDBPath,JSON.stringify([]))
    // fs.writeFileSync(adminDBPath,JSON.stringify([]))
    // fs.writeFileSync(productDBPath,JSON.stringify([]))

    console.log(`Server Listening at http://localhost:${PORT}`);
})