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
    const { email, password } = req.body;

    const admins = JSON.parse(fs.readFileSync(adminDBPath));
    const targetSuperAdmin = _.find(admins, { email, password });

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
    } else {
        res.send({ status: "Failure", msg: "Invalid Credentials" });
    }
}
