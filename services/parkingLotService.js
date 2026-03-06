const appError = require("../utils/errorHandler");

const {
  ParkingLots,
  ParkingSlots,
  ParkingUsers,
  sequelize,
} = require("../models");

// creating new parkingLot and parkingSlots
const newParkingLot = async (name, address, totalSlots, userId) => {
  const response = await sequelize.transaction(async (t) => {
    //creating parkingLots
    const parkingLot = await ParkingLots.create(
      { name, address, totalSlots, owner_id: userId },
      { transaction: t },
    );

    // creating parking slots
    const parkingSlots = [];
    for (let i = 1; i <= parkingLot.totalSlots; i++) {
      const data = await ParkingSlots.create(
        {
          slotNumber: `A${i}`,
          parkingLot_id: parkingLot.id,
          isAvailable: true,
        },
        { transaction: t },
      );
      parkingSlots.push(data);
    }

    return { parkingLot, parkingSlots };
  });

  return response;
};

// fetch owner parkingLots
const getUserParkingLots = async (userId) => {
  const response = await ParkingUsers.findOne({
    where: { id: userId },
    include: [
      {
        model: ParkingLots,
        as: "parkingLots",
      },
    ],
  });

  if (!response) throw appError("parkingLots not found", 404);

  return response;
};

//update owner parkingLot
const updateOwnerParkingLot = async (
  name,
  address,
  parkingLotId,
) => {
  const parkingLot = await ParkingLots.findByPk(parkingLotId);
  
  const data = {};

  if (!parkingLot) throw appError("parking lot not found", 400);
  if (name !== undefined) data.name = name;
  if (address !== undefined) data.address = address;
  // if (totalSlots !== undefined) data.totalSlots = totalSlots;

  const response = await ParkingLots.update(data, { where: { id: parkingLotId } });
  const updatedRow = response[0];
  if (updatedRow === 0) throw appError("parking lot not updated", 400);

  return updatedRow;
};

//remove owner parkingLot
const deleteOwnerParkingLot = async (parkingLotId, userId) => {
  const response = await ParkingLots.destroy({
    where: { id: parkingLotId, userId },
  });

  if (response === 0) throw appError("failed to delete parking lot");

  return response;
};

module.exports = {
  newParkingLot,
  getUserParkingLots,
  updateOwnerParkingLot,
  deleteOwnerParkingLot,
};
