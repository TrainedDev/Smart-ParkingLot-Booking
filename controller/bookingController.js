const appError = require("../utils/errorHandler");
const {
  createUserBooking,
  cancelUserBooking,
  endCustomerBookingService,
} = require("../services/bookingService");

const createBooking = async (req, res) => {
  const { slotId } = req.params;
  const { issuedSlotNumber,  endingTimer } = req.body;
  const userId = req.userId;

  if (
    !issuedSlotNumber ||
    !endingTimer||
    !slotId
  )
    throw appError("required details not found", 400);

  const response = await createUserBooking(
    userId,
    issuedSlotNumber,
    endingTimer,
    slotId
  );

  res.status(200).json({ msg: "booking successfully created", data: response });
};

const cancelBooking = async (req, res) => {
  const { bookingId, slotId } = req.params;
  const { slotNumber, start_time, end_time } = req.body;
  const userId = req.userId;

  if (!bookingId || !slotNumber || !slotId)
    return new appError("required booking details not found", 400);

  const response = await cancelUserBooking(
    bookingId,
    start_time,
    end_time,
    slotNumber,
    userId,
    slotId
  );

  res.status(200).json({ msg: "booking successfully deleted", data: response });
};

const endCustomerBooking = async (req, res) => {
  const { bookingId } = req.params;
  const { slotNumber, start_time, end_time } = req.body;
  const userId = req.userId;

  if (!bookingId || !slotNumber)
    return new appError("required booking details not found", 400);

  const response = await endCustomerBookingService(
    bookingId,
    start_time,
    end_time,
    slotNumber,
    userId,
  );

  res.status(200).json({ msg: "booking successfully ended", data: response });
};

module.exports = { createBooking, cancelBooking, endCustomerBooking };
