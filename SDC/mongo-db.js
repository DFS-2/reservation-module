const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'reservations';
const client = new MongoClient(url, {useUnifiedTopology: false});
const connection = client.connect();

const userCollectionSchema = {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["_id", "username", "rating"],
    properties: {
      _id: {
        bsonType: "integer",
        description: "unique id for each user"
      },
      username: {
        bsonType: "string",
        description: "name of the user"
      },
      rating: {
        bsonType: "string",
        description: "rating of the user out of 5"
      }
    }
  }
  }
};

const homeCollectionSchema = {
  validator: { $jsonSchema: {
    bsonType: "object",
    required: ["_id", "title", "priceperadult", "priceperchild", "cleaningfee", "rating", "ratingcount", "host_id", "reservations"],
    properties: {
      _id: {
        bsonType: "integer",
        description: "unique id for each house listed"
      },
      title: {
        bsonType: "string",
        description: "title of the posting is required",
      },
      priceperadult: {
        bsonType: "string",
        description: "price per adult occupant per night"
      },
      priceperchild: {
        bsonType: "string",
        description: "price per child occupant per night"
      },
      cleaningfee: {
        bsonType: "string",
        description: "fixed cleaning fee per stay"
      },
      rating: {
        bsonType: "string",
        description: "rating of the house by other users out of 5"
      },
      ratingcount: {
        bsonType: "integer",
        description: "total number of sample space for overall review"
      },
      host_id: {
        bsonType: "integer",
        description: "host identification in user collection"
      },
      reservations: {
        bsonType: [ "array" ],
        required: ["startdate", "enddate", "adultcount", "childrencount", "user_id", "amountpaid", "amountowed"], 
        properties: {
          startdate: "date",
          enddate: "date",
          adultcount: "integer",
          childrencount: "integer",
          user_id: "integer",
          amountpaid: "string",
          amountowed: "string"
        },
        description: "the reservations for the house"
      }
    }
  }
  }
};

// =========== database initialization ===========
// MongoClient.connect(url, (err, client) => {
//   if (err) { throw err } 
//   const db = client.db(dbName);
//   db.createCollection(userCollection, (err, res) => {
//     if (err) { throw err }
//     console.log(`collection ${userCollection} created!`);
//     db.createCollection(homeCollection, (err, res) => {
//       if (err) { throw err }
//       console.log(`collection ${homeCollection} created!`);
//     });
//   });
// });

module.exports.insertManyUsers = (arrayOfCollections) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, {useUnifiedTopology: false}, (err, client) => {
      if (err) { 
        reject(err);
      } else {
        const db = client.db(dbName);
        const collection = db.collection('user');
        resolve(collection.insertMany(arrayOfCollections).then(() => {
          client.close();
        }).catch((err) => {
          console.log('insertmanyuser err, ', err);
        }));
      }
    });
  });
};


module.exports.insertManyHomes = (arrayOfCollections) => {
  return new Promise((resolve, reject) => {
    MongoClient.connect(url, {useUnifiedTopology: false}, (err, client) => {
      if (err) { 
        reject(err);
      } else {
        const db = client.db(dbName);
        const collection = db.collection('home');
        resolve(collection.insertMany(arrayOfCollections).then(() => {
          client.close();
        }).catch((err) => {
          console.log('insertmanyhomes err, ', err);
        }));
      }
    });
  });
};

// module.exports.createIndex = (collectionName) => {
//   return new Promise((resolve, reject) => {
//     MongoClient.connect(url, {useUnifiedTopology: false}, (err, client) => {
      
//     });
//   })
// };

// ======================= READ =======================
module.exports.getTenHomes = (totalHomeNumber) => {
  return new Promise((resolve, reject) => {
    connection.then(() => {
      const db = client.db(dbName);
      const collection = db.collection('home');
      const startPoint = Math.floor(Math.random() * totalHomeNumber - 10);
      resolve(collection.find({_id: {$gt: startPoint - 1, $lt: startPoint + 10}}).toArray().then((result) => {
        return result;
      }).catch((err) => {
        console.log('error while retrieving 10 random homes... ', err);
      }));
    })
  });
};

module.exports.getTenUsers = (totalUserNumber) => {
  return new Promise((resolve, reject) => {
    const db = client.db(dbName);
    const collection = db.collection('user');
    const startPoint = Math.floor(Math.random() * totalUserNumber - 10);
    resolve(collection.find({_id: {$gt: startPoint - 1, $lt: startPoint + 10}}).toArray().then((result) => {
      return result;
    }).catch(() => {
      console.log('error while retrieving 10 random users... ', err);
    }));
  });
};

module.exports.getOneHome = (home_id) => {
  return new Promise((resolve, reject) => {
    const db = client.db(dbName);
    const collection = db.collection('home');
    resolve(collection.findOne({_id: home_id})
      .catch((err) => {
        console.log('error while retrieving one single home... ', err);
      }));
  });
};

module.exports.getOneUser = (user_id) => {
  return new Promise((resolve, reject) => {
    const db = client.db(dbName);
    const collection = db.collection('user');
    resolve(collection.findOne({_id: user_id})
      .catch((err) => {
        console.log('error while retrieving one single home... ', err);
      }));
  });
};

// ======================= WRITE =======================
module.exports.addOneReservation = (reservationObj) => {
  return new Promise((resolve, reject) => {
    const db = client.db(dbName);
    const collection = db.collection('home');
    resolve(collection.findOneAndUpdate({_id: reservationObj.home_id}, (entry) => {
      debugger;
    }).then((entry) => {
        debugger;
        if (entry === undefined) {

        }
      }));
  });
};