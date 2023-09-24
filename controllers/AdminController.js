import { adminDBPath } from "../constants/db.js";

import _ from "lodash";
import jwt from "jsonwebtoken";
import fs from "fs";

// Non-Route Controller
export const findAdmin = ({ email, password }) => {
  const admins = JSON.parse(fs.readFileSync(adminDBPath));
  return _.find(admins, { email, password });
};


export const adminLogin = (req,res) => {
    // Fetching the Details from Request Body 
    const { email, password } = req.body;

    // Searching for that admin in DB
    const admins = JSON.parse(fs.readFileSync(adminDBPath));
    const targetSuperAdmin = _.find(admins, { email, password });

    // If Found, then create a JWT token and throw to Frontend
    if (targetSuperAdmin !== undefined) {
      try {
        const accessToken = jwt.sign(
          targetSuperAdmin,
          process.env.JWT_ACCESS_KEY
        );

        res.send({ status: "success", token: accessToken });
      } catch (error) {
      res.send({ status: "Failure", msg: "Internal Server Error" });
      }
    } 
    // Admin with same email and password not found
    else {
        res.send({ status: "Failure", msg: "Invalid Credentials" });
    }
}
