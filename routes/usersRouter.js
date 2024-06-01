import express from "express";
import validateBody from "../helpers/validateBody.js";
import { emailSchema, usersSchema } from "../schemas/usersSchemas.js";
import {
  current,
  logIn,
  logOut,
  register,
  updateAvatar,
  verify,
  resendVerificationEmail,
} from "../controllers/usersControllers.js";
import { protect } from "../middlewares/protectToken.js";
import {
  uploadAvatarMiddleware,
  optimazeAvatarMiddleware,
} from "../middlewares/upload.js";

const usersRouter = express.Router();

usersRouter.get("/verify/:verificationToken", verify);
usersRouter.post("/verify", validateBody(emailSchema), resendVerificationEmail);
usersRouter.post("/register", validateBody(usersSchema), register);
usersRouter.post("/login", validateBody(usersSchema), logIn);
usersRouter.post("/logout", protect, logOut);
usersRouter.get("/current", protect, current);
usersRouter.patch(
  "/avatars",
  protect,
  uploadAvatarMiddleware.single("avatar"),
  optimazeAvatarMiddleware,
  updateAvatar
);

export default usersRouter;
