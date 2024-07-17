import express from "express";
import { upload } from "../../config/multer.js";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
} from "../../controllers/v2/productController.js";

const router = express.Router();

router.get("/", getProducts);
router.get("/:id", getProductById);
router.post("/", upload, createProduct);
router.put("/:id", upload, updateProduct);
router.delete("/:id", deleteProduct);

export default router;
