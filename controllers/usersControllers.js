import bcrypt, { hash } from "bcrypt";

import { User } from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user !== null) {
      throw HttpError(409, "Email in use");
    }

    const hash = await bcrypt.hash(password, 10);
    const newUser = await User.create({ email, password: hash });
    res
      .status(201)
      .json({ user: { email, subscription: newUser.subscription } });
  } catch (error) {
    next(error);
  }
};

export const logIn = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user === null) {
      throw HttpError(401, "Email or password is wrong");
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw HttpError(401, "Email or password is wrong");
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    await User.findOneAndUpdate({ email }, { token });

    res.json({ token, user: { email, subscription: user.subscription } });
  } catch (error) {
    next(error);
  }
};

export const logOut = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.user._id, { token: null });
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
};

export const current = async (req, res, next) => {
  const { email, subscription } = req.user;
  res.json({ email, subscription });
};