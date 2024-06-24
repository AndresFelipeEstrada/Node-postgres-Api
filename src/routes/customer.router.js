import express from "express";
import CustomerService from "../services/customer.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import { createCustomerSchema } from "../schemas/customer.schema.js";
const router = express.Router();
const service = new CustomerService();

router.get("/", async (req, res, next) => {
  try {
    res.json(await service.find());
  } catch (error) {
    next(error);
  }
});

router.post(
  "/",
  validatorHandler(createCustomerSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      console.log(body);
      res.status(201).json(await service.create(body));
    } catch (error) {
      next(error);
    }
  },
);

export default router;
