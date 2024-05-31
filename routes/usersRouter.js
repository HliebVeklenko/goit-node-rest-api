import express from "express";
import validateBody from "../helpers/validateBody.js";
import { usersSchema } from "../schemas/usersSchemas.js";
import {
  current,
  logIn,
  logOut,
  register,
} from "../controllers/usersControllers.js";
import { protect } from "../middlewares/protectToken.js";

const usersRouter = express.Router();

usersRouter.post("/register", validateBody(usersSchema), register);
usersRouter.post("/login", validateBody(usersSchema), logIn);
usersRouter.post("/logout", protect, logOut);
usersRouter.get("/current", protect, current);
export default usersRouter;
