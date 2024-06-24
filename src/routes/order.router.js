import { Router } from "express";
import OrderService from "../services/order.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import {
  addItemSchema,
  createOrderSchema,
  getOrderSchema,
} from "../schemas/order.schema.js";

const router = Router();
const service = new OrderService();

router.get("/", async (_req, res, next) => {
  try {
    const allOrders = await service.findAll();
    res.json(allOrders);
  } catch (error) {
    next(error);
  }
});

router.get(
  "/:id",
  validatorHandler(getOrderSchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const order = await service.findOne(id);
      return res.json(order);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  validatorHandler(createOrderSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newOrder = await service.create(body);
      return res.status(201).json(newOrder);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/add-item",
  validatorHandler(addItemSchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newItem = await service.addItem(body);
      return res.status(201).json(newItem);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
