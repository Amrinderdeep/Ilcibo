import express from 'express';
import { addFood, listFood, removeFood } from '../controllers/foodController.js';

const foodRouter = express.Router();

foodRouter.get("/list", listFood);
foodRouter.post("/add", addFood); // No multer upload middleware
foodRouter.post("/remove", removeFood);

export default foodRouter;
