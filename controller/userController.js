const { config } = require("dotenv");
const { registerUser, loginUser } = require("../services/userService");
const appError = require("../utils/errorHandler");

config();

 const register = async (req, res) => {
  const { username, email, password, role } = req.body;

  if (!username || !email || !password || !role) {
   return appError("required details not found", 400)
  }

  const { token } = await registerUser(username, email, password, role);

  res.status(200).json({ msg: "user successfully registered", data: token });
};

 const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
   return appError("required details not found", 400)
  }

  const { token } = await loginUser(email, password);

  res.status(200).json({ msg: "user successfully registered", data: token });
};

module.exports = { register, login };