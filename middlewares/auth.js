import jwt from "jsonwebtoken";

import { findAdmin } from "../controllers/AdminController.js";
import {findSuperAdmin} from "../controllers/superAdminController.js"

export const checkSuperAdminAuth = (req, res, next) => {
  const authHeader = req.headers["x-access-token"];

  if (authHeader) {
    const superAdminCreds = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_ACCESS_KEY
    );

    const targetSuperAdmin = findSuperAdmin({
      email: superAdminCreds.email,
      password: superAdminCreds.password,
    });

    if (targetSuperAdmin === undefined)
      res.status(403).send({ status: "Failure", msg: "You Don't have access" });

    req.targetSuperAdmin = targetSuperAdmin;

  }
  else{
    req.targetSuperAdmin = null;
  }
    next();

};


export const checkAdmin = (req,res,next) => {
  const authHeader = req.headers["x-access-token"];

  if (authHeader) {
    const superAdminCreds = jwt.verify(
      authHeader.split(" ")[1],
      process.env.JWT_ACCESS_KEY
    );

    const targetAdmin = findAdmin({
      email: superAdminCreds.email,
      password: superAdminCreds.password,
    });

    if (targetAdmin === undefined)
      res.status(403).send({ status: "Failure", msg: "You Don't have access" });

    req.targetAdmin = targetAdmin;
  } else {
    req.targetAdmin = null;
  }
  next();

}