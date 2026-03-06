module.exports = (sq, datatypes) => {
  const ParkingLots = sq.define(
    "ParkingLots",
    {
      id: {
        type: datatypes.INTEGER,
        primaryKey: true,
        allowNull: false,
        autoIncrement: true,
        unique: true,
      },
      name: {
        type: datatypes.STRING,
        allowNull: false,
      },
      address: {
        type: datatypes.STRING,
        allowNull: false,
      },
      totalSlots: {
        type: datatypes.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: true,
      tableName: "parking_lots",
    },
  );

  ParkingLots.associate = (model) => {
    ParkingLots.belongsTo(model.ParkingUsers, { 
      foreignKey: "owner_id",
      as: "owners", 
    });
    ParkingLots.hasMany(model.ParkingSlots, {
      foreignKey: "parkingLot_id",
      onDelete: "CASCADE",
    });
  };

  return ParkingLots
};
