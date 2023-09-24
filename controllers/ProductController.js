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

  try {
    // Creating the New Product and adding it to DB
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
    // Getting and sending all Products
    const products = getAllProductsFromDB();
    res.status(200).send({
      status: "Success",
      msg: "Fetched All Products",
      products,
      numProducts: products.length
    });
  } catch (error) {
    res.status(500).send({ status: "Failure", msg: "Internal Server Error" });
  }
};

export const deleteProduct = (req, res) => {

    // Getting all the Details from Request Body 
    const { productId } = req.body;

    // Fetching all products and getting the Target Product
    const products = getAllProductsFromDB();
    const targetProduct = _.find(products, { id: productId });

    // If the Product is not found, then simply throw an invalid request object
    if (targetProduct === undefined) {
      res.status(403).send({ status: "Failure", msg: "Product Not Found" });
    } 
    // Product is found
    else {
      try {

        // If the owner of the product is not trying to delete, then don't allow
        if (targetProduct.createdBy !== req.targetAdmin.uid)
          res.status(403).send({
            status: "Failure",
            msg: "You don't have sufficient Access to delete the product",
          });

        // Deleting the Product
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
  
};
