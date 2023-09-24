import fs from "fs";
import { v4 as uuidv4 } from "uuid";
import _ from "lodash";

import { productDBPath } from "../constants/db.js";

// Non-Route Controllers
export const getAllProductsFromDB = () => {
  return JSON.parse(fs.readFileSync(productDBPath));
};

export const addProduct = (req, res) => {
  const { name, price, tags, colorsAvailable, description } = req.body;

  if (req.targetAdmin === null) {
    res.status(403).send({
      status: "Failure",
      msg: "Credentials Missing",
    });
  }
  try {
    const newProduct = {
      id: uuidv4(),
      createdBy: req.targetAdmin.uid,
      name,
      price,
      tags,
      colorsAvailable,
      description,
    };

    const products = getAllProductsFromDB();
    products.push(newProduct);

    fs.writeFileSync(productDBPath, JSON.stringify(products));

    res.status(200).send({
      status: "Success",
      msg: "You have successfully Inserted the product",
      product: newProduct,
    });
  } catch (error) {
    res.status(500).send({ status: "Failure", msg: "Internal Server Error" });
  }
};

export const getAllProducts = (req, res) => {
  try {
    const products = getAllProductsFromDB();
    res.status(200).send({
      status: "Success",
      msg: "Fetched All Products",
      products,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "Failure", msg: "Internal Server Error" });
  }
};

export const deleteProduct = (req, res) => {
  if (req.targetAdmin === null) {
    res.status(403).send({
      status: "Failure",
      msg: "Credentials Missing",
    });
  }else{
    const { productId } = req.body;
    const products = getAllProductsFromDB();

    const targetProduct = _.find(products, { id: productId });

    if (targetProduct === undefined) {
      res.status(403).send({ status: "Failure", msg: "Product Not Found" });
    } else {
      try {
        if (targetProduct.createdBy !== req.targetAdmin.uid)
          res.status(403).send({
            status: "Failure",
            msg: "You don't have sufficient Access to delete the product",
          });
        else {
          const newProductArray = products.filter((p) => p.id !== productId);
          fs.writeFileSync(productDBPath,JSON.stringify(newProductArray));
          res
            .status(200)
            .send({ status: "Success", msg: "Product Successfully Deleted" });
        }
      } catch (error) {
        res
          .status(500)
          .send({ status: "Failure", msg: "Internal Server Error" });
      }
    }
  }
  
};
