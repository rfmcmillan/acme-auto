const Sequelize = require('sequelize');
const { DataTypes, UUID, UUIDV4 } = Sequelize;
const db = new Sequelize(
  process.env.DATABASE_URL || 'postgres://localhost/acme_auto_db'
);

const User = db.define('user', {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  name: {
    type: DataTypes.STRING,
  },
});

const Car = db.define('car', {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  name: {
    type: DataTypes.STRING,
  },
});

const Sale = db.define('sale', {
  id: { type: UUID, defaultValue: UUIDV4, primaryKey: true },
  extendedWarranty: {
    type: DataTypes.BOOLEAN,
    defaultValue: false,
  },
});

Sale.belongsTo(User);
Sale.belongsTo(Car);

const syncAndSeed = async () => {
  try {
    await db.sync({ force: true });
    const [moe, lucy, larry] = await Promise.all(
      ['moe', 'lucy', 'larry'].map((name) => User.create({ name }))
    );
    const [ford, toyota, audi] = await Promise.all(
      ['ford', 'toyota', 'jeep'].map((name) => Car.create({ name }))
    );
    const sales = await Promise.all([
      Sale.create({ userId: moe.id, carId: ford.id }),
      Sale.create({ userId: moe.id, carId: ford.id, extendedWarranty: true }),
    ]);
  } catch (error) {
    console.log(error);
  }
};

module.exports = { models: { User, Car, Sale }, db, syncAndSeed };
