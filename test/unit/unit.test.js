const { loginUser, registerUser } = require("../../services/userService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {
  ParkingUsers,
  ParkingLots,
  ParkingSlots,
  ParkingBookings,
  sequelize,
} = require("../../models");
const {
  newParkingLot,
  getUserParkingLots,
  updateOwnerParkingLot,
  deleteOwnerParkingLot,
} = require("../../services/parkingLotService");
const {
  createUserBooking,
  cancelUserBooking,
  endCustomerBookingService,
} = require("../../services/bookingService");

//mocking dependencies
jest.mock("bcrypt");
jest.mock("jsonwebtoken");
jest.mock("../../models", () => ({
  ParkingUsers: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  ParkingLots: {
    create: jest.fn(),
    findByPk: jest.fn(),
    update: jest.fn(),
    destroy: jest.fn(),
  },
  ParkingSlots: {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  },
  ParkingBookings: {
    create: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
  },
  sequelize: {
    transaction: jest.fn(),
  },
}));

//User service testing 
describe("testing user service modules", () => {
beforeEach(() => jest.clearAllMocks());
  // login testing
  it("should throw error when user not found while login", async () => {
    ParkingUsers.findOne.mockResolvedValue(null);

    await expect(
      loginUser("yogesh@gmail.com", "hfadlfa"),
    ).rejects.toMatchObject({ message: "Invalid Credentials", status: 400 });
  });

  it("should throw error if user login password is incorrect", async () => {
    const data = {
      id: 1,
      username: "yogesh",
      email: "yogesh@gamil.com",
      password: "hashpassword",
    };
    ParkingUsers.findOne.mockResolvedValue(data);
    bcrypt.compare.mockResolvedValue(false);

      await expect(
      loginUser("yogesh@gmail.com", "hfadlfa"),
    ).rejects.toMatchObject({ message: "Invalid Credentials", status: 400 });
  });

  it("should create token if user successfully logged in", async () => {
    const data = {
      id: 1,
      username: "yogesh",
      email: "yogesh@gamil.com",
      password: "hashpassword",
    };
    ParkingUsers.findOne.mockResolvedValue(data);
    bcrypt.compare.mockResolvedValue(true);
    jwt.sign.mockReturnValue("fakeToken");

    const res = await loginUser("yogesh@gmail.com", "hashpassword");
    expect(jwt.sign).toHaveBeenCalledWith({ id: data.id }, expect.any(String), {
      expiresIn: "1h",
    });
    expect(res.token).toBe("fakeToken");
  });

  // register testing
  it("should throw error when user already registered", async () => {
    const data = {
      id: 1,
      username: "yogesh",
      email: "yogesh@gmail.com",
      password: "hashpassword",
      role: "customer",
    };
    ParkingUsers.findOne.mockResolvedValue(data);

    await expect(
     registerUser(
      "yogesh",
      "yogesh@gmail.com",
      "hashpassword",
      "customer",
    )
    ).rejects.toMatchObject({ message: "Invalid Credentials", status: 400 });
  });

  it("should create token if user successfully registered", async () => {
    const data = {
      id: 1,
      username: "yogesh",
      email: "yogesh@gamil.com",
      password: "hashpassword",
      role: "customer",
    };
    ParkingUsers.findOne.mockResolvedValue(null);

    ParkingUsers.create.mockResolvedValue(data);
    jwt.sign.mockReturnValue("fakeToken");
    bcrypt.hash.mockResolvedValue("hashpassword");
    const res = await registerUser(
      "yogesh",
      "yogesh@gmail.com",
      "password",
      "customer",
    );
    expect(jwt.sign).toHaveBeenCalledWith({ id: data.id }, expect.any(String), {
      expiresIn: "1h",
    });
    expect(res.token).toBe("fakeToken");
  });

});
// Parking lot service testing
describe("testing parking lot service", () => {
  beforeEach(() => jest.clearAllMocks());

  // create parking lot and slots testing
  it("should create new parking lot and slots", async () => {
    const parkingLotData = {
      name: "chinaLot",
      address: "japan",
      totalSlots: 3,
      userId: 1,
    };
    const fakeTransaction = {};

    sequelize.transaction.mockImplementation(async (cb) => {
      return cb(fakeTransaction);
    });

    ParkingLots.create.mockResolvedValue(parkingLotData);

    ParkingSlots.create.mockImplementation(async (data) => {
      return data;
    });

    const res = await newParkingLot("chinaLot", "japan", 3, 1);
    expect(ParkingLots.create).toHaveBeenCalledWith(
      { name: "chinaLot", address: "japan", totalSlots: 3, owner_id: 1 },
      { transaction: fakeTransaction },
    );
    expect(ParkingSlots.create).toHaveBeenCalledTimes(3);
    // expect(ParkingSlots.create).toHaveBeenCalledWith({ slotNumber: "A1", parkingLot_id: 1 , isAvailable: true }, { transaction: fakeTransaction });

    expect(res.parkingLot).toEqual(parkingLotData);
    expect(res.parkingSlots.length).toBe(3);
  });

  // fetch owner parking lot testing
  it("should return not found error if parkingLot owner not found", async () => {
    ParkingUsers.findOne.mockResolvedValue(null);

    await expect(getUserParkingLots(1)).rejects.toMatchObject({
      message: "parkingLots not found",
      status: 404,
    });
  });

  it("should fetch paringLots owner", async () => {
    const data = {
      id: 1,
    };
    ParkingUsers.findOne.mockResolvedValue(data);

    const res = await getUserParkingLots(1);
    expect(ParkingUsers.findOne).toHaveBeenCalledWith({
      where: { id: 1 },
      include: [
        {
          model: ParkingLots,
          as: "parkingLots",
        },
      ],
    });
    expect(res).toStrictEqual(data);
  });

  //update parking lot testing
  it("should throw error if parking lot not found", async () => {
    ParkingLots.findByPk.mockResolvedValue(null);

    await expect(
      updateOwnerParkingLot("china", "japan", 1),
    ).rejects.toMatchObject({
      message: "parking lot not found",
      status: 400,
    });
    expect(ParkingLots.findByPk).toHaveBeenCalledWith(1);

  });

  it("should throw error if parking lot is not updated", async () => {
    const data = { id: 1, name: "china" };
    ParkingLots.findByPk.mockResolvedValue(data);
    ParkingLots.update.mockResolvedValue([0]);

    await expect(
      updateOwnerParkingLot("india", "japan", 1),
    ).rejects.toMatchObject({
      message: "parking lot not updated",
      status: 400,
    });
    expect(ParkingLots.findByPk).toHaveBeenCalledWith(1);
    expect(ParkingLots.update).toHaveBeenCalledWith(
      { name: "india", address: "japan" },
      { where: { id: 1 } },
    );
  });

  it("should update owner parking lot successfully", async () => {
    const data = { id: 1, name: "china", address: "japan" };
    ParkingLots.findByPk.mockResolvedValue(data);
    ParkingLots.update.mockResolvedValue([1]);

    const res = await updateOwnerParkingLot("china2", "japan2", 1);
    console.log(res);

    expect(res).toBe(1);
  });

  // delete owner paring lot
  it("should failed to deleted owner parking lot", async () => {
    ParkingLots.destroy.mockResolvedValue(0);
    // ParkingLots.destroy.mockRejectedValue(new Error("delete failed"));

    await expect(deleteOwnerParkingLot(1, 1)).rejects.toMatchObject({
      message: "failed to delete parking lot",
    });
  });

  it("should successfully delete owner parking lot", async () => {
    ParkingLots.destroy.mockResolvedValue(1);

    const res = await deleteOwnerParkingLot(1, 1);
    expect(ParkingLots.destroy).toHaveBeenCalledWith({
      where: { id: 1, userId: 1 },
    });
    expect(res).toBe(1);
  });
});
// Booking service testing
describe("testing booking service module", () => {
  beforeEach(() => jest.clearAllMocks());
  // testing create user booking service
  it("should throw error if parking lot is not found", async () => {
    const fakeTransaction = {};
    sequelize.transaction.mockImplementation(async (cb) => {
      return cb(fakeTransaction);
    });
    ParkingSlots.findOne.mockResolvedValue(null);

    await expect(
      createUserBooking(1, "A1", "end_timer", 1),
    ).rejects.toMatchObject({
      message: "parking slot details not found",
      status: 400,
    });
    expect(ParkingSlots.findOne).toHaveBeenCalledWith({
      where: { id: 1, slotNumber: "A1" },
      transaction: fakeTransaction,
    });
  });

  it("should successfully create user booking and update parking slots", async () => {
    const fakeTransaction = {};
    const data1 = {
      id: 1,
      customer_id: 1,
      issuedSlotNumber: "A1",
      isAvailable: true,
    };
    const data2 = {
      id: 1,
      customer_id: 1,
      issuedSlotNumber: "A2",
    };
    sequelize.transaction.mockImplementation(async (cb) => {
      return cb(fakeTransaction);
    });
    ParkingSlots.findOne.mockResolvedValue(data1);
    ParkingBookings.create.mockResolvedValue(data2);
    ParkingSlots.update.mockResolvedValue([1]);

    const res = await createUserBooking(
      1,
      "A2",
      "end_timer",
      // Date.now(),
      1,
    );
    expect(ParkingBookings.create).toHaveBeenCalledWith(
      {
        startingTimer: expect.any(Number),
        issuedSlotNumber: "A2",
        endingTimer: "end_timer",
        status: "active",
        customer_id: 1,
      },
      { transaction: fakeTransaction },
    );
    expect(ParkingSlots.update).toHaveBeenCalledWith(
      { isAvailable: false },
      {
        where: { id: 1, slotNumber: "A2", isAvailable: true },
        transaction: fakeTransaction,
      },
    );
    expect(res).toEqual(expect.anything());
  });

  // testing cancel user booking service
  it("should throw error if booking details not found", async () => {
    const fakeTransaction = {};
    sequelize.transaction.mockImplementation(async (cb) => {
      return cb(fakeTransaction);
    });
    ParkingBookings.findOne.mockResolvedValue(null);

    await expect(
      cancelUserBooking(1, "timer", "end_time", "A1", 1, 1),
    ).rejects.toMatchObject({
      message: "booking details not found",
      status: 400,
    });
    expect(ParkingBookings.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
        customer_id: 1,
        issuedSlotNumber: "A1",
        // startingTimer: start_time,
        endingTimer: "end_time",
      },
      transaction: fakeTransaction,
    });
  });

  it("should throw error if booking is already cancelled", async () => {
    const fakeTransaction = {};
    const data = {
      id: 1,
      status: "cancelled",
    };
    sequelize.transaction.mockImplementation(async (cb) => cb(fakeTransaction));
    ParkingBookings.findOne.mockResolvedValue(data);

    await expect(
      cancelUserBooking(1, "timer", "end_time", "A1", 1, 1),
    ).rejects.toMatchObject({
      message: "booking is already cancelled",
      status: 400,
    });
  });

  it("should throw error if booking is already completed", async () => {
    const fakeTransaction = {};
    const data = {
      id: 1,
      status: "completed",
    };
    sequelize.transaction.mockImplementation(async (cb) => cb(fakeTransaction));
    ParkingBookings.findOne.mockResolvedValue(data);

    await expect(
      cancelUserBooking(1, "timer", "end_time", "A1", 1, 1),
    ).rejects.toMatchObject({
      message: "booking is already completed",
      status: 400,
    });
  });

  it("should successfully cancel user bookings", async () => {
    const fakeTransaction = {};
    const data = {
      id: 1,
      status: "active",
      startingTimer: "1772779726920",
    }
    sequelize.transaction.mockImplementation(async (cb) => cb(fakeTransaction));
    ParkingBookings.findOne.mockResolvedValue(data);
    ParkingBookings.update.mockResolvedValue([1]);
    ParkingSlots.update.mockResolvedValue([1]);

    const res = await cancelUserBooking(1, "timer", "end_time", "A1", 1, 1);
    expect(ParkingBookings.update).toHaveBeenCalledWith(
      { status: "cancelled", endingTimer: expect.any(Number) },
      {
        where: {
          id: 1,
          customer_id: 1,
          issuedSlotNumber: "A1",
          // startingTimer: start_time,
          endingTimer: "end_time",
        },
        transaction: fakeTransaction,
      },
    );
    expect(ParkingSlots.update).toHaveBeenCalledWith(
      { isAvailable: true },
      {
        where: { id: 1, slotNumber: "A1", isAvailable: false },
        transaction: fakeTransaction,
      },
    );
    expect(res).toEqual([1]);
  });

  // testing delete user booking service
  it("should throw error if booking details not found", async () => {
    const fakeTransaction = {};
    sequelize.transaction.mockImplementation(async (cb) => {
      return cb(fakeTransaction);
    });
    ParkingBookings.findOne.mockResolvedValue(null);

    await expect(
      cancelUserBooking(1, "timer", "end_time", "A1", 1, 1),
    ).rejects.toMatchObject({
      message: "booking details not found",
      status: 400,
    });
    expect(ParkingBookings.findOne).toHaveBeenCalledWith({
      where: {
        id: 1,
        customer_id: 1,
        issuedSlotNumber: "A1",
        // startingTimer: start_time,
        endingTimer: "end_time",
      },
      transaction: fakeTransaction,
    });
  });

  it("should throw error if booking is already cancelled", async () => {
    const fakeTransaction = {};
    const data = {
      id: 1,
      status: "cancelled",
    };
    sequelize.transaction.mockImplementation(async (cb) => cb(fakeTransaction));
    ParkingBookings.findOne.mockResolvedValue(data);

    await expect(
      cancelUserBooking(1, "timer", "end_time", "A1", 1, 1),
    ).rejects.toMatchObject({
      message: "booking is already cancelled",
      status: 400,
    });
  });

  it("should throw error if booking is already completed", async () => {
    const fakeTransaction = {};
    const data = {
      id: 1,
      status: "completed",
    };
    sequelize.transaction.mockImplementation(async (cb) => cb(fakeTransaction));
    ParkingBookings.findOne.mockResolvedValue(data);

    await expect(
      cancelUserBooking(1, "timer", "end_time", "A1", 1, 1),
    ).rejects.toMatchObject({
      message: "booking is already completed",
      status: 400,
    });
  });

  it("should successfully delete user bookings", async () => {
    const fakeTransaction = {};
    const data = {
      id: 1,
      status: "active",
      endingTimer: "1772779726920",
    };
    sequelize.transaction.mockImplementation(async (cb) => cb(fakeTransaction));
    ParkingBookings.findOne.mockResolvedValue(data);
    ParkingBookings.update.mockResolvedValue([1]);
    ParkingSlots.update.mockResolvedValue([1]);

    const res = await endCustomerBookingService(
      1,
      "timer",
      "end_time",
      "A1",
      1,
    );
    expect(ParkingBookings.update).toHaveBeenCalledWith(
      { status: "completed" },
      {
        where: {
          id: 1,
          customer_id: 1,
          issuedSlotNumber: "A1",
          startingTimer: "timer",
          endingTimer: "end_time",
        },
        transaction: fakeTransaction,
      },
    );
    expect(ParkingSlots.update).toHaveBeenCalledWith(
      { isAvailable: true },
      {
        where: { slotNumber: "A1", isAvailable: false },
        transaction: fakeTransaction,
      },
    );
    expect(res).toEqual([1]);
  });
});
