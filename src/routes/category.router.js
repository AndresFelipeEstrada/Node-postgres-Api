import { Router } from "express";
import passport from "passport";
import CategoryService from "../services/category.service.js";
import validatorHandler from "../middlewares/validator.handler.js";
import {
  createCategorySchema,
  getCategorySchema,
  updateCategorySchema,
} from "../schemas/category.schema.js";
import { checkRoles } from "../middlewares/auth.handler.js";

const router = Router();
const service = new CategoryService();

router.get("/",
  async (_req, res, next) => {
    try {
      const categories = await service.find();
      res.json(categories);
    } catch (error) {
      next(error);
    }
  });

router.get(
  "/:id",
  passport.authenticate('jwt', { session: false }),

  checkRoles('admin', 'customer'),
  validatorHandler(getCategorySchema, "params"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const category = await service.findOne(id);
      return res.json(category);
    } catch (error) {
      next(error);
    }
  },
);

router.post(
  "/",
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),
  validatorHandler(createCategorySchema, "body"),
  async (req, res, next) => {
    try {
      const body = req.body;
      const newCategory = await service.create(body);
      return res.status(201).json(newCategory);
    } catch (error) {
      next(error);
    }
  },
);

router.patch(
  "/:id",
  passport.authenticate('jwt', { session: false }),
  checkRoles('admin'),

  validatorHandler(getCategorySchema, "params"),
  validatorHandler(updateCategorySchema, "body"),
  async (req, res, next) => {
    try {
      const { id } = req.params;
      const body = req.body;
      const category = await service.update(id, body);
      return res.json(category);
    } catch (error) {
      next(error);
    }
  },
);

export default router;
