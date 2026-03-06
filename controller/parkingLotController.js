const {newParkingLot, getUserParkingLots, updateOwnerParkingLot, deleteOwnerParkingLot} = require("../services/parkingLotService");
const appError = require("../utils/errorHandler");

 const createParkingLot = async (req, res) => {
  const { name, address, totalSlots } = req.body;
  const userId = req.userId;
  console.log(userId);

  if (!name || !address || !totalSlots) return appError("required details not found", 400)

  const response = await newParkingLot(name, address, totalSlots, userId);

  res
    .status(200)
    .json({ msg: "new parking lot successfully created", data: response });
};

 const fetchAllParkingLots = async (req, res) => {
  const userId = req.userId;

  const response = await getUserParkingLots(userId);

  res
    .status(200)
    .json({ msg: "owner parking lots successfully fetched", data: response });
};

 const updateParkingLot = async (req, res) => {
  const { name, address, totalSlots } = req.body;
  const { parkingLotId } = req.params;
  const userId = req.userId;

  const response = await updateOwnerParkingLot(
    name,
    address,
    parkingLotId,
    userId,
  );

  res
    .status(200)
    .json({ msg: "owner parking lot successfully updated", data: response });
};

 const removeParkingLot = async (req, res) => {
  const { parkingLotId } = req.params;
  const userId = req.userId;

  const response = await deleteOwnerParkingLot(parkingLotId, userId);

  res
    .status(200)
    .json({ msg: "owner parking lot successfully deleted", data: response });
};

module.exports = { createParkingLot, fetchAllParkingLots, updateParkingLot, removeParkingLot };