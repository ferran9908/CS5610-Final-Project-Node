import { Router } from "express";
import User from "../models/users.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import isLoggedIn from "../middlewares/isLoggedIn.js";
import roles from "../enums/roles.js";

const router = Router();

const SECRET = "CS5610";

router.post("/signup", async (req, res) => {
  const { email, password, role, name } = req.body;

  if (!email || !password || !role || !name) {
    return res.status(400).send({ message: "BAD_REQUEST" });
  }

  const encryptedPassword = await bcrypt.hash(password, 3);

  // TODO: Should call User DAO to create user
  const user = await User.create({
    email,
    password: encryptedPassword,
    name,
    role,
  });

  return res.status(201).send(user);
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  //TODO: UserDAO call to find user by email
  const user = await User.findOne({ email }).populate("favHouses.house");

  if (user) {
    const isSame = await bcrypt.compare(password, user.password);
    if (isSame) {
      const token = jwt.sign(
        {
          email,
          role: user.role,
          name: user.name,
          id: user._id,
        },
        SECRET
      );
      return res.send({ jwt: token, user });
    } else {
      return res.status(400).send({ error: "Incorrect Password" });
    }
  } else {
    return res
      .status(400)
      .send({ error: "User does not exist! Please sign up." });
  }
});

router.get("/get-all-users", isLoggedIn, async (req, res) => {
  const { user } = req;
  if (user.role === roles.ADMIN) {
    const users = await User.find({}).populate("favHouses.house");
    return res.send(users);
  } else {
    return res
      .status(401)
      .send({ error: "This route is accessible only to the admin" });
  }
});

router.delete("/remove-user", isLoggedIn, async (req, res) => {
  const { user } = req;
  if (user.role === roles.ADMIN) {
    const userId = req.query.id;
    console.log({ userId });
    const users = await User.deleteOne({ _id: userId });
    return res.send(users);
  } else {
    return res
      .status(401)
      .send({ error: "This route is accessible only to the admin" });
  }
});

router.put("/edit-profile", isLoggedIn, async (req, res) => {
  const { name, email, role } = req.body;
  const { id } = req.user;
  console.log({ name, email, role, id });
  const user = await User.updateOne(
    { _id: id },
    { $set: { name, email, role } }
  );
  return res.send(user);
});

router.get("/fetch-user", async (req, res) => {
  const { id } = req.query;
  const user = await User.findById(id).populate("favHouses.house");
  return res.send(user);
});

router.get("/fetch-current-user", isLoggedIn, async (req, res) => {
  return res.send(req.user);
});

router.get("/fetch-edited-user", isLoggedIn, async (req, res) => {
  const { id } = req.user;
  const user = await User.findById(id).populate("favHouses.house");
  const token = jwt.sign(
    {
      email: user.email,
      role: user.role,
      name: user.name,
      id: user._id,
    },
    SECRET
  );
  return res.send({ user, jwt: token });
});

export default router;
