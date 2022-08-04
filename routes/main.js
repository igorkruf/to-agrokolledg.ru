import express from "express";
import mainController from "../controllers/mainController.js";
const mineRouter = express.Router();
mineRouter.get("/", mainController.main);
mineRouter.get("/listnews", mainController.getListNews);
mineRouter.get("/registration", mainController.registrationForm);
mineRouter.post("/registration", mainController.addRegistration);
mineRouter.post("/choicedate", mainController.getTime);
export default mineRouter;
