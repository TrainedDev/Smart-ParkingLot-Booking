module.exports = (sq, datatypes) => {
  const ParkingBookings = sq.define("ParkingBookings", {
    id: {
      type: datatypes.INTEGER,
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      unique: true,
    },
    issuedSlotNumber: {
      type: datatypes.STRING,
      allowNull: false,
    },
    startingTimer: {
        type: datatypes.DATE,
        allowNull: false
    },
    endingTimer: {
        type: datatypes.DATE,
        allowNull: false
    },
    status: {
      type: datatypes.ENUM("cancelled", "completed", "active"),
      defaultValue: "active",
    },
  }, {
    timestamps: true,
    tableName: "parking_bookings",
  });

  ParkingBookings.associate = ((model) => {
    ParkingBookings.belongsTo(model.ParkingUsers, { foreignKey: "customer_id", as: "customer" });
  });

  return ParkingBookings;
};
