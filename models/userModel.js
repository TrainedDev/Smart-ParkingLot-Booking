module.exports = (sq, datatypes) => {
  const ParkingUsers = sq.define(
    "ParkingUsers",
    {
      id: {
        type: datatypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
        unique: true,
      },
      username: {
        type: datatypes.STRING,
        allowNull: false,
      },
      email: {
        type: datatypes.STRING,
        allowNull: false,
        unique: true,
        isEmail: {
          msg: "provide correct email",
        },
      },
      password: {
        type: datatypes.STRING,
        allowNull: false,
      },
      role: {
        type: datatypes.STRING,
         validate:{
          isIn:{
            args: [["customer", "owner", "admin"]],
            msg: "role must be either customer, owner or admin",
          } 
        },
        defaultValue: "customer",
      }, 
    },
    {
      timestamps: true,
      tableName: "parking_users",
    },
  );

  ParkingUsers.associate = ((model) => {
    ParkingUsers.hasMany(model.ParkingLots, { foreignKey: "owner_id", as: "parkingLots", onDelete: "CASCADE" });
    ParkingUsers.hasMany(model.ParkingBookings, {foreignKey: "customer_id", as: "bookings", onDelete: "CASCADE" });
  }); 

  return ParkingUsers;
};
