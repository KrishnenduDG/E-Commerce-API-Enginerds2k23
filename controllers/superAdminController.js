import fs from "fs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

// Lodash Imports
import _ from "lodash";

import { adminDBPath, superAdminDBPath } from "../constants/db.js";
import { generateRandomPassword } from "../utils/index.js";

export const superAdminSignUp = (req, res) => {
  // Fetching the Data from Body
  const { email, password } = req.body;

  // Finding the Required SuperAdmin
  const superAdmins = JSON.parse(fs.readFileSync(superAdminDBPath));
  const targetSuperAdmin = _.find(superAdmins, { email: email });

  // If the SuperAdmin is Found, then already they are present in DB, so don't add
  if (targetSuperAdmin !== undefined)
    res.send({
      status: "failure",
      msg: "SuperAdmin with same Email already exists!",
    });
  // SuperAdmin is not found, hence add them to DB
  else {
    // Creating the new SuperAdmin Object
    superAdmins.push({ uid: uuidv4(), email, password });
    try {
      // DB Logic
      fs.writeFileSync(superAdminDBPath, JSON.stringify(superAdmins));

      res.status(200).send({
        status: "success",
        msg: "SuperAdmin Created Successfully!",
      });
    } catch (error) {
      res.status(500).send({
        status: "Failure",
        msg: "Internal Server Error!",
      });
    }
  }
};

export const superAdminLogin = (req, res) => {
  // Fetching the Details from Request Body
  const { email, password } = req.body;

  // Finding the SuperAdmin
  const superAdmins = JSON.parse(fs.readFileSync(superAdminDBPath));
  const targetSuperAdmin = _.find(superAdmins, {
    email: email,
    password: password,
  });

  // If found, then we create a JWT Token and send it
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
  // SuperAdmin not found
  else {
    res.send({ status: "Failure", msg: "Invalid Credentials" });
  }
};

export const onboardAdmin = (req, res) => {
  // Getting the SuperAdmin who is trying to do the operation
  const targetSuperAdmin = req.targetSuperAdmin;

    // Getting the Email from Frontend
    const { email } = req.body;

    // Fetching all the Admins (DB Logic)
    const admins = JSON.parse(fs.readFileSync(adminDBPath));

    const targetAdmin = _.find(admins, { email });

    // If the Admin is not there in DB,add them
    if (targetAdmin === undefined) {
      // Generating a Random Password and a new Admin
      const password = generateRandomPassword(10);
      const createdAdmin = { uid: uuidv4(), email, password };

      admins.push(createdAdmin);
      try {
        fs.writeFileSync(adminDBPath, JSON.stringify(admins));

        res.send({ status: "Success", admin: createdAdmin });
      } catch (error) {
        res.send({ status: "Failure", msg: "Internal Server Error!" });
      }
    }

    // If the Admin is already in DB, then don't add
    else {
      res.send({
        status: "Failure",
        msg: "Admin with Same Email already exists",
      });
    }
};

// Non-Route Controller
export const findSuperAdmin = ({ email, password }) => {
  const superAdmins = JSON.parse(fs.readFileSync(superAdminDBPath));
  return _.find(superAdmins, { email, password });
};
