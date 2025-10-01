"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productRouter = express_1.default.Router();
const productController_1 = __importDefault(require("../controllers/productController"));
const { createProduct, deleteProduct, updateProduct, getProductById, getAllProducts } = productController_1.default;
productRouter.post('/', createProduct);
productRouter.delete('/:id', deleteProduct);
productRouter.put('/:id', updateProduct);
productRouter.get('/:id', getProductById);
productRouter.get('/', getAllProducts);
exports.default = productRouter;
