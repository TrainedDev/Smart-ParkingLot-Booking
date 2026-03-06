module.exports = (sq, datatypes) => {
  const ParkingSlots =
    sq.define("ParkingSlots",
    {
      id: {
        type: datatypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true,
      },
      slotNumber: {
        type: datatypes.STRING,
        allowNull: false,
      },
      isAvailable: {
        type: datatypes.BOOLEAN,
        defaultValue: true,
      },
    },
    {
      timestamps: true,
      tableName: "parking_slots",
    });
  ParkingSlots.associate = (model) => {
    ParkingSlots.belongsTo(model.ParkingLots, { foreignKey: "parkingLot_id" });
  };

  return ParkingSlots;
};
