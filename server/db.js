const Sequelize = require('sequelize');

const sequelize = new Sequelize('LemonLoftReservations', 'root', 'password', {
  host: process.env.NODE_ENV === 'production' ? 'database' : '',
  dialect: 'mysql',
  pool: {
    max: 5,
    min: 0,
    idle: 10000,
  },
  logging: false,
});

sequelize
  .authenticate()
  .then(() => {
    console.log('Connection has been established successfully.');
  })
  .catch((err) => {
    console.log('Unable to connect to the database: ', err);
  });

const Loft = sequelize.define('lofts', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  description: {
    type: Sequelize.STRING(255),
  },
  paragraph: {
    type: Sequelize.STRING(511),
  },
  pricePerNight: {
    type: Sequelize.DECIMAL,
  },
  cleaningFee: {
    type: Sequelize.DECIMAL,
  },
  serviceFee: {
    type: Sequelize.DECIMAL,
  },
  rating: {
    type: Sequelize.DECIMAL,
  },
  url: {
    type: Sequelize.STRING(100),
  },
  reviewCount: {
    type: Sequelize.INTEGER,
  },
}, {
  timestamps: false,
});

const Reservation = sequelize.define('reservations', {
  res_id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  loft_id: {
    type: Sequelize.INTEGER,
  },
  startDate: {
    type: Sequelize.DATE,
  },
  endDate: {
    type: Sequelize.DATE,
  },
}, {
  timestamps: false,
});

module.exports.getAllLofts = (cb) => {
  Loft.findAll()
    .then((allLoftData) => {
      cb(null, allLoftData);
    })
    .catch((err) => {
      console.log('There was an error getting all loft data: ', err);
    });
};

module.exports.getOneLoft = (hostId, cb) => {
  const loftId = Number(hostId);
  sequelize.query(`SELECT * FROM reservations, lofts WHERE reservations.loft_id = ${loftId} AND lofts.id = ${loftId}`)
    .then((data) => {
      cb(null, data);
    })
    .catch((err) => {
      console.log('There was an error getting loft data: ', err);
    });
};

module.exports.addOneReservation = (reservation, cb) => {
  Reservation.upsert(reservation)
    .then(() => {
      cb(null, 'SUCCESS');
    })
    .catch((err) => {
      console.log('There was an error upserting in sqlize: ', err);
    });
};

module.exports.sequelize = sequelize;
module.exports.Loft = Loft;
module.exports.Reservation = Reservation;
