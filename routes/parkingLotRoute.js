const { Router } = require("express");
const auth = require("../middleware/auth");
const {
  createParkingLot,
  fetchAllParkingLots,
  updateParkingLot,
  removeParkingLot,
} = require("../controller/parkingLotController");
const { asyncHandler } = require("../middleware/handler");


const route = Router();

route.post("/create", auth, asyncHandler(createParkingLot));
route.get("/fetch", auth, asyncHandler(fetchAllParkingLots));
route.put("/update/:parkingLotId", auth, asyncHandler(updateParkingLot));
route.delete("/delete/:parkingLotId", auth, asyncHandler(removeParkingLot));

module.exports = route;
