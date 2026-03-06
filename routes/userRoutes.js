const { Router } = require("express");
const { register, login } = require("../controller/userController");
const { asyncHandler } = require("../middleware/handler");

const route = Router();

route.post("/register", asyncHandler(register));
route.post("/login", asyncHandler(login));

module.exports = route;
