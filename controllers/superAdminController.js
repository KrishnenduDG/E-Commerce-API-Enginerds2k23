import fs from "fs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// Lodash Imports
import _ from "lodash";

import { adminDBPath, superAdminDBPath } from "../constants/db.js";
import { generateRandomPassword } from "../utils/index.js";

export const superAdminSignUp = (req, res) => {
  const { email, password } = req.body;

  const superAdmins = JSON.parse(fs.readFileSync(superAdminDBPath));
  const targetSuperAdmin = _.find(superAdmins, { email: email });

  if (targetSuperAdmin !== undefined)
    res.send({
      status: "failure",
      msg: "SuperAdmin with same Email already exists!",
    });
  else {
    superAdmins.push({ uid: uuidv4(), email, password });
    try {
      fs.writeFileSync(superAdminDBPath, JSON.stringify(superAdmins));
      res.send({
        status: "success",
        msg: "SuperAdmin Created Successfully!",
      });
    } catch (error) {
      res.send({
        status: "Failure",
        msg: "Internal Server Error!",
      });
    }
  }
};

export const superAdminLogin = (req, res) => {
  const { email, password } = req.body;

  const superAdmins = JSON.parse(fs.readFileSync(superAdminDBPath));
  const targetSuperAdmin = _.find(superAdmins, { email:email, password:password });

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
};

export const onboardAdmin = (req, res) => {
  const targetSuperAdmin = req.targetSuperAdmin;

  if(targetSuperAdmin === null)
    res.status(403).send({
      status: "Failure",
      msg: "Credentials Missing",
    });
    else{
        const { email } = req.body;
        const admins = JSON.parse(fs.readFileSync(adminDBPath));

        const targetAdmin = _.find(admins, { email });

        if (targetAdmin === undefined) {
          const password = generateRandomPassword(10);
          const createdAdmin = { uid: uuidv4(), email, password };

          admins.push(createdAdmin);
          try {
            fs.writeFileSync(adminDBPath, JSON.stringify(admins));

            res.send({ status: "Success", admin: createdAdmin });
          } catch (error) {
            res.send({ status: "Failure", msg: "Internal Server Error!" });
          }
        } else {
          res.send({
            status: "Failure",
            msg: "Admin with Same Email already exists",
          });
        }
    }
  
};

// Non-Route Controller
export const findSuperAdmin = ({ email, password }) => {
  const superAdmins = JSON.parse(fs.readFileSync(superAdminDBPath));
  return _.find(superAdmins, { email, password });
};
