const { ParkingUsers } = require("../models");
const bcrypt = require("bcrypt");
const { config } = require("dotenv");
const jwt = require("jsonwebtoken");
const appError = require("../utils/errorHandler");
// console.log(ParkingUsers);

config();
const { SECRET_KEY } = process.env;

const registerUser = async (username, email, password, role) => {
  const checkUser = await ParkingUsers.findOne({ where: { email } });

  if (checkUser) throw appError("Invalid Credentials", 400);

  const hashPassword = await bcrypt.hash(password, 10);
  const newUser = await ParkingUsers.create({
    username,
    email,
    password: hashPassword,
    role,
  });
  const token = jwt.sign({ id: newUser.id }, SECRET_KEY, { expiresIn: "1h" });

  return { token, newUser };
};

const loginUser = async (email, password) => {
  const checkUser = await ParkingUsers.findOne({ where: { email } });

  if (!checkUser) throw appError("Invalid Credentials", 400);

  const checkPassword = await bcrypt.compare(password, checkUser.password);

  if (!checkPassword) throw appError("Invalid Credentials", 400);

  const token = jwt.sign({ id: checkUser.id }, SECRET_KEY, { expiresIn: "1h" });

  return { token };
};

module.exports = { registerUser, loginUser };
