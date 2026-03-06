const { Router } = require("express");
const { asyncHandler } = require("../middleware/handler");
const auth = require("../middleware/auth");
const {
  createBooking,
  cancelBooking,
  endCustomerBooking,
} = require("../controller/bookingController");

const route = Router();

route.post("/create/:slotId", auth, asyncHandler(createBooking));
route.delete("/cancel/:bookingId/:slotId", auth, asyncHandler(cancelBooking));
route.put("/end/:bookingId", auth, asyncHandler(endCustomerBooking));

module.exports = route;
