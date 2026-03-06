const { ParkingBookings, sequelize, ParkingSlots } = require("../models");
const appError = require("../utils/errorHandler");

const createUserBooking = async (
  userId,
  issuedSlotNumber,
  endingTimer,
  slotId,
) => {
  console.log("till here", issuedSlotNumber);

  const t = await sequelize.transaction(async (t) => {
    // check if the slot is available
    const isSlotAvailable = await ParkingSlots.findOne({
      where: { id: slotId, slotNumber: issuedSlotNumber },
      transaction: t,
    });

    if (!isSlotAvailable) throw appError("parking slot details not found", 400);

    if (!isSlotAvailable.isAvailable)
      throw appError("slot is already booked", 400);

    // create booking
    const response = await ParkingBookings.create(
      {
        startingTimer: Date.now(),
        issuedSlotNumber,
        endingTimer,
        status: "active",
        customer_id: userId,
      },
      { transaction: t },
    );

    // update parking slot status to false
    const updateSlotStatus = await ParkingSlots.update(
      { isAvailable: false },
      {
        where: { id: slotId, slotNumber: issuedSlotNumber, isAvailable: true },
        transaction: t,
      },
    );

    return response;
  });
  return t;
};

const cancelUserBooking = async (
  bookingId,
  start_time,
  end_time,
  slotNumber,
  userId,
  slotId,
) => {
  const response = await sequelize.transaction(async (t) => {
    //check is user booking exist or not
    const isBookingExist = await ParkingBookings.findOne({
      where: {
        id: bookingId,
        customer_id: userId,
        issuedSlotNumber: slotNumber,
        // startingTimer: start_time,
        endingTimer: end_time,
      },
      transaction: t,
    });

    if (!isBookingExist) throw appError("booking details not found", 400);

    if (isBookingExist.status === "cancelled")
      throw appError("booking is already cancelled", 400);

    if (isBookingExist.status === "completed")
      throw appError("booking is already completed", 400);

    // cancel user booking
    if (isBookingExist.startingTimer < Date.now()) {
      const cancelBooking = await ParkingBookings.update(
        { status: "cancelled", endingTimer: Date.now() },
        {
          where: {
            id: bookingId,
            customer_id: userId,
            issuedSlotNumber: slotNumber,
            // startingTimer: start_time,
            endingTimer: end_time,
          },
          transaction: t,
        },
      );

      const updateSlotStatus = await ParkingSlots.update(
        { isAvailable: true },
        {
          where: { id: slotId, slotNumber, isAvailable: false },
          transaction: t,
        },
      );

      return cancelBooking;
    }
  });

  return response;
};

const endCustomerBookingService = async (
  bookingId,
  start_time,
  end_time,
  slotNumber,
  userId,
) => {
  const response = await sequelize.transaction(async (t) => {
    //check is user booking exist or not
    const isBookingExist = await ParkingBookings.findOne({
      where: {
        id: bookingId,
        customer_id: userId,
        issuedSlotNumber: slotNumber,
        startingTimer: start_time,
        endingTimer: end_time,
      },
      transaction: t,
    });

    if (!isBookingExist) throw appError("booking details not found", 400);

    if (isBookingExist.status === "cancelled")
      throw appError("booking is already cancelled", 400);

    if (isBookingExist.status === "completed")
      throw appError("booking is already completed", 400);

    // end user booking
    if (isBookingExist.endingTimer < Date.now()) {
      const endBooking = await ParkingBookings.update(
        { status: "completed" },
        {
          where: {
            id: bookingId,
            customer_id: userId,
            issuedSlotNumber: slotNumber,
            startingTimer: start_time,
            endingTimer: end_time,
          },
          transaction: t,
        },
      );

      const updateSlotStatus = await ParkingSlots.update(
        { isAvailable: true },
        {
          where: { slotNumber, isAvailable: false },
          transaction: t,
        },
      );

      return endBooking;
    }
  });

  return response;
};

module.exports = {
  createUserBooking,
  cancelUserBooking,
  endCustomerBookingService,
};
