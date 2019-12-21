const MongoDB = require('mongodb');
const MongoClient = MongoDB.MongoClient;
const url = 'mongodb://localhost:27017';
const dbName = 'reservations';
const homeCollection = 'home';
const userCollection = 'user';

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
MongoClient.connect(url, (err, client) => {
  if (err) { throw err } 
  const db = client.db(dbName);
  db.createCollection(userCollection, (err, res) => {
    if (err) { throw err }
    console.log(`collection ${userCollection} created!`);
    db.createCollection(homeCollection, (err, res) => {
      if (err) { throw err }
      console.log(`collection ${homeCollection} created!`);
      process.exit(0);
    });
  });
});

module.exports.insertManyUsers = (arrayOfCollections, callback) => {
  MongoClient.connect(url, (err, client) => {
    if (err) { throw err }
    const db = client.db(dbName);
    const collection = db.collection('user');
    collection.insertMany(arrayOfCollections, callback);
  });
};

module.exports.insertManyHomes = (arrayOfCollections, callback) => {
  MongoClient.connect(url, (err, client) => {
    if (err) { throw err }
    const db = client.db(dbName);
    const collection = db.collection('home');
    collection.insertMany(arrayOfCollections, callback);
  });
};